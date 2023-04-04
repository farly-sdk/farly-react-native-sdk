import { NativeModules, Platform } from 'react-native';
import type { FeedElement, OfferWallRequest } from './types';

const LINKING_ERROR =
  `The package 'react-native-farly-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const FarlySdk = NativeModules.FarlySdk
  ? NativeModules.FarlySdk
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/**
 * Must be called before any other methods
 */
const setup = ({
  apiKey,
  publisherId,
}: {
  apiKey: string;
  publisherId: string;
}): Promise<void> => {
  return FarlySdk.setup({
    apiKey,
    publisherId,
  });
};

/**
 * Your users will get more offers if you obtain their authorization to use their Advertising ID.
 * You should request this authorization early in your app, and at least before calling any Farly SDK’s request.
 * The SDK will use the advertising ID only if authorized by the user.
 *
 * _**On iOS**_
 *
 * the user will be prompted to authorize the use of their advertising ID. You need to add the following key to your Info.plist file:
 * ```xml
 * <key>NSUserTrackingUsageDescription</key>
 * <string>YOUR TEXT HERE</string>
 * ```
 *
 * _**On Android**_
 *
 * //TODO: Add Android implementation
 *
 */
const requestAdvertisingIdAuthorization = (): Promise<boolean> => {
  return FarlySdk.requestAdvertisingIdAuthorization();
};

const transformRequest = (req: OfferWallRequest): any => {
  const { userSignupDate } = req;
  return {
    ...req,
    userSignupDate: userSignupDate?.getTime(),
  };
};

const getHostedOfferwallUrl = (
  req: OfferWallRequest
): Promise<string | undefined> => {
  return FarlySdk.getHostedOfferwallUrl(transformRequest(req));
};

const showOfferwallInBrowser = (req: OfferWallRequest): Promise<void> => {
  return FarlySdk.showOfferwallInBrowser(transformRequest(req));
};

const showOfferwallInWebview = (req: OfferWallRequest): Promise<void> => {
  return FarlySdk.showOfferwallInWebview(transformRequest(req));
};

const getOfferwall = async (req: OfferWallRequest): Promise<FeedElement[]> => {
  return FarlySdk.getOfferwall(transformRequest(req));
};

const Farly = {
  setup,
  requestAdvertisingIdAuthorization,
  getHostedOfferwallUrl,
  showOfferwallInBrowser,
  showOfferwallInWebview,
  getOfferwall,
};

export default Farly;
