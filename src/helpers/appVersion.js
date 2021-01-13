import VersionNumber from 'react-native-version-number';
import Config from 'react-native-config';
export const appVersion =
  typeof VersionNumber.appVersion === 'string' &&
  (typeof VersionNumber.buildVersion === 'string' ||
    typeof VersionNumber.buildVersion === 'number')
    ? `${Config.APP_ENV}-v${VersionNumber.appVersion}+${VersionNumber.buildVersion}`
    : null;

export const buildVersion = VersionNumber.buildVersion;
