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
               'MWB_CODE_MASK_39' : {'username':'','key':''},
               'MWB_CODE_MASK_93' : {'username':'','key':''},
               'MWB_CODE_MASK_128' : {'username':'wachuy@yahoo.com','key':'428FB25660F7D0DDCBD5DDC13FC2624DC3004048D83AC6B16799D2D1B869422F'},
               'MWB_CODE_MASK_AZTEC' : {'username':'','key':''},
               'MWB_CODE_MASK_DM' : {'username':'','key':''},
               'MWB_CODE_MASK_EANUPC' : {'username':'','key':''},
               'MWB_CODE_MASK_PDF' : {'username':'','key':''},
               'MWB_CODE_MASK_QR' : {'username':'wachuy@yahoo.com','key':'0C7916A58145835F8C6C661E669C2166872ABAD1ACC5122C4C30939C1E880E8C'},
               'MWB_CODE_MASK_RSS' : {'username':'','key':''},
               'MWB_CODE_MASK_CODABAR' : {'username':'','key':''},
               'MWB_CODE_MASK_DOTCODE' : {'username':'','key':''}
           },
           'iOS' :{
               'MWB_CODE_MASK_25' : {'username' : '', 'key' : ''},
               'MWB_CODE_MASK_39' : {'username':'','key':''},
               'MWB_CODE_MASK_93' : {'username':'','key':''},
               'MWB_CODE_MASK_128' : {'username':'wachuy@yahoo.com','key':'59D634FC2660F9173606AE79FC67FB7C74497B59C3CAE62598585403435F02B0'},
               'MWB_CODE_MASK_AZTEC' : {'username':'','key':''},
               'MWB_CODE_MASK_DM' : {'username':'','key':''},
               'MWB_CODE_MASK_EANUPC' : {'username':'','key':''},
               'MWB_CODE_MASK_PDF' : {'username':'','key':''},
               'MWB_CODE_MASK_QR' : {'username':'wachuy@yahoo.com','key':'EC9BF9F6645469E1104003230B1B525E3F2C7A70A4EC2E293E1D84B20C9E3B5C'},
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
          alert(scanResult);
            
         
            doneScanning(event,scanResult);
        }
}