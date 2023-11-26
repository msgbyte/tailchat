#import "AppDelegate.h"
#import "RNCConfig.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // 接入个推
	[GeTuiSdk startSdkWithAppId:[RNCConfig envFor:@"GETUI_APPID"] appKey:[RNCConfig envFor:@"GETUI_APPKEY"] appSecret:[RNCConfig envFor:@"GETUI_APPSECRET"] delegate:[RCTGetuiModule sharedGetuiModule] launchingOptions:launchOptions];
  // APNs
  [GeTuiSdk registerRemoteNotification: (UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge)];

  self.moduleName = @"Tailchat";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


@end
