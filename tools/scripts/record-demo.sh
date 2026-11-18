#!/bin/zsh
# Records the demo GIF for one picker's README on the Android emulator.
#
# Usage: tools/scripts/record-demo.sh date|time
#
# Needs: a running Medium_Phone_API_37.0 emulator (1080x2400) with a debug
# build of the demo app installed, Metro running (yarn nx start
# react-native-user-interface), and ffmpeg. The tap positions match that
# emulator; update them if the layout changes.
set -e
A=${ANDROID_HOME:-$HOME/Library/Android/sdk}/platform-tools/adb
SP=$(mktemp -d)
which=$1
out=${0:a:h}/../../libs/$which-picker-modal/media/demo.gif
tap() { $A shell input tap $1 $2; sleep ${3:-1.2}; }

# Normal animation speed and no reduced motion (Detox turns these off).
for s in window_animation_scale transition_animation_scale animator_duration_scale; do $A shell settings put global $s 1; done

$A reverse tcp:8081 tcp:8081 >/dev/null
$A shell am force-stop com.reactnativeuserinterface
$A shell monkey -p com.reactnativeuserinterface -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1
sleep 22

if [[ $which == date ]]; then tap 540 760 4; else tap 540 1210 4; fi

$A shell rm -f /sdcard/demo.mp4
$A shell screenrecord --bit-rate 8000000 --time-limit 20 /sdcard/demo.mp4 &
REC=$!
sleep 1.5

if [[ $which == date ]]; then
  tap 800 962 1.8      # Pick a date
  tap 965 715 1.2      # next month
  tap 965 715 1.2      # and again
  tap 792 715 1.2      # back a month (to December)
  tap 680 1393 1.2     # pick Thursday 24th
  tap 540 2020 2.5     # Confirm
else
  tap 800 962 1.8                              # Pick a time
  $A shell input swipe 850 1700 250 1700 900; sleep 1.5   # drag slider
  $A shell input swipe 300 1700 700 1700 600; sleep 1.5   # drag back
  tap 915 1372 0.8                             # +
  tap 915 1372 1.2                             # +
  tap 540 2020 2.5                             # Confirm
fi

sleep 1
$A shell pkill -INT screenrecord || true
wait $REC 2>/dev/null || true
sleep 1
$A pull /sdcard/demo.mp4 $SP/demo-$which.mp4 >/dev/null

# Trim the first second, hold the last frame for 2s, scale to 320px wide, and build a palette for clean colours.
ffmpeg -y -loglevel error -ss 1 -i $SP/demo-$which.mp4 \
  -vf "tpad=stop_mode=clone:stop_duration=2,fps=15,scale=320:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4" \
  $out
ls -la $out
