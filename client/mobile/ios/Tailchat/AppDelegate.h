#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#if __has_include(<RCTGetuiModule/RCTGetuiModule.h>)
#import <RCTGetuiModule/RCTGetuiModule.h>
#elif __has_include("RCTGetuiModule.h")
#import "RCTGetuiModule.h"
#elif __has_include(<GtSdkRN/RCTGetuiModule.h>)
#import <GtSdkRN/RCTGetuiModule.h>
#endif


@interface AppDelegate : RCTAppDelegate

@end
