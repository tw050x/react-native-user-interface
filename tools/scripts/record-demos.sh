#!/bin/zsh
# Records the README demo GIFs for both pickers on one platform.
#
# Usage: tools/scripts/record-demos.sh android|ios
#
# Runs apps/react-native-user-interface-e2e/src/demo/pickers.demo.ts with
# Detox, which records the screen, then converts each video to a GIF at
# libs/<package>/media/demo-<platform>.gif.
#
# Needs: a debug build of the demo app (yarn nx run
# react-native-user-interface-e2e:build-android or build-ios), Metro running
# (yarn nx start react-native-user-interface), ffmpeg, and for iOS
# applesimutils.
#
# Set DETOX_DEVICE to pin the device: a simulator UDID on iOS (useful when
# several iPhone 17 simulators exist) or an AVD name on Android.
set -e
platform=$1
case $platform in
  android) configuration=android.emu.debug ;;
  ios) configuration=ios.sim.debug ;;
  *) echo "Usage: $0 android|ios" >&2; exit 1 ;;
esac

root=${0:a:h:h:h}
artifacts=$root/tmp/demo-artifacts/$platform
rm -rf $artifacts

if [[ $platform == android ]]; then
  # Normal animation speed, so the modals slide in as users see them.
  adb=${ANDROID_HOME:-$HOME/Library/Android/sdk}/platform-tools/adb
  for s in window_animation_scale transition_animation_scale animator_duration_scale; do $adb shell settings put global $s 1; done
fi

device_args=()
if [[ -n $DETOX_DEVICE ]]; then
  # A config that extends the project's one, with the device pinned.
  config=$artifacts/detoxrc.json
  mkdir -p $artifacts
  if [[ $platform == ios ]]; then device='{"type":"ios.simulator","device":{"id":"'$DETOX_DEVICE'"}}'; key=simulator
  else device='{"type":"android.emulator","device":{"avdName":"'$DETOX_DEVICE'"}}'; key=emulator; fi
  echo '{"extends":"'$root'/apps/react-native-user-interface-e2e/.detoxrc.json","devices":{"'$key'":'$device'}}' > $config
  device_args=(--config-path $config)
fi

cd $root/apps/react-native-user-interface-e2e
$root/node_modules/.bin/detox test \
  --configuration $configuration \
  $device_args \
  --record-videos all \
  --artifacts-location $artifacts \
  --testMatch '**/*.demo.ts' \
  src/demo/pickers.demo.ts

for package in date-picker-modal time-picker-modal; do
  video=$(find $artifacts -path "*Demos $package*" -name '*.mp4' | head -1)
  [[ -n $video ]] || { echo "No video recorded for $package" >&2; exit 1; }
  out=$root/libs/$package/media/demo-$platform.gif
  # Hold the last frame, play still stretches 3x faster
  # (Detox idles between actions), 300px wide, shared palette.
  ffmpeg -y -loglevel error -i $video \
    -vf "tpad=stop_mode=clone:stop_duration=1.5,fps=15,mpdecimate=max=2,setpts=N/15/TB,scale=300:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4" \
    $out
  echo "Wrote $out ($(du -h $out | cut -f1))"
done
