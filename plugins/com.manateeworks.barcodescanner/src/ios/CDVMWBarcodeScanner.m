//
//  CDVMWBarcodeScanner.m
//  CameraDemo
//
//  Created by vladimir zivkovic on 5/8/13.
//
//

#import "CDVMWBarcodeScanner.h"
#import "BarcodeScanner.h"
#import "MWScannerViewController.h"
#import <Cordova/CDV.h>


@implementation CDVMWBarcodeScanner


NSString *callbackId;
NSMutableDictionary *customParams = nil;

- (void)initDecoder:(CDVInvokedUrlCommand*)command
{
    [MWScannerViewController initDecoder];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}

- (void)startScanner:(CDVInvokedUrlCommand*)command
{
    MWScannerViewController *scannerViewController = [[MWScannerViewController alloc] initWithNibName:@"MWScannerViewController" bundle:nil];
    scannerViewController.delegate = self;
    scannerViewController.customParams = customParams;
    [self.viewController presentViewController:scannerViewController animated:YES completion:^{}];
#if !__has_feature(objc_arc)
    callbackId= [command.callbackId retain];
#else
    callbackId= command.callbackId;
#endif
}


- (void)scanningFinished:(NSString *)result withType:(NSString *)lastFormat isGS1: (bool) isGS1 andRawResult: (NSData *) rawResult
{
    CDVPluginResult* pluginResult = nil;
    
    NSMutableArray *bytesArray = [[NSMutableArray alloc] init];
    unsigned char *bytes = (unsigned char *) [rawResult bytes];
    for (int i = 0; i < rawResult.length; i++){
        [bytesArray addObject:[NSNumber numberWithInt: bytes[i]]];
    }
    
    NSMutableDictionary *resultDict = [[NSMutableDictionary alloc] initWithObjects:[NSArray arrayWithObjects:result, lastFormat, bytesArray, [NSNumber numberWithBool:isGS1],nil] forKeys:[NSArray arrayWithObjects:@"code", @"type",@"bytes", @"isGS1", nil]];
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:resultDict];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
    
}

- (void)registerCode:(CDVInvokedUrlCommand*)command
{
    int codeMask = [[command.arguments objectAtIndex:0] intValue];
    char * userName = (char *) [[command.arguments objectAtIndex:1] UTF8String];
    char * key =(char *) [[command.arguments objectAtIndex:2] UTF8String];
    MWB_registerCode(codeMask, userName, key);
}

- (void)setActiveCodes:(CDVInvokedUrlCommand*)command
{
    int codeMask = [[command.arguments objectAtIndex:0] intValue];
    MWB_setActiveCodes(codeMask);
}

- (void)setActiveSubcodes:(CDVInvokedUrlCommand*)command
{
    int codeMask = [[command.arguments objectAtIndex:0] intValue];
    int subCodeMask = [[command.arguments objectAtIndex:1] intValue];
    MWB_setActiveSubcodes(codeMask, subCodeMask);
}

- (int)getLastType:(CDVInvokedUrlCommand*)command
{
    return MWB_getLastType();
}

- (void)setFlags:(CDVInvokedUrlCommand*)command
{
    int codeMask = [[command.arguments objectAtIndex:0] intValue];
    int flags = [[command.arguments objectAtIndex:1] intValue];
    MWB_setFlags(codeMask, flags);
}

- (void)setMinLength:(CDVInvokedUrlCommand*)command
{
    int codeMask = [[command.arguments objectAtIndex:0] intValue];
    int minLength = [[command.arguments objectAtIndex:1] intValue];
    MWB_setMinLength(codeMask, minLength);
}

- (void)setDirection:(CDVInvokedUrlCommand*)command
{
    int direction = [[command.arguments objectAtIndex:0] intValue];
    MWB_setDirection(direction);
}

- (void)setScanningRect:(CDVInvokedUrlCommand*)command
{
    int codeMask = [[command.arguments objectAtIndex:0] intValue];
    int left = [[command.arguments objectAtIndex:1] intValue];
    int top = [[command.arguments objectAtIndex:2] intValue];
    int width = [[command.arguments objectAtIndex:3] intValue];
    int height = [[command.arguments objectAtIndex:4] intValue];
    
    MWB_setScanningRect(codeMask, left, top, width, height);
}

- (void)setLevel:(CDVInvokedUrlCommand*)command
{
    int level = [[command.arguments objectAtIndex:0] intValue];
    MWB_setLevel(level);
}

- (void)setInterfaceOrientation:(CDVInvokedUrlCommand*)command
{
    NSString *orientation = [command.arguments objectAtIndex:0];
    UIInterfaceOrientationMask interfaceOrientation = UIInterfaceOrientationMaskLandscapeLeft;
    
    if ([orientation isEqualToString:@"Portrait"]){
        interfaceOrientation = UIInterfaceOrientationMaskPortrait;
    }
    if ([orientation isEqualToString:@"LandscapeLeft"]){
        interfaceOrientation = UIInterfaceOrientationMaskLandscapeLeft;
    }
    if ([orientation isEqualToString:@"LandscapeRight"]){
        interfaceOrientation = UIInterfaceOrientationMaskLandscapeRight;
    }
    
    [MWScannerViewController setInterfaceOrientation:interfaceOrientation];
    
}

- (void)setOverlayMode:(CDVInvokedUrlCommand*)command{
    [MWScannerViewController setOverlayMode:[[command.arguments objectAtIndex:0] intValue]];
}

- (void)enableHiRes:(CDVInvokedUrlCommand*)command
{
    bool hiRes = [[command.arguments objectAtIndex:0] boolValue];
    [MWScannerViewController enableHiRes:hiRes];
}

- (void)enableFlash:(CDVInvokedUrlCommand*)command
{
    bool flash = [[command.arguments objectAtIndex:0] boolValue];
    [MWScannerViewController enableFlash:flash];
}

- (void)enableZoom:(CDVInvokedUrlCommand*)command
{
    bool zoom = [[command.arguments objectAtIndex:0] boolValue];
    [MWScannerViewController enableZoom:zoom];
}

- (void)turnFlashOn:(CDVInvokedUrlCommand*)command
{
    bool flash = [[command.arguments objectAtIndex:0] boolValue];
    [MWScannerViewController turnFlashOn:flash];
}

- (void)setZoomLevels:(CDVInvokedUrlCommand*)command
{
    [MWScannerViewController setZoomLevels:[[command.arguments objectAtIndex:0] intValue] zoomLevel2:[[command.arguments objectAtIndex:1] intValue] initialZoomLevel:[[command.arguments objectAtIndex:2] intValue]];
}

- (void)setMaxThreads:(CDVInvokedUrlCommand*)command
{
    [MWScannerViewController setMaxThreads:[[command.arguments objectAtIndex:0] intValue]];
}

- (void)setCustomParam:(CDVInvokedUrlCommand*)command
{
    NSString *key = [command.arguments objectAtIndex:0];
    NSObject *value = [command.arguments objectAtIndex:1];
    
    if (customParams == nil){
        customParams = [[NSMutableDictionary alloc] init];
    }
    
    [customParams setObject:value forKey:key];
    
}





@end