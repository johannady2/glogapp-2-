var MWBSInitSpace = MWBSInitSpace || {};
/* Registration and settings are defined here, users will supply their own username and key depending on which platform they will use
    @params 
        mwbs - is the MWBScanner object, passed from the plugin function
        constants - the constants used for scanner settings
        dvc - the device on which it runs
 
 
 */
MWBSInitSpace.init = function(mwbs,constants,dvc){
    console.log('MWBSInitSpace.init Invoked at: '+ (new Date()).getTime());
    //change these registration settings to match your licence keys
    /* BEGIN Registration settings */

    //if your app doesn't work after setting license keys, try to uncomment the try-catch, and see what the error is
    
//    try{
        var mwregister = {
           'Android' : {
               'MWB_CODE_MASK_25' : {'username' : '', 'key' : ''},
               'MWB_CODE_MASK_39' : {'username':'mariden.miranda@yahoo.com','key':'88AD3B12780EE2B18DF8C81ECF47C81B167E9F71CADD4F47160F182FB9CCF1AF'},
               'MWB_CODE_MASK_93' : {'username':'mariden.miranda@yahoo.com','key':'07C3E7D5E3D2C93B4751A99AC53AFBB37C2064FD666D1F07764D8DE1A090FC52'},
               'MWB_CODE_MASK_128' : {'username':'mariden.miranda@yahoo.com','key':'2E1AAC4222338294CE3548BF97607593C8F394C95BD970D068F74886D5CA6386'},
               'MWB_CODE_MASK_AZTEC' : {'username':'','key':''},
               'MWB_CODE_MASK_DM' : {'username':'','key':''},
               'MWB_CODE_MASK_EANUPC' : {'username':'','key':''},
               'MWB_CODE_MASK_PDF' : {'username':'','key':''},
               'MWB_CODE_MASK_QR' : {'username':'mariden.miranda@yahoo.com','key':'13C3ABCA2EEF41A2BBEF85B787DBAA10240F242916CD27FF8AA87A220A8E5883'},
               'MWB_CODE_MASK_RSS' : {'username':'','key':''},
               'MWB_CODE_MASK_CODABAR' : {'username':'','key':''},
               'MWB_CODE_MASK_DOTCODE' : {'username':'','key':''}
           },
           'iOS' :{
               'MWB_CODE_MASK_25' : {'username' : '', 'key' : ''},
               'MWB_CODE_MASK_39' : {'username':'mariden.miranda@yahoo.com','key':'EA64BF77E3B5843754419F41BA2A18CAAC5732A6B4F0265256438E4BBD77664E'},
               'MWB_CODE_MASK_93' : {'username':'mariden.miranda@yahoo.com','key':'3DA7C79529E2E76B1A6765A81EB4BA440EE146220346638956E1BC13D56A5E8D'},
               'MWB_CODE_MASK_128' : {'username':'mariden.miranda@yahoo.com','key':'A7A205EB37F7A3CB0B63249F2257DBF9736469B4315B2F25438837BBB8A88B39'},
               'MWB_CODE_MASK_AZTEC' : {'username':'','key':''},
               'MWB_CODE_MASK_DM' : {'username':'','key':''},
               'MWB_CODE_MASK_EANUPC' : {'username':'','key':''},
               'MWB_CODE_MASK_PDF' : {'username':'','key':''},
               'MWB_CODE_MASK_QR' : {'username':'mariden.miranda@yahoo.com','key':'A13192078684C964571C644AAFDEBA5BB7DB0219996B98E07FC4D2EB2E44430C'},
               'MWB_CODE_MASK_RSS' : {'username':'','key':''},
               'MWB_CODE_MASK_CODABAR' : {'username':'','key':''},
               'MWB_CODE_MASK_DOTCODE' : {'username':'','key':''}
           },
           'Win32NT' : {
               'MWB_CODE_MASK_25' : {'username' : '', 'key' : ''},
               'MWB_CODE_MASK_39' : {'username':'','key':''},
               'MWB_CODE_MASK_93' : {'username':'','key':''},
               'MWB_CODE_MASK_128' : {'username':'','key':''},
               'MWB_CODE_MASK_AZTEC' : {'username':'','key':''},
               'MWB_CODE_MASK_DM' : {'username':'','key':''},
               'MWB_CODE_MASK_EANUPC' : {'username':'','key':''},
               'MWB_CODE_MASK_PDF' : {'username':'','key':''},
               'MWB_CODE_MASK_QR' : {'username':'','key':''},
               'MWB_CODE_MASK_RSS' : {'username':'','key':''},
               'MWB_CODE_MASK_CODABAR' : {'username':'','key':''},
               'MWB_CODE_MASK_DOTCODE' : {'username':'','key':''}
           }
        }
//    }
//    catch(e){
//        console.log(e);
//    }
    /* END registration settings */
    var platform = mwregister[dvc.platform];
    Object.keys(platform).forEach(function(reg_codes){
        mwbs['MWBregisterCode'](constants[reg_codes],platform[reg_codes]['username'],platform[reg_codes]['key']);
    });

    //settings portion, disable those that are not needed

    /* BEGIN settings CALLS */
        //if your code doesn't work after changing a few parameters, and there is no error output, uncomment the try-catch, the error will be output in your console
   try{
        /*UNCOMMENT the lines you wish to include in the settings */
        mwbs['MWBsetInterfaceOrientation'] (constants.OrientationPortrait);
        //['MWBsetOverlayMode'](constants.OverlayModeImage);
        //mwbs['MWBenableHiRes'](true);
        // mwbs['MWBenableFlash'](true);
        // mwbs['MWBsetActiveCodes'](constants.MWB_CODE_MASK_128 | constants.MWB_CODE_MASK_39);
        // mwbs['MWBsetLevel'](2);
        //mwbs['MWBsetFlags'](constants.MWB_CODE_MASK_39, constants.MWB_CFG_CODE39_EXTENDED_MODE);
        //  mwbs['MWBsetDirection'](constants.MWB_SCANDIRECTION_VERTICAL | constants.MWB_SCANDIRECTION_HORIZONTAL);
        //  mwbs['MWBsetScanningRect'](constants.MWB_CODE_MASK_39, 20,20,60,60);
        //  mwbs['MWBenableZoom'](true);
        //  mwbs['MWBsetZoomLevels'](200, 400, 0);
        //  mwbs['MWBsetCustomParam']('CUSTOM_PARAM','CUSTOM_VALUE');
        //  mwbs['MWBsetActiveSubcodes'](constants.MWB_CODE_MASK_25 | constants.MWB_SUBC_MASK_C25_INTERLEAVED);        
    }
    catch(e){
        console.log(e);
        
    }

    /* END settings CALLS */
    
    /* CUSTOM JAVASCRIPT CALLS */

};
//custom callback function, one that can be modified by the user
MWBSInitSpace.callback = function(result){
    console.log('MWBSInitSpace.callback Invoked at: '+ (new Date()).getTime());
    
     //result.code - string representation of barcode result
     //result.type - type of barcode detected
     //result.bytes - bytes array of raw barcode result
     
    //alert('Scan complete');
    if (result.type == 'Cancel'){
        //Perform some action on scanning canceled if needed
        $('.webdefault').click();
    } 
    else
        if (result && result.code){
            //navigator.notification.alert(result.code, function(){}, result.type, 'Close');
			scanResult = result.code;
         // alert(scanResult);
            
         
            doneScanning(event,scanResult);
        }
}