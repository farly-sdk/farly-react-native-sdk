#import <React/RCTBridgeModule.h>
@import Farly;

@interface RCT_EXTERN_MODULE(FarlySdk, NSObject)

RCT_EXTERN_METHOD(setup:(NSDictionary<NSString *, id> *)info
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(requestAdvertisingIdAuthorization:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getHostedOfferwallUrl:(NSDictionary<NSString *, id> *)info
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(showOfferwallInBrowser:(NSDictionary<NSString *, id> *)info
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(showOfferwallInWebview:(NSDictionary<NSString *, id> *)info
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getOfferwall:(NSDictionary<NSString *, id> *)info
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

@end
