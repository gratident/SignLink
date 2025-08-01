/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

#import "RCTModuleProviders.h"
#import <ReactCommon/RCTTurboModule.h>
#import <React/RCTLog.h>

@implementation RCTModuleProviders

+ (NSDictionary<NSString *, id<RCTModuleProvider>> *)moduleProviders
{
  static NSDictionary<NSString *, id<RCTModuleProvider>> *providers = nil;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    NSDictionary<NSString *, NSString *> * moduleMapping = @{
      		@"RNCWebViewModule": @"RNCWebViewModule", // react-native-webview
    };

    NSMutableDictionary *dict = [[NSMutableDictionary alloc] initWithCapacity:moduleMapping.count];

    for (NSString *key in moduleMapping) {
      NSString * moduleProviderName = moduleMapping[key];
      Class klass = NSClassFromString(moduleProviderName);
      if (!klass) {
        RCTLogError(@"Module provider %@ cannot be found in the runtime", moduleProviderName);
        continue;
      }

      id instance = [klass new];
      if (![instance respondsToSelector:@selector(getTurboModule:)]) {
        RCTLogError(@"Module provider %@ does not conform to RCTModuleProvider", moduleProviderName);
        continue;
      }

      [dict setObject:instance forKey:key];
    }

    providers = dict;
  });

  return providers;
}

@end
