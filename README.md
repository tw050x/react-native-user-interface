# React Native User Interface

> :warning: Use at your own risk.

> :warning: This project is currently an early work in progress and should not be used in production at this time.

The React Native User Interface project seeks to create complex UI for mobile apps. We aim to house over 100 components (currently at 2) that take care of input data and other interactions in an intuitive manner.

## Components

* [`<DatePickerModal />`](https://github.com/tw050x/react-native-user-interface/tree/main/libs/date-picker-modal)
* [`<TimePickerModal />`](https://github.com/tw050x/react-native-user-interface/tree/main/libs/time-picker-modal)

## Installation

To install dependencies run `yarn` or `yarn install` from the root of the project.

## Demo Applications

> :warning: Work is currently work in progress.

The demo application can be found in `apps/react-native-user-interface/`. Alongside an end-to-end project that runs automated testing, produces screenshots and video of the testing.

## Releasing

Each library is versioned and published to npm on its own, from GitHub Actions:

1. Open **Actions → Release → Run workflow**.
2. Pick the package and the version bump (patch, minor or major).
3. Leave **Dry run** ticked to preview the new version and release notes, then run it again with it unticked to release.

A release lints and tests the package, bumps its version, commits and tags it (for example `date-picker-modal@0.2.1`), creates a GitHub release with notes from the commit messages, and publishes to npm with provenance.

Release notes are grouped by the commit message prefix: `Breaking:`, `Feature:`/`New:`, `Upgrade:`, `Update:`, `Fix:` and `Docs:`. Commits starting `Chore:` or `Build:` are left out.

Publishing uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers), so there is no npm token to manage. Each package's settings on npmjs.com must list this repository and the `release.yml` workflow as a trusted publisher.
