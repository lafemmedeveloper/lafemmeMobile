fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
### bump_version
```
fastlane bump_version
```
Bump the app versions and tag a new release
### install_javascript_dependencies
```
fastlane install_javascript_dependencies
```
Install javascript dependencies via yarn
### clean_javascript_cache
```
fastlane clean_javascript_cache
```
Clean react native cache files
### reinstall_dependencies
```
fastlane reinstall_dependencies
```

### ensure_git_cleaned
```
fastlane ensure_git_cleaned
```


----

## iOS
### ios build
```
fastlane ios build
```
Build the iOS app
### ios clean_cache
```
fastlane ios clean_cache
```
Clean cache
### ios install_dependencies
```
fastlane ios install_dependencies
```
Install dependencies
### ios beta
```
fastlane ios beta
```
Submit a new iOS build to Apple TestFlight
### ios release
```
fastlane ios release
```
Submit a new iOS build to the Apple App Store

----

## Android
### android build
```
fastlane android build
```
Build the Android app with the specified build type and environment
### android clean_cache
```
fastlane android clean_cache
```
Clean cache
### android install_dependencies
```
fastlane android install_dependencies
```
Install dependencies
### android beta
```
fastlane android beta
```
Submit a new Android build to the Google Play beta channel
### android release
```
fastlane android release
```
Submit a new Android build to the Google Play production channel

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
