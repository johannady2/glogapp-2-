/*-----------------------------------------------------------------*/
/*------------------------Database-----------------------------------*/
/*------------------------------------------------------------------*/
var networkstatus = '';
//var isOffline = 'onLine' in navigator && !navigator.onLine;
var ref;

function onBodyLoad()
{   
    document.addEventListener("offline", onDeviceOffline, false);
    document.addEventListener("online", onDeviceOnline, false);
    
    /*these don't work*/
     ref.addEventListener('loadstart', function(event) { /*alert('start: ' + event.url);*/ });
     ref.addEventListener('loadstop', function(event) { /*alert('stop: ' + event.url);*/ });
     ref.addEventListener('loaderror', function(event) { /*alert('error: ' + event.message);*/ });
     ref.addEventListener('exit', function(event) { /*alert(event.type);*/});

    
}
  //listen for changes
  

/*~~~~~~~~~~~~~~~~~~~~~~GLOBAL VARIABLES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var db;
var idForSinglePage;//uses primary key to open singlepage
var scanResult;//the barcode you get from scanning
var orderidtoedit;//index of cart item. for editorder page.


var globalorderFromSwitch;//switch for catalogue or search because they use the same query
var globalorderedFrom;//when single page is opened.

//FOR toNormalString AND toCustomString
//how to use: toNormalString(str); then put returnedNormal/returnedCustom to where str is supposed to be.
var returnedNormal;//because if() return has weird results. and if()else(return) returns undefined.
var returnedCustom;

var returnedReplaceQuote;

var RecordCounter = 0;//for reccursive function  for rendering catalogue items. because for loop won't wait until select statement is successful.
var txparam; // tx ca not be passed as a parameter to nextRecord() as callback so made this global variable.
var resulstparam;//results ca not be passed as a parameter to nextRecord()as callback so made this global variable.


//if variable is undefined, define.
if(localStorage.BarcodeInvtyCat == null)
{
    
    /*FOR LOCALSTORAGE TO ARRAY*/
    //NOTE: x,y,z
    var cartSKUArr;
	var cartpicturefilenameArr;
    var cartbarcodeArr;
    var cartbrandArr;
    var cartfulldescriptionArr;
	var cartcataloguetitleArr;
    var cartpromonameArr;
	var cartpromoPriceArr;
	var cartpromoEndDateArr;
	var cartpromoStartDateArr;
    var cartQuantityArr;
    var cartsubtotalArr;
	var cartorderedFromArr;//to know whether item was ordered from scan or catalogue or search


    
    /*initialized on addToList click*/
    //NOTE: x,y,z,
    //always add "," at the end of array when storing as localStorage
    localStorage.sku = '';
	localStorage.picturefilename = '';
	localStorage.BarcodeInvtyCat = '';
	localStorage.BrandInvtyCat = '';
	localStorage.fulldescription = '';
	localStorage.cataloguetitle = '';
    localStorage.promoname = '';
    localStorage.promoPrice = '';
	localStorage.promoenddate = '';
	localStorage.promostartdate = '';
    localStorage.quantity = '';
    localStorage.subtotal = '';
    localStorage.orderedfrom ='';

    /*initialized on renderCart*/
    localStorage.orderid='';
    
    



}
var numberOfItemsRemovedSofar = 0;//for remove items from cart function
var responsecount = 0;//set back to zero whenever rendercartlist
var varlidORDERIDS = [];//set back to zero whenever rendercartlist
	//-------------FOR API
					//--INVENTORY_MASTER_CATALOGUE
					var RowNumber_InvtyCatARR = [];
					var SysPk_InvtyCatARR =[];
					var	SysFk_CatMstr_InvtyCatARR = [];
					var	SKU_InvtyCatARR =[];
					var PictureFileName_InvtyCatARR= [];
					var	Barcode_InvtyCatARR = [];
					var	Brand_InvtyCatARR = [];
					var	FullDescription_InvtyCatARR = [];
					var	PromoName_InvtyCatARR = [];
					var	PromoPrice_InvtyCatARR = [];

                    var invtycatRC = 0;
                    var invtycattxparam;
					//--//INVENTORY_MASTER_CATALOGUE


					//--CATALOGUE_MASTER
					var RowNumber_CatMstrARR = [];
					var SysPk_CatMstrARR =[];
					var	SysSeq_CatMstrARR = [];
					var	LastUpdatedDate_CatMstrARR =[];
					var CatalogueTitle_CatMstrARR= [];
					var	PromoEndDate_CatMstrARR = [];
					var	PromoStartDate_CatMstrARR = [];

                    var catmstrRC = 0;
                    var catmstrtxparam;
					//--//CATALOGUE_MASTER


                    //--SETTINGS
                    var MinimumPrice_SettingsARR = [];

                    var settingsRC = 0;
                    var settingstxparam;
                    //--//SETTINGS

                    
                    //--CATEGORY_MASTER
                    var RowNumber_CatgyMstrARR = [];
                    var SysPk_CatgyMstrARR = [];
                    var CategoryName_CatgyMstrARR = [];

                    var catgymstrRC = 0;
                    var catgymstrtxparam;
                    //--//CATEGORY_MASTER 


                    //--INVENTORY_MASTER_CATALOGUE_CATEGORY
                    var RowNumber_InvtyCatCatgyARR = [];
                    var SysFk_InvtyCat_InvtyCatCatgyARR = [];
                    var SysFk_CatgyMstr_InvtyCatCatgyARR = [];

                    var invtycatcatgyRC = 0;
                    var invtycatcatgytxparam;
                    //--//INVENTORY_MASTER_CATALOGUE_CATEGORY


	//------------//FOR API

/*~~~~~~~~~~~~~~~~~~~~//GLOBAL VARIABLES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


function errorCB(err)
{
    alert("Error processing SQL: " + err.message);
   
}

function successCB()
{
//  alert('successful');

}



function initializeDB()
{
     db = window.openDatabase("Database","1.0","Cordova Demo", 4*1024*1024);
     db.transaction(createTBinventorymastercatalogue, errorCB, successCB);
}


function onDeviceOffline()
{
    if($('.splashpageindicator').length <= 0)//Only reload when not in splash page.
    {
        location.reload();
    }

    
    initializeDB();
    
   
    $('.noti-online , .splashscreencont').hide();
    $('.noti-blanket , .noti-offline').show();
    if(networkstatus != 'disconnected' || networkstatus == '')
    {
        networkstatus = 'disconnected';
      
    }
}

$('.btn-noti-offline').on('click',function()
{
    $('.noti-blanket, .noti-offline').hide();
    $('.splashscreencont').show();
});


function onDeviceOnline()
{ 
 
    if($('.splashpageindicator').length <= 0)//Only reload when not in splash page.
    {
        location.reload();
    }
   
 
  
    $('.noti-offline, .splashscreencont').hide();
    $('.noti-blanket , .noti-online').show();

    if((networkstatus != 'connected' || networkstatus == ''))
    {
        networkstatus = 'connected';//networkstatus is set back to '' when checkig inorder to see results so SysPk_CatgyMstrARR.length <= 0 is added to  prevent from pushing to array twice

            $.when(
                   $.getJSON('http://viveg.net/glogapitest/index.php?table=INVENTORY_MASTER_CATALOGUE'),
                   $.getJSON('http://viveg.net/glogapitest/index.php?table=CATALOGUE_MASTER'),
                   $.getJSON('http://viveg.net/glogapitest/index.php?table=SETTINGS'),
                   $.getJSON('http://viveg.net/glogapitest/index.php?table=CATEGORY_MASTER'),
                   $.getJSON('http://viveg.net/glogapitest/index.php?table=INVENTORY_MASTER_CATALOGUE_CATEGORY')
                  ).done(function(invtycat, catmstr,settings,catgymstr,InvtyCatCatgy)
            {

                if(SysPk_CatgyMstrARR.length <= 0)
                {
                    
                 $('.getjsontest').append("<br><br>----INVENTORY_MASTER_CATALOGUE----<br><br>");
                    $.each( invtycat[0], function( index, value ) 
                      {

                            $.each(value, function(inde, valu)
                            {
                                $.each(valu, function(ind, val)
                                {
                                    $.each( val, function( i, v )
                                    {

                                            if(i == "RowNumber_InvtyCat")
                                            {
                                                RowNumber_InvtyCatARR.push(val[i]);
                                                
                                                $('.getjsontest').append(val[i] + " inserted to array RowNumber_InvtyCatARR<br>");
                                            }
                                            else if(i == "SysPk_InvtyCat")
                                            {
                                                SysPk_InvtyCatARR.push(val[i]);
                                                $('.getjsontest').append(val[i] + " inserted to array SysPk_InvtyCatARR<br>");
                                            }
                                            else if(i == "SysFk_CatMstr_InvtyCat")
                                            {
                                                SysFk_CatMstr_InvtyCatARR.push(val[i]);
                                                $('.getjsontest').append(val[i] + " inserted to array SysFk_CatMstr_InvtyCatARR<br>");
                                            }
                                            else if(i == "SKU_InvtyCat")
                                            {
                                                SKU_InvtyCatARR.push(val[i]);
                                                $('.getjsontest').append(val[i] + " inserted to array SKU_InvtyCatARR<br>");
                                            }
                                            else if(i == "PictureFileName_InvtyCat")
                                            {
                                                PictureFileName_InvtyCatARR.push(val[i]);
                                                $('.getjsontest').append(val[i] + " inserted to array PictureFileName_InvtyCatARR<br>");
                                            }
                                            else if(i == "Barcode_InvtyCat")
                                            {
                                                Barcode_InvtyCatARR.push(val[i]);
                                                $('.getjsontest').append(val[i] + " inserted to array Barcode_InvtyCatARR<br>");

                                            }
                                            else if(i == "Brand_InvtyCat")
                                            {
                                                Brand_InvtyCatARR.push(val[i]);
                                                $('.getjsontest').append(val[i] + " inserted to array Brand_InvtyCatARR<br>");

                                            }
                                            else if(i == "FullDescription_InvtyCat")
                                            {
                                                FullDescription_InvtyCatARR.push(val[i]);
                                                $('.getjsontest').append(val[i] + " inserted to array FullDescription_InvtyCatARR<br>");

                                            }
                                            else if(i == "PromoName_InvtyCat")
                                            {
                                                PromoName_InvtyCatARR.push(val[i]);
                                                $('.getjsontest').append(val[i] + " inserted to array PromoName_InvtyCatARR<br>");

                                            }
                                            else if(i == "PromoPrice_InvtyCat")
                                            {
                                                PromoPrice_InvtyCatARR.push(val[i]);
                                                $('.getjsontest').append(val[i] + " inserted to array PromoPrice_InvtyCatARR<br>");

                                            }



                                    });	

                                });	

                            });
                      });
                 $('.getjsontest').append("<br><br>//----INVENTORY_MASTER_CATALOGUE----<br><br>");




                 $('.getjsontest').append("<br><br>----CATALOGUE_MASTER----<br><br>");

                        $.each(catmstr[0], function( index, value ) 
                         {
                            $.each(value, function(inde, valu)
                                    {


                                        $.each(valu, function(ind, val)
                                        {
                                            $.each( val, function( i, v )
                                            {


                                                    if(i == "RowNumber_CatMstr")
                                                    {
                                                        RowNumber_CatMstrARR.push(val[i]);
                                                        $('.getjsontest').append(val[i] + " inserted to array RowNumber_InvtyCatARR<br>");
                                                    }
                                                    else if(i == "SysPk_CatMstr")
                                                    {
                                                        SysPk_CatMstrARR.push(val[i]);
                                                        $('.getjsontest').append(val[i] + " inserted to array SysPk_CatMstrARR<br>");
                                                    }
                                                    else if(i == "SysSeq_CatMstr")
                                                    {
                                                        SysSeq_CatMstrARR.push(val[i]);
                                                        $('.getjsontest').append(val[i] + " inserted to array SysSeq_CatMstrARR<br>");
                                                    }
                                                    else if(i == "LastUpdatedDate_CatMstr")
                                                    {
                                                        LastUpdatedDate_CatMstrARR.push(val[i]);
                                                        $('.getjsontest').append(val[i] + " inserted to array LastUpdatedDate_CatMstrARR<br>");

                                                    }
                                                    else if(i == "CatalogueTitle_CatMstr")
                                                    {
                                                        CatalogueTitle_CatMstrARR.push(val[i]);
                                                        $('.getjsontest').append(val[i] + " inserted to array CatalogueTitle_CatMstrARR<br>");

                                                    }
                                                    else if(i == "PromoEndDate_CatMstr")
                                                    {
                                                        PromoEndDate_CatMstrARR.push(val[i]);
                                                        $('.getjsontest').append(val[i] + " inserted to array PromoEndDate_CatMstrARR<br>");

                                                    }
                                                    else if(i == "PromoStartDate_CatMstr")
                                                    {
                                                        PromoStartDate_CatMstrARR.push(val[i]);
                                                        $('.getjsontest').append(val[i] + " inserted to array PromoStartDate_CatMstrARR<br>");

                                                    }



                                            });	

                                        });	

                                    });
                        });
                 $('.getjsontest').append("<br><br>//----CATALOGUE_MASTER----<br><br>");



                $('.getjsontest').append("<br><br>---SETTINGS----<br><br>");

                    $.each(settings[0], function( index, value ) 
                         {
                            $.each(value, function(inde, valu)
                                    {


                                        $.each(valu, function(ind, val)
                                        {
                                            $.each( val, function( i, v )
                                            {


                                                    if(i == "MinimumPrice_Settings")
                                                    {
                                                        MinimumPrice_SettingsARR.push(val[i]);
                                                        $('.getjsontest').append(val[i] + " inserted to array MinimumPrice_SettingsARR<br>");
                                                    }

                                            });	

                                        });	

                                    });
                        });


                $('.getjsontest').append("<br><br>---//SETTINGS----<br><br>");





                $('.getjsontest').append("<br><br>---CATEGORY_MASTER----<br><br>");

                    $.each(catgymstr[0], function( index, value ) 
                         {
                            $.each(value, function(inde, valu)
                                    {


                                        $.each(valu, function(ind, val)
                                        {
                                            $.each( val, function( i, v )
                                            {


                                                    if(i == "RowNumber_CatgyMstr")
                                                    {
                                                        RowNumber_CatgyMstrARR.push(val[i]);
                                                        $('.getjsontest').append(val[i] + " inserted to array RowNumber_CatgyMstrARR<br>");
                                                    }
                                                    else if(i == "SysPk_CatgyMstr")
                                                    {
                                                        SysPk_CatgyMstrARR.push(val[i]);
                                                        $('.getjsontest').append(val[i] + " inserted to array SysPk_CatgyMstrrARR<br>");
                                                    }
                                                    else if(i == "CategoryName_CatgyMstr")
                                                    {
                                                        CategoryName_CatgyMstrARR.push(val[i]);
                                                        $('.getjsontest').append(val[i] + " inserted to array CategoryName_CatgyMstrARR<br>");
                                                    }

                                            });	

                                        });	

                                    });
                        });


                $('.getjsontest').append("<br><br>---//CATEGORY_MASTER----<br><br>");

                
                
                
                
                $('.getjsontest').append("<br><br>--- INVENTORY_MASTER_CATALOGUE_CATEGORY----<br><br>");

                    $.each(InvtyCatCatgy[0], function( index, value ) 
                         {
                            $.each(value, function(inde, valu)
                                    {


                                        $.each(valu, function(ind, val)
                                        {
                                            $.each( val, function( i, v )
                                            {


                                                    if(i == "RowNumber_InvtyCatCatgy")
                                                    {
                                                       RowNumber_InvtyCatCatgyARR.push(val[i]);
                                                        $('.getjsontest').append(val[i] + " inserted to array RowNumber_InvtyCatCatgyARR<br>");
                                                    }
                                                    else if(i == "SysFk_InvtyCat_InvtyCatCatgy")
                                                    {
                                                       SysFk_InvtyCat_InvtyCatCatgyARR.push(val[i]);
                                                        $('.getjsontest').append(val[i] + " inserted to array SysFk_InvtyCat_InvtyCatCatgyARR<br>");
                                                    }
                                                    else if(i == "SysFk_CatgyMstr_InvtyCatCatgy")
                                                    {
                                                       SysFk_CatgyMstr_InvtyCatCatgyARR.push(val[i]);
                                                        $('.getjsontest').append(val[i] + " inserted to array SysFk_CatgyMstr_InvtyCatCatgyARR<br>");
                                                    }

                                            });	

                                        });	

                                    });
                        });


                $('.getjsontest').append("<br><br>---//INVENTORY_MASTER_CATALOGUE_CATEGORY----<br><br>");
    
                
                
                
                
                    
                    
               }//if(SysPk_CatgyMstrARR.length <= 0)
                
            }).then(function(objects)
            {
                  initializeDB();
             
            });
    }
    
}


$('.btn-noti-online').on('click',function()
{
    
    $('.noti-blanket, .noti-online').hide();
    $('.splashscreencont').show();
    

    
});



function createTBinventorymastercatalogue(tx)
{
   

  
   //alert('creating INVENTORY_MASTER_CATALOGUE if not exists');

        //tx.executeSql("DROP TABLE IF EXISTS INVENTORY_MASTER_CATALOGUE");
       
        var query = "";
        //query += "CREATE TABLE IF NOT EXISTS INVENTORY_MASTER_CATALOGUE(RowNumber_InvtyCat INTEGER  PRIMARY KEY AUTOINCREMENT,SysPk_InvtyCat,";
        query += "CREATE TABLE IF NOT EXISTS INVENTORY_MASTER_CATALOGUE(RowNumber_InvtyCat,SysPk_InvtyCat,";
        query += "SysFk_Invty_InvtyCat,SysFk_CatMstr_InvtyCat,SKU_InvtyCat,SysSeq_InvtyCat,UserSeq_InvtyCat, UserPk_InvtyCat,";
        query += "UserFk_Invty_InvtyCat,UserFk_CatMstr_InvtyCat,LastUpdatedBy_InvtyCat,LastUpdatedConcurrencyID_InvtyCat,LastUpdatedDate_InvtyCat TIMESTAMP DEFAULT (datetime('now','localtime')),";
        query += "Module_InvtyCat, Particulars_InvtyCat,PictureFileName_InvtyCat , Status_InvtyCat, Type_InvtyCat,";
        query += "Barcode_Freebies01_InvtyCat,Barcode_Freebies02_InvtyCat,Barcode_Freebies03_InvtyCat,Barcode_Freebies04_InvtyCat,Barcode_Freebies05_InvtyCat,";
        query += "Barcode_InvtyCat, Brand_InvtyCat ,CatalogueTitle_InvtyCat ,";
        query += "CataloguePageNumber_InvtyCat,Categories_InvtyCat,Classification_InvtyCat,Description_InvtyCat,DisplayPrice_InvtyCat DECIMAL(9,2),";
        query += "FreeDescription_InvtyCat,FullDescription_InvtyCat,PromoName_InvtyCat,PromoPrice_InvtyCat,PricePerPiece_InvtyCat,";
        query += "PromoStartDate_InvtyCat TIMESTAMP, PromoEndDate_InvtyCat TIMESTAMP, Principal_InvtyCat, PercentDiscount_InvtyCat,PriceRageMin_InvtyCat,PriceRangeMax_InvtyCat, QRcode_InvtyCat,";
        query += "RecordAddedDate_InvtyCat,SavingsAmount_InvtyCat,SysFk_Freebies01_InvtyCat,SysFk_Freebies02_InvtyCat,SysFk_Freebies03_InvtyCat,SysFk_Freebies04_InvtyCat,SysFk_Freebies05_InvtyCat,";
        query += "UnitOfMeasure_InvtyCat,UserFk_Freebies01_InvtyCat,UserFk_Freebies02_InvtyCat,UserFk_Freebies03_InvtyCat,UserFk_Freebies04_InvtyCat,UserFk_Freebies05_InvtyCat)";
        tx.executeSql( query ,[],deleteLocalInvtyCat,errorCB);
    
    

}

function createTBcataloguemaster(tx)
{ // alert('creating CATALOGUE_MASTER if not exists');
 
       // tx.executeSql("DROP TABLE IF EXISTS CATALOGUE_MASTER");
        var query2 = "";
        //query2 += "CREATE TABLE IF NOT EXISTS CATALOGUE_MASTER( RowNumber_CatMstr INTEGER PRIMARY KEY AUTOINCREMENT, SysPk_CatMstr,";
        query2 += "CREATE TABLE IF NOT EXISTS CATALOGUE_MASTER( RowNumber_CatMstr, SysPk_CatMstr,";
        query2 += "SysFk_CatMstr,SysSeq_CatMstr, UserPk_CatMstr, LastUpdatedBy_CatMstr, LastUpdatedConcurrencyID_CatMstr, LastUpdatedDate_CatMstr TIMESTAMP DEFAULT (datetime('now','localtime')), Module_CatMstr,";
        query2 += "Particulars_CatMstr,PictureFileName_CatMstr, Status_CatMstr,Type_CatMstr,";
        query2 += "CatalogueTitle_CatMstr, Description_CatMstr, FullDescription_CatMstr, FreeDescription_CatMstr,";
        query2 += "Principal_CatMstr,PromoEndDate_CatMstr TIMESTAMP, PromoStartDate_CatMstr TIMESTAMP)";
        tx.executeSql( query2,[],deleteLocalCatalogueMaster,errorCB);
}
/*-------------CURRENTLY NOT USED-----------*/
        //tx.executeSql("DROP TABLE IF EXISTS INVENTORY_MASTER");
       // var query3 ="";
       // query3 += "CREATE TABLE IF NOT EXISTS INVENTORY_MASTER(RowNumber_Invty INTEGER PRIMARY KEY AUTOINCREMENT, SysPk_Invty,";
       // query3 += "UserPk_Invty, LastUpdatedBy_Invty, LastUpdatedConcurrencyID_Invty, LastUpdatedDate_Invty TIMESTAMP DEFAULT  (datetime('now','localtime')),";
       // query3 += "Module_Invty,Particulars_Invty,PictureFileName_Invty, Status_Invty, Type_Invty, Barcode_Invty,";
       //// query3 += "Brand_Invty,Classification_Invty, Categories_Invty, Description_Invty,FullDescription_Invty,FreeDescription_Invty,";
       //// query3 += "DisplayPrice_Invty, Principal_Invty, QRcode_Invty, SubCategories_Invty)";
       // tx.executeSql(query3,[],populateInventoryMaster, errorCB);
/*-----------//CURRENTLY NOT USED-----------*/


function createTBsettings(tx)
{
    
   //alert('creating SETTINGS if not exists');
    ////tx.executeSql("DROP TABLE IF EXISTS SETTINGS");
    var query4 ="";
    query4 +="CREATE TABLE IF NOT EXISTS SETTINGS(MinimumPrice_Settings)";
    tx.executeSql(query4,[],checkExistsSettingsTable,errorCB);

}


function createTBcategorymaster(tx)
{
    
  //  alert('creating CATEGORY_MASTER if not exists');
    //tx.executeSql("DROP TABLE IF EXISTS CATEGORY_MASTER");
    var query5= "";
    query5 += "CREATE TABLE IF NOT EXISTS CATEGORY_MASTER ";
    //query5 += "(RowNumber_CatgyMstr INTEGER PRIMARY KEY AUTOINCREMENT,SysPk_CatgyMstr, CategoryName_CatgyMstr)";
    query5 += "(RowNumber_CatgyMstr,SysPk_CatgyMstr, CategoryName_CatgyMstr)";
    tx.executeSql(query5,[],deleteLocalCategoryMaster,errorCB);//populateCategoryMaster
}



function createTBinventorymastercataloguecategory(tx)
{
  // alert('creating INVENTORY_MASTER_CATALOGUE_CATEGORY if not exists');
    //tx.executeSql("DROP TABLE IF EXISTS INVENTORY_MASTER_CATALOGUE_CATEGORY");
    var query6 ="";
    query6 +="CREATE TABLE IF NOT EXISTS INVENTORY_MASTER_CATALOGUE_CATEGORY";
    //query6 += "(RowNumber_InvtyCatCatgy INTEGER PRIMARY KEY AUTOINCREMENT,SysFk_InvtyCat_InvtyCatCatgy, SysFk_CatgyMstr_InvtyCatCatgy)";
    query6 += "(RowNumber_InvtyCatCatgy,SysFk_InvtyCat_InvtyCatCatgy, SysFk_CatgyMstr_InvtyCatCatgy)";
    tx.executeSql(query6,[],deleteLocalInvtyCatCatgy,errorCB);
    
}
    










function deleteLocalInvtyCat(tx)//delete in local what's deleted in server
{
   
    if (RowNumber_InvtyCatARR.length <= 0)//isOffline
    {

            var sqldeletedeleted = 'SELECT * FROM INVENTORY_MASTER_CATALOGUE LIMIT 1';//does not matter what statement is here. just to prevent error from executing null sql.
        tx.executeSql(sqldeletedeleted,[],checkExistsInventoryMasterCatalogue,errorCB);
    }
    else
    {
           //alert('online. delete not in json -invtycat');

            var sqldeletedeleted = 'DELETE FROM INVENTORY_MASTER_CATALOGUE WHERE SysPk_InvtyCat NOT IN(?)';
        	   tx.executeSql(sqldeletedeleted,[SysPk_InvtyCatARR],checkExistsInventoryMasterCatalogue,errorCB);
    }
    
}



function checkExistsInventoryMasterCatalogue(tx)//previously populateInventoryMasterCatalogue()
{ 
    var RecordBeingProcessesd =  invtycatRC + 1;//get this fromgetjsonForINVENTORY_MASTER_CATALOGUE();
   invtycattxparam = tx;
    
    
    //alert('checkExistsInventoryMasterCatalogue  SysPk_InvtyCat ' + SysPk_InvtyCatARR[invtycatRC]);

    
    //var sqlInsert = "INSERT INTO INVENTORY_MASTER_CATALOGUE(SysPk_InvtyCat,SysFk_CatMstr_InvtyCat,SKU_InvtyCat,PictureFileName_InvtyCat,Barcode_InvtyCat,Brand_InvtyCat,FullDescription_InvtyCat,PromoName_InvtyCat,PromoPrice_InvtyCat) VALUES(?,?,?,?,?,?,?,?,?)";
    // tx.executeSql(sqlInsert,["2222222222","2","2222222222","img/Item20.jpg","042000062008","etude house","was P3750","Sanyang Study Table",3000.00],null,errorCB);
    // tx.executeSql(sqlInsert,["3333333333","2","3333333333","img/Item21.jpg","012345678905","etude house","pack of 10","80L notebooks",100.00],queryForExpired,errorCB);

    if(SysPk_InvtyCatARR.length > 0)
    {
       // alert('number of items' + RowNumber_InvtyCatARR.length);
        if(RecordBeingProcessesd <= RowNumber_InvtyCatARR.length)
		{
          // alert('Processing '+ RecordBeingProcessesd +' of ' + SysPk_InvtyCatARR.length );
            db.transaction(function(tx3)
           {    var sqlselectinvtycat = "SELECT * FROM INVENTORY_MASTER_CATALOGUE WHERE RowNumber_InvtyCat=? AND SysPk_InvtyCat = ? AND SKU_InvtyCat=?";//these three are composite primary keys
                 tx3.executeSql(sqlselectinvtycat,[RowNumber_InvtyCatARR[invtycatRC],SysPk_InvtyCatARR[invtycatRC],SKU_InvtyCatARR[invtycatRC]],rendercheckExistsInventoryMasterCatalogue,errorCB);
            },errorCB,function(){ /* alert('now at tx3 callback');*/ invtycatRC +=1; checkExistsInventoryMasterCatalogue(invtycattxparam);});
        }
        else
		{
         //   alert('no more array data - invtycat');
			invtycatRC = 0;
            
          
           db.transaction(createTBcataloguemaster,errorCB);
               
             
		}
        
    }
    else
    {
      //  alert('arrays are empty because device was offline. procceeding  to delete query. -invtycat');
        
        db.transaction(createTBcataloguemaster,errorCB);
       
    }
    
    
    
}

function rendercheckExistsInventoryMasterCatalogue(tx3,results)
{   

    
  //  alert('rendering ' + RowNumber_InvtyCatARR[invtycatRC]);


    if(results.rows.length <= 0)
    {
        
            var sqlinsertinvtycat = "INSERT INTO INVENTORY_MASTER_CATALOGUE(RowNumber_InvtyCat,SysPk_InvtyCat,SysFk_CatMstr_InvtyCat,SKU_InvtyCat,PictureFileName_InvtyCat,Barcode_InvtyCat,Brand_InvtyCat,FullDescription_InvtyCat,PromoName_InvtyCat,PromoPrice_InvtyCat) Values(?,?,?,?,?,?,?,?,?,?)";//) VALUES(?,?,?,?,?,?,?,?,?,?)";
    
          //  alert('no row with syspkinvtycat' + SysPk_InvtyCatARR[invtycatRC] +' exists. inserting ' + RowNumber_InvtyCatARR[invtycatRC] + ',' + SysPk_InvtyCatARR[invtycatRC]+','+SysFk_CatMstr_InvtyCatARR[invtycatRC]+','+SKU_InvtyCatARR[invtycatRC]+','+PictureFileName_InvtyCatARR[invtycatRC]+','+Barcode_InvtyCatARR[invtycatRC]+','+Brand_InvtyCatARR[invtycatRC]+','+FullDescription_InvtyCatARR[invtycatRC]+','+PromoName_InvtyCatARR[invtycatRC]+','+PromoPrice_InvtyCatARR[invtycatRC]);

            
                tx3.executeSql(sqlinsertinvtycat,[RowNumber_InvtyCatARR[invtycatRC],SysPk_InvtyCatARR[invtycatRC],SysFk_CatMstr_InvtyCatARR[invtycatRC],SKU_InvtyCatARR[invtycatRC],PictureFileName_InvtyCatARR[invtycatRC],Barcode_InvtyCatARR[invtycatRC],Brand_InvtyCatARR[invtycatRC],FullDescription_InvtyCatARR[invtycatRC],PromoName_InvtyCatARR[invtycatRC],PromoPrice_InvtyCatARR[invtycatRC]],function(){ /*alert(RowNumber_InvtyCatARR[invtycatRC]  + ' inserted');*/},errorCB);
        
    }
    else
    {
        
       //   alert( SysPk_InvtyCatARR[invtycatRC] + ' already exists. Updating info.');
        
        //,,
        var sqlupdateinvtycat = "UPDATE INVENTORY_MASTER_CATALOGUE SET SysFk_CatMstr_InvtyCat = ?,PictureFileName_InvtyCat = ?, Barcode_InvtyCat = ? , Brand_InvtyCat = ? , FullDescription_InvtyCat = ? , PromoName_InvtyCat = ? , PromoPrice_InvtyCat = ? WHERE RowNumber_InvtyCat = ? AND SysPk_InvtyCat = ? AND SKU_InvtyCat = ?";
        tx3.executeSql(sqlupdateinvtycat,[SysFk_CatMstr_InvtyCatARR[invtycatRC],PictureFileName_InvtyCatARR[invtycatRC],Barcode_InvtyCatARR[invtycatRC],Brand_InvtyCatARR[invtycatRC],FullDescription_InvtyCatARR[invtycatRC],PromoName_InvtyCatARR[invtycatRC],PromoPrice_InvtyCatARR[invtycatRC],results.rows.item(0).RowNumber_InvtyCat,results.rows.item(0).SysPk_InvtyCat,results.rows.item(0).SKU_InvtyCat],function(){ /*alert(results.rows.item(0).RowNumber_InvtyCat  + ' updated');*/ } ,errorCB);
       
        
    
    }
    
}














function deleteLocalCatalogueMaster(tx)
{
    if ( RowNumber_CatMstrARR.length <= 0 )//isOffline
    {
        
       // alert('offline, not deleting anyuthing from cataloguemaster');

            var sqldeletedeleted = 'SELECT * FROM CATALOGUE_MASTER LIMIT 1';//does not matter what statement is here. just to prevent error from executing null sql.
    }
    else
    {
        //   alert('online, deleting not in json - cataloguemaster');

         var sqldeletedeleted = 'DELETE FROM CATALOGUE_MASTER WHERE SysPk_CatMstr NOT IN('+ SysPk_CatMstrARR +')';
    }


    

	   tx.executeSql(sqldeletedeleted,[],checkExistsCatalogueMaster,errorCB);
}



function checkExistsCatalogueMaster(tx)//previously populateCatalogueMaster(tx)
{
        var RecordBeingProcessesd =  catmstrRC + 1;//get this fromgetjsonForINVENTORY_MASTER_CATALOGUE();
        catmstrtxparam = tx;
    
    
  //  alert('checkExistsCatalogueMaster SysPk_CatMstr ' + SysPk_CatMstrARR[catmstrRC]);


    
   //var sqlInsert2 = "INSERT INTO CATALOGUE_MASTER(SysPk_CatMstr,SysSeq_CatMstr,CatalogueTitle_CatMstr, PromoEndDate_CatMstr, PromoStartDate_CatMstr) VALUES(?,?,?,?,?)";
   // tx.executeSql(sqlInsert2,["1",2,"Johanna Catalogue","2015-05-15 24:59:59","2015-05-11 00:00:00"],null,errorCB);
    

    if(SysPk_CatMstrARR.length > 0)
    {
        if(RecordBeingProcessesd <= RowNumber_CatMstrARR.length)
		{
           // alert('Processing '+ RecordBeingProcessesd +' of ' + SysPk_CatMstrARR.length );
            db.transaction(function(tx4)
           {    var sqlselectcatmstr = "SELECT * FROM CATALOGUE_MASTER WHERE RowNumber_CatMstr=? AND SysPk_CatMstr = ?";//composite primary keys
                 tx4.executeSql(sqlselectcatmstr,[RowNumber_CatMstrARR[catmstrRC],SysPk_CatMstrARR[catmstrRC]],rendercheckExistsCatalogueMaster,errorCB);
            },errorCB,function(){  /*alert('now at tx4 callback'); */ catmstrRC +=1; checkExistsCatalogueMaster(catmstrtxparam);});
        }
        else
		{
           // alert('no more array data - catmstr');
			catmstrRC = 0;

            //db.transaction(queryForExpired,errorCB);//comment out and move to next table if there's still another table to create.
            db.transaction(createTBsettings,errorCB);
		}
        
    }
    else
    {
       // alert('this is the last table created. proceed to deleting expired stuff. - catmstr');
    // db.transaction(queryForExpired,errorCB);//move to else of last created table
        
       db.transaction(createTBsettings,errorCB);
    }

}

function rendercheckExistsCatalogueMaster(tx4,results)
{
    
   // alert('rendercheckExistsCatalogueMaster');
    
    
    
    if(results.rows.length <= 0)
    {
        
            var sqlinsertcatmstr = "INSERT INTO CATALOGUE_MASTER(RowNumber_CatMstr,SysPk_CatMstr,SysSeq_CatMstr,CatalogueTitle_CatMstr, PromoEndDate_CatMstr, PromoStartDate_CatMstr) Values(?,?,?,?,?,?)";//RowNumber_CatMstr,SysPk_CatMstr,SysSeq_CatMstr,CatalogueTitle_CatMstr, PromoEndDate_CatMstr, PromoStartDate_CatMstr
    
    
      
       //     alert('no row with SysPk_CatMstr' + SysPk_CatMstrARR[catmstrRC] +' exists. inserting ' +RowNumber_CatMstrARR[catmstrRC] + ','+SysPk_CatMstrARR[catmstrRC] +','+ SysSeq_CatMstrARR[catmstrRC]+','+ CatalogueTitle_CatMstrARR[catmstrRC] + ',' +  PromoEndDate_CatMstrARR[catmstrRC] +','+ PromoStartDate_CatMstrARR[catmstrRC]);

            
                tx4.executeSql(sqlinsertcatmstr,[RowNumber_CatMstrARR[catmstrRC],SysPk_CatMstrARR[catmstrRC],SysSeq_CatMstrARR[catmstrRC],CatalogueTitle_CatMstrARR[catmstrRC],PromoEndDate_CatMstrARR[catmstrRC], PromoStartDate_CatMstrARR[catmstrRC]],function(){ /*alert(SysPk_CatMstrARR[catmstrRC] + ' inserted');*/},errorCB);
        
    }
    else
    {
        
       //   alert(  SysPk_CatgyMstrARR[catmstrRC] +' already exists. Updating info.');

       //CatalogueTitle_CatMstr, PromoEndDate_CatMstr, PromoStartDate_CatMstr
       var sqlupdateinvtycat = "UPDATE CATALOGUE_MASTER SET SysSeq_CatMstr = ? , CatalogueTitle_CatMstr = ?, PromoEndDate_CatMstr = ?, PromoStartDate_CatMstr = ? WHERE RowNumber_CatMstr = ? AND SysPk_CatMstr = ?";
        tx4.executeSql(sqlupdateinvtycat,[SysSeq_CatMstrARR[catmstrRC],CatalogueTitle_CatMstrARR[catmstrRC], PromoEndDate_CatMstrARR[catmstrRC], PromoStartDate_CatMstrARR[catmstrRC],results.rows.item(0).RowNumber_CatMstr,results.rows.item(0).SysPk_CatMstr],function(){ /*alert(results.rows.item(0).SysPk_CatMstr  + ' updated');*/ } ,errorCB);
       
    }
}



















//function populateInventoryMaster()
//{
     //alert('populate inventory master');
//}








function checkExistsSettingsTable(tx)//populateSettingsTable(tx)
{

	  // var sqlInsert4 = "INSERT INTO SETTINGS(MinimumPrice_Settings) VALUES(?)";
	//	tx.executeSql(sqlInsert4,[1000],null,errorCB);
    
    
    
    
    
        var RecordBeingProcessesd =  settingsRC + 1;
        settingstxparam = tx;
    
    
       // alert('checkExistsSettingsTable MinimumPrice_Settings ' + MinimumPrice_SettingsARR[settingsRC]);



    if(MinimumPrice_SettingsARR.length > 0)
    {
        if(RecordBeingProcessesd <= MinimumPrice_SettingsARR.length)
		{
            //alert('Processing '+ RecordBeingProcessesd +' of ' + MinimumPrice_SettingsARR.length );
            db.transaction(function(tx5)
           {    var sqlselectsettings = "SELECT * FROM SETTINGS WHERE MinimumPrice_Settings= ?";
                 tx5.executeSql(sqlselectsettings,[MinimumPrice_SettingsARR[settingsRC]],rendercheckExistsSettingsTable,errorCB);
            },errorCB,function(){  /* alert('now at tx5 callback'); */ settingsRC +=1; checkExistsSettingsTable(settingstxparam);});
        }
        else
		{
          //  alert('no more array data - settings');
			settingsRC = 0;

            //db.transaction(queryForExpired,errorCB);//comment out and move to next table if there's still another table to create.
            //create table here
            
            db.transaction(createTBcategorymaster,errorCB);
		}
        
    }
    else
    {
       //alert('this is the last table created. proceed to deleting expired stuff. - settings');

        //db.transaction(queryForExpired,errorCB);//move to else of last created table
        //create table here
        
        db.transaction(createTBcategorymaster,errorCB);
    }
 
  
}



function rendercheckExistsSettingsTable(tx5,results)
{
      //  alert('rendercheckExistsSettingsTable');

   
    
    
    if(results.rows.length <= 0)
    {
        
            var sqlinsertsettings = "INSERT INTO SETTINGS(MinimumPrice_Settings) VALUES(?)";
    
      
            //    alert('no row with MinimumPrice_Settings' + MinimumPrice_SettingsARR[settingsRC] +' exists. inserting ' +MinimumPrice_SettingsARR[settingsRC]);
            
                tx5.executeSql(sqlinsertsettings,[MinimumPrice_SettingsARR[settingsRC]],function(){ /*alert(MinimumPrice_SettingsARR[settingsRC] + ' inserted');*/},errorCB);
        
    }
    else
    {
        
         //   alert(  MinimumPrice_SettingsARR[settingsRC] +' already exists. Updating info.');

       
       var sqlupdatesettings = "UPDATE SETTINGS SET MinimumPrice_Settings = ?  WHERE MinimumPrice_Settings = ?";
        tx5.executeSql(sqlupdatesettings,[MinimumPrice_SettingsARR[settingsRC],results.rows.item(0).MinimumPrice_Settings],function(){/*alert(results.rows.item(0).MinimumPrice_Settings  + ' updated');*/ } ,errorCB);
       
    }   
       
}





















function deleteLocalCategoryMaster(tx)
{
   // alert('deleteLocalCategoryMaster');
    if (RowNumber_CatgyMstrARR.length <= 0 )//isOffline
    {

           // alert('offline, not deleting anything from category master');
            var sqldeletedeleted = 'SELECT * FROM CATEGORY_MASTER LIMIT 1';//does not matter what statement is here. just to prevent error from executing null sql.
          tx.executeSql(sqldeletedeleted,[],checkExistsCategoryMaster,errorCB);
    }
    else
    {
           
     //   alert('online. deleting what\'s not in json - category_master');
         var sqldeletedeleted = 'DELETE FROM CATEGORY_MASTER WHERE SysPk_CatgyMstr NOT IN(?)';
        	   tx.executeSql(sqldeletedeleted,[SysPk_CatgyMstrARR],checkExistsCategoryMaster,errorCB);
    }


    


}

function checkExistsCategoryMaster(tx)//populateCategoryMaster(tx)
{	
// alert('checkExistsCategoryMaster');
    
        var RecordBeingProcessesd =  catgymstrRC + 1;
        catgymstrtxparam = tx;
    
    
    //    alert('checkExistsCategoryMaster SysPk_CatgyMstr ' + SysPk_CatgyMstrARR[catgymstrRC]);



    if(SysPk_CatgyMstrARR.length > 0)
    {
        if(RecordBeingProcessesd <= SysPk_CatgyMstrARR.length)
		{
           // alert('Processing '+ RecordBeingProcessesd +' of ' + SysPk_CatgyMstrARR.length );
            db.transaction(function(tx6)
           {    var sqlselectcatgymstr = "SELECT * FROM CATEGORY_MASTER WHERE RowNumber_CatgyMstr = ? AND SysPk_CatgyMstr= ?";
                 tx6.executeSql(sqlselectcatgymstr,[RowNumber_CatgyMstrARR[catgymstrRC],SysPk_CatgyMstrARR[catgymstrRC]],rendercheckExistsCategoryMaster,errorCB);
            },errorCB,function(){/*  alert('now at tx6 callback'); */ catgymstrRC +=1; checkExistsCategoryMaster(catgymstrtxparam);});
        }
        else
		{
          //  alert('no more array data - catgymstr');
			catgymstrRC = 0;

           // db.transaction(queryForExpired,errorCB);//comment out and move to next table if there's still another table to create.
            //create table here
            db.transaction(createTBinventorymastercataloguecategory,errorCB);
            
     
		}
        
    }
    else
    {
      // alert('this is the last table created. proceed to deleting expired stuff. - catgymstr');

       // db.transaction(queryForExpired,errorCB);//move to else of last created table
        //create table here
        db.transaction(createTBinventorymastercataloguecategory,errorCB);
        
    }
    

}


function rendercheckExistsCategoryMaster(tx6,results)
{		//var sqlInsert5 = "INSERT INTO CATEGORY_MASTER(SysPk_CatgyMstr, CategoryName_CatgyMstr) VALUES(?,?)";
		//tx.executeSql(sqlInsert5,["catgy1","Category Name 1"],null,errorCB);
    
    
    
    if(results.rows.length <= 0)
    {
        
        //alert('rendercheckExistsCategoryMaster');
     
            var sqlinsertcatgymstr = "INSERT INTO CATEGORY_MASTER(RowNumber_CatgyMstr,SysPk_CatgyMstr, CategoryName_CatgyMstr) VALUES(?,?,?)";
            
                tx6.executeSql(sqlinsertcatgymstr,[RowNumber_CatgyMstrARR[catgymstrRC],SysPk_CatgyMstrARR[catgymstrRC],CategoryName_CatgyMstrARR[catgymstrRC]],function(){ /*alert(SysPk_CatgyMstrARR[catgymstrRC] + ' inserted');*/},errorCB);
       
        
    }
    else
    {
    
       // alert(  SysPk_CatgyMstrARR[catgymstrRC] +' already exists. Updating info.');
  
     var sqlupdatecatgymstr = "UPDATE CATEGORY_MASTER SET CategoryName_CatgyMstr=?  WHERE RowNumber_CatgyMstr = ? AND SysPk_CatgyMstr = ?";
        tx6.executeSql(sqlupdatecatgymstr,[CategoryName_CatgyMstrARR[catgymstrRC],results.rows.item(0).RowNumber_CatgyMstr,results.rows.item(0).SysPk_CatgyMstr],function(){/*alert(results.rows.item(0).SysPk_CatgyMstr  + ' updated'); */} ,errorCB);
        
       
    }
}










function deleteLocalInvtyCatCatgy(tx)
{
    
    // alert('deleteLocalCategoryMaster');
    if ( RowNumber_InvtyCatCatgyARR.length <= 0 )//isOffline
    {
         //   alert('offline, not deleting anything from invtycatcatgy');
            var sqldeletedeleted = 'SELECT * FROM INVENTORY_MASTER_CATALOGUE_CATEGORY LIMIT 1';//does not matter what statement is here. just to prevent error from executing null sql.
            tx.executeSql(sqldeletedeleted,[],checkExistsInvtyCatCatgy,errorCB);
    }
    else
    {
           
      //  alert('online, deleting not in json - invtycatcatgy');
         var sqldeletedeleted = 'DELETE FROM INVENTORY_MASTER_CATALOGUE_CATEGORY WHERE 	RowNumber_InvtyCatCatgy NOT IN(?)';
         tx.executeSql(sqldeletedeleted,[RowNumber_InvtyCatCatgyARR],checkExistsInvtyCatCatgy,errorCB);
    }


    

	  
}



function checkExistsInvtyCatCatgy(tx)//populateInvtyCatCatgy(tx)
{


         var RecordBeingProcessesd =  invtycatcatgyRC + 1;
        invtycatcatgytxparam = tx;
    
    
        //alert('checkExistsInvtyCatCatgy SysPk_CatgyMstr ' + RowNumber_InvtyCatCatgyARR[invtycatcatgyRC]);



    if(RowNumber_InvtyCatCatgyARR.length > 0)
    {
        if(RecordBeingProcessesd <= RowNumber_InvtyCatCatgyARR.length)
		{
           // alert('Processing '+ RecordBeingProcessesd +' of ' + RowNumber_InvtyCatCatgyARR.length );
            db.transaction(function(tx7)
           {    var sqlselectinvtycatcatgy = "SELECT * FROM INVENTORY_MASTER_CATALOGUE_CATEGORY WHERE RowNumber_InvtyCatCatgy = ?";
                 tx7.executeSql(sqlselectinvtycatcatgy,[RowNumber_InvtyCatCatgyARR[invtycatcatgyRC]],rendercheckExistsInvtyCatCatgy,errorCB);
            },errorCB,function(){ /*  alert('now at tx7 callback'); */ invtycatcatgyRC +=1; checkExistsInvtyCatCatgy(invtycatcatgytxparam );});
        }
        else
		{
           // alert('no more array data - catgymstr');
			invtycatcatgyRC = 0;

            db.transaction(queryForExpired,errorCB);//comment out and move to next table if there's still another table to create.
            //create table here
           
     
		}
        
    }
    else
    {
       //alert('this is the last table created. proceed to deleting expired stuff. - catgymstr');

        db.transaction(queryForExpired,errorCB);//move to else of last created table
        //create table here

        
    }
    
}

function rendercheckExistsInvtyCatCatgy(tx7,results)
{
   
    if(results.rows.length <= 0)
    {
        
       // alert('rendercheckExistsCategoryMaster');
     
///RowNumber_InvtyCatCatgy,SysFk_InvtyCat_InvtyCatCatgy, SysFk_CatgyMstr_InvtyCatCatgy
    
            var sqlinsertinvtycatcatgy = "INSERT INTO INVENTORY_MASTER_CATALOGUE_CATEGORY(RowNumber_InvtyCatCatgy,SysFk_InvtyCat_InvtyCatCatgy, SysFk_CatgyMstr_InvtyCatCatgy) VALUES(?,?,?)";
            
                tx7.executeSql(sqlinsertinvtycatcatgy,[RowNumber_InvtyCatCatgyARR[invtycatcatgyRC],SysFk_InvtyCat_InvtyCatCatgyARR[invtycatcatgyRC],SysFk_CatgyMstr_InvtyCatCatgyARR[invtycatcatgyRC]],function(){ /*alert(RowNumber_InvtyCatCatgyARR[invtycatcatgyRC] + ' inserted');*/},errorCB);
       
        
    }
    else
    {
    
        //alert(RowNumber_InvtyCatCatgyARR[invtycatcatgyRC] +' already exists. Updating info.');
  
  var sqlupdateinvtycatcatgy = "UPDATE INVENTORY_MASTER_CATALOGUE_CATEGORY SET SysFk_InvtyCat_InvtyCatCatgy = ?, SysFk_CatgyMstr_InvtyCatCatgy =?  WHERE RowNumber_InvtyCatCatgy = ?";
    tx7.executeSql(sqlupdateinvtycatcatgy,[SysFk_InvtyCat_InvtyCatCatgyARR[invtycatcatgyRC],SysFk_CatgyMstr_InvtyCatCatgyARR[invtycatcatgyRC],results.rows.item(0).RowNumber_InvtyCatCatgy],function(){/*alert(results.rows.item(0).RowNumber_InvtyCatCatgy  + ' updated'); */} ,errorCB);
        
       
    }
}










function queryForExpired(tx)
{
	var queryexpd = 'SELECT DISTINCT IMC.SysFk_CatMstr_InvtyCat,CM.* FROM INVENTORY_MASTER_CATALOGUE AS IMC ';
	queryexpd += 'INNER JOIN CATALOGUE_MASTER AS CM ';
	queryexpd += 'ON IMC.SysFk_CatMstr_InvtyCat = CM.SysPk_CatMstr ';
	queryexpd += 'WHERE PromoEndDate_CatMstr < ? ';
	var datetimenow = getDateTimeNow();
	tx.executeSql(queryexpd, [datetimenow], deleteExpiredPromos);
}

function deleteExpiredPromos(tx,results)
{
	var deleteString = '';
	
	for(var ind=0; ind < results.rows.length ; ind++ )
	{
		
		
		deleteString += '"'+results.rows.item(ind).SysFk_CatMstr_InvtyCat + '",';
		
	}

	
	deleteString = deleteString.substring(0, deleteString.length - 1);


    
	tx.executeSql('DELETE FROM CATALOGUE_MASTER WHERE SysPk_CatMstr IN('+ deleteString +')');
	tx.executeSql('DELETE FROM INVENTORY_MASTER_CATALOGUE WHERE SysFk_CatMstr_InvtyCat IN('+ deleteString +')',[],function(){
                $('.splashloading').hide();//ALWAYS AT CALLBACK OF LAST DELETE STATEMENT IN THIS FUNCTION
                $('.slideToUnlock').show();//ALWAYS AT CALLBACK OF LAST DELETE STATEMENT IN THIS FUNCTION
                },errorCB);
	
}




/*-----------------------------------------------------------------*/
/*------------------------//Database-----------------------------------*/
/*------------------------------------------------------------------*/








/*----------------------------------------------------------------------*/
/*-------------------custom events-------------------------------*/
/*----------------------------------------------------------------------*/
function navClickedAndContentContReady(event,filename)
{//e.stopPropagation();//dunno what this is for but tutorial used this and he said it's better not to use this

    $(document).trigger('navClicked',[filename]);

}


function viewItemClickedContentReady(event,idForSinglePage)
{
    $('.content-cont').trigger('viewItemClicked',[idForSinglePage]);
}


function doneScanning(event,scanResult)
{

    $(document).trigger('itemScanned',[scanResult]);
    
}

function editOrderClickedContentReady(event,orderidtoedit)
{
    $(document).trigger('editOrderClicked',[orderidtoedit]);
}



/*----------------------------------------------------------------------*/
/*-------------------//custom events-------------------------------*/
/*----------------------------------------------------------------------*/








/*----------------------------------------------------------------------*/
/*-------------------navClickedListener.js-------------------------------*/
/*----------------------------------------------------------------------*/





function queryCatalogues(tx)
{
 
  tx.executeSql('SELECT * FROM CATALOGUE_MASTER ORDER BY SysSeq_CatMstr asc' , [], nextRecord, errorCB);  

}

function nextRecord(tx,results)
{
		var recordBeingProcessed = RecordCounter + 1;//plus one because RecordCounter starts at zero..
	   var numberOfCatalogues = results.rows.length;
	


	       //alert('numberOfCatalogues -' + numberOfCatalogues);
	       //alert('recordBeingProcessed -' + recordBeingProcessed);
	   if(recordBeingProcessed <= numberOfCatalogues)
	   {
		   
		   
		      txparam = tx; // global so i can pass this object to callback. for some reason i can't pass tx as param.
			resulstparam = results;
		   
			//alert(results.rows.item(RecordCounter).CatalogueTitle_CatMstr);
			$('.lists-cont').append('<div class="catalogueTitle-cont"><h1 class="catalogueTitle">'+  results.rows.item(RecordCounter).CatalogueTitle_CatMstr  +'</h1><small>Valid from: ' + results.rows.item(RecordCounter).PromoStartDate_CatMstr + ' to ' + results.rows.item(RecordCounter).PromoEndDate_CatMstr +'</small></div><div class="clearfix"></div><div class="clearfix"></div><div class="list listSet-'+results.rows.item(RecordCounter).SysPk_CatMstr+'"></div><div class="clearfix"></div>');
			
			db.transaction(function(tx2){
				tx2.executeSql('SELECT IMC.*,CM.SysPk_CatMstr AS syspkcatmstr, CM.CatalogueTitle_CatMstr, CM.PromoEndDate_CatMstr, CM.PromoStartDate_CatMstr  FROM INVENTORY_MASTER_CATALOGUE AS IMC INNER JOIN CATALOGUE_MASTER AS CM ON IMC.SysFk_CatMstr_InvtyCat = CM.SysPk_CatMstr WHERE IMC.SysFk_CatMstr_InvtyCat = ?', [results.rows.item(RecordCounter).SysPk_CatMstr], renderCatalogueItems);// WHERE IMC.SysFk_CatMstr_InvtyCat ="'+ results.rows.item(RecordCounter).CatalogueTitle_CatMstr +'"
			},errorCB,function(){  RecordCounter  += 1;  nextRecord(txparam,resulstparam);});
		   
		  
		
	   }
	   else
	   {
		  //NO MORE records to process
		   RecordCounter = 0;//reset to zero because it's a global varibale.. so that will start counting zero again when we comeback from a different page.
	   }
	




}





function renderCatalogueItems(tx2,results)
{
	
	//alert('renderCatalogueItems' + results.rows.length);

	
      var numberOfCatalogueItems = results.rows.length;
     //  alert(numberOfCatalogueItems);
        var htmlstringCatalaogue ='';
        for(var ind=0; ind < numberOfCatalogueItems; ind++)
        {
            htmlstringCatalaogue += '<div class="item"><div class="row artcont"><div class="col-md-12 col-ms-12 col-xs-12"><article class="oneitemarticle"><header class="entry-header page-header"><div class="row"><div class="col-md-8 col-sm-12 col-xs-12">';
            htmlstringCatalaogue += '<h1 class="entry-title">' + results.rows.item(ind).PromoName_InvtyCat +'</h1>';
            htmlstringCatalaogue += '<h4 class="entry-title">' + results.rows.item(ind).Brand_InvtyCat +'</h4>';
            htmlstringCatalaogue += '</div><div class="col-md-4 col-sm-12 col-xs-12">';
            htmlstringCatalaogue += '<h3 class="entry-title">$'+ results.rows.item(ind).PromoPrice_InvtyCat +'</h1>';
            htmlstringCatalaogue += '</div></div></header>';
            htmlstringCatalaogue += '<div class="entry-content"><div class="row"><div class="col-md-12 col-sm-12 col-xs-12"><div class="img-container">';
            htmlstringCatalaogue += '<img src="'+ results.rows.item(ind).PictureFileName_InvtyCat +'" class="responsiveImage">';
            htmlstringCatalaogue += '</div><br/></div>';
            htmlstringCatalaogue += '<div class="col-md-12 col-sm-12 col-xs-12">';
            htmlstringCatalaogue += '<p>'+ results.rows.item(ind).FullDescription_InvtyCat + '</p>';
            htmlstringCatalaogue += '</div>';
            htmlstringCatalaogue += '<div class="col-md-12 col-sm-12 col-xs-12">';
            htmlstringCatalaogue += '<a href="#" class="btn btn-success btn-large viewItem" data-itemid="'+ results.rows.item(ind).SysPk_InvtyCat +'">View</a>';
            htmlstringCatalaogue += '</div>';
            htmlstringCatalaogue += '</div></div></article></div></div></div>';
			
        }
    
    
		
     $('.listSet-'+results.rows.item(0).syspkcatmstr).append(htmlstringCatalaogue);
    
		
	
		
}


function queryForSearch(tx)
{
  
	
 var enteredBarcode = $('input[name="search-barcode"]').val();
	var enteredPromoname = $('input[name="search-promoname"]').val();
    var enteredfulldescription = $('input[name="search-fulldescription"]').val();
	var enteredBrand = $('input[name="search-brand"]').val();
	var enteredCatalogue = $('.search-catalogue').val();
	var enteredCategory = $('.search-category').val();

	
	var enteredBarcodelength = enteredBarcode.length;
	//alert('barcode length: ' + enteredBarcodelength);
	if(enteredBarcodelength > 0)
	{
	  var barcodeWhereString  = ' IMCIMCCatgy.Barcode_InvtyCat = "' + enteredBarcode +'"';
	}
	else
	{
		var barcodeWhereString = '';
	}
	
	
	var enteredPromonamelength = enteredPromoname.length;
	//alert('promo name length: ' + enteredPromonamelength);
	if(enteredPromonamelength > 0)
	{
		replaceQuotes(enteredPromoname);
	  var promonameWhereString  = ' AND  IMCIMCCatgy.PromoName_InvtyCat LIKE  "%' + returnedReplaceQuote  +'%"';

	}
	else
	{
		var promonameWhereString = '';
	}
    
    var enteredfulldescriptionlength = enteredfulldescription.length;
	//alert('promo name length: ' + enteredfulldescriptionlength);
	if(enteredfulldescriptionlength > 0)
	{
		replaceQuotes(enteredfulldescription);
	  var fulldescriptionWhereString  = ' AND  IMCIMCCatgy.FullDescription_InvtyCat LIKE  "%' + returnedReplaceQuote +'%"';
	}
	else
	{
		var fulldescriptionWhereString = '';
	}
    
	
	var enteredBrandlength = enteredBrand.length;
	//alert('brand length: ' + enteredBrandlength);
	if(enteredBrandlength > 0)
	{
	  var brandWhereString  = ' AND  IMCIMCCatgy.Brand_InvtyCat LIKE  "%' + enteredBrand +'%"';
	}
	else
	{
		var brandWhereString = '';
	}
		
	var enteredCataloguelength = enteredCatalogue.length;
	//alert('Catalogue length: ' + enteredCataloguelength);

	if(enteredCataloguelength > 0)
	{
	  var CatalogueWhereString  = ' AND  CM.SysPk_CatMstr =  "' + enteredCatalogue +'"';
	}
	else
	{
		var CatalogueWhereString = '';
	}
	
	var enteredCategorylength = enteredCategory.length;
	//alert('Category length: ' + enteredCategorylength);
	if(enteredCategorylength > 0)
	{
	  var CategoryWhereString  = ' AND  IMCIMCCatgy.SysFk_CatgyMstr_InvtyCatCatgy =  "' + enteredCategory +'"';
	}
	else
	{
		var CategoryWhereString  = '';
	}
		
	

    //works
   var finalqueryString = 'SELECT CatgyM.*, CMIMCIMCCatgy.* FROM(SELECT IMCIMCCatgy.*,CM.* FROM CATALOGUE_MASTER AS CM  INNER JOIN(SELECT IMC.* , IMCCatgy.* FROM INVENTORY_MASTER_CATALOGUE AS IMC LEFT JOIN INVENTORY_MASTER_CATALOGUE_CATEGORY AS IMCCatgy ON IMC.SysPk_InvtyCat=IMCCatgy.SysFk_InvtyCat_InvtyCatCatgy)AS IMCIMCCatgy ON IMCIMCCatgy.SysFk_CatMstr_InvtyCat = CM.SysPk_CatMstr  WHERE'+ barcodeWhereString + promonameWhereString + fulldescriptionWhereString + brandWhereString + CatalogueWhereString + CategoryWhereString +' GROUP BY IMCIMCCatgy.SysPk_InvtyCat)AS CMIMCIMCCatgy LEFT JOIN CATEGORY_MASTER AS CatgyM ON CatgyM.SysPk_CatgyMstr = CMIMCIMCCatgy.SysFk_CatgyMstr_InvtyCatCatgy';


 
	
	finalqueryString = checkForWhereAnd(finalqueryString);
    
    if(enteredBarcodelength <= 0 && enteredPromonamelength <= 0 && enteredfulldescriptionlength <= 0 && enteredBrandlength <= 0 &&  enteredCataloguelength <= 0 && enteredCategorylength <= 0)
    {
        finalqueryString = finalqueryString.replace("WHERE", ""); 
    }

    //alert(finalqueryString);
	tx.executeSql(finalqueryString, [], renderSearchResults, errorCB);

	globalorderFromSwitch = 1;
    //alert('switch =='+ globalorderFromSwitch );
	
}




function renderSearchResults(tx,results)
{
    
	
    var htmlstring = "";
    var len = results.rows.length;
    
  if(len > 0)
  {
    for(var ind=0; ind < len; ind++)
    {
        
       //displays categorgy but commented out because it will be more complex when item has more than one category// htmlstring += '<div class="col-md-4 col-sm-4 col-xs-12"><img src="'+ results.rows.item(ind).PictureFileName_InvtyCat +'" class="responsiveImage"></div><div class="col-md-8 col-sm-8 col-xs-12"><h1>'+results.rows.item(ind).PromoName_InvtyCat+'</h1><h4>'+results.rows.item(ind).Brand_InvtyCat+'</h4><br><p>'+results.rows.item(ind).FullDescription_InvtyCat+'</p><br><p><b>Catalogue: </b>'+results.rows.item(ind).CatalogueTitle_CatMstr+'<br><b>Category: </b>'+results.rows.item(ind).CategoryName_CatgyMstr+'</p><small>Valid from:<br>' + results.rows.item(ind).PromoStartDate_CatMstr + ' to ' + results.rows.item(ind).PromoEndDate_CatMstr +'</small><br><a href="#" class="btn btn-success btn-large viewItem" data-itemid="'+ results.rows.item(ind).RowNumber_InvtyCat +'">View</a></div><div class="clearfix"><hr></div>';
        htmlstring += '<div class="col-md-4 col-sm-4 col-xs-12"><img src="'+ results.rows.item(ind).PictureFileName_InvtyCat +'" class="responsiveImage"></div><div class="col-md-8 col-sm-8 col-xs-12"><h1>'+results.rows.item(ind).PromoName_InvtyCat+'</h1><h4>'+results.rows.item(ind).Brand_InvtyCat+'</h4><br><p>'+results.rows.item(ind).FullDescription_InvtyCat+'</p><br><p><b>Catalogue: </b>'+results.rows.item(ind).CatalogueTitle_CatMstr+'</p><small>Valid from:<br>' + results.rows.item(ind).PromoStartDate_CatMstr + ' to ' + results.rows.item(ind).PromoEndDate_CatMstr +'</small><br><a href="#" class="btn btn-success btn-large viewItem" data-itemid="'+ results.rows.item(ind).SysPk_InvtyCat +'">View</a></div><div class="clearfix"><hr></div>';
   		
    }
  }
	else
	{
		
		htmlstring += '<div class="col-md-4 col-sm-4 col-xs-12"><p>Sorry, we don\'t have this item.</p></div>'
	}
	
        $('#itemsList').append(htmlstring);
   
}


function startSearch()
{
    
    $("#searchForm").on('submit', function()
    {   $('#itemsList').empty();
     
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/))
        { 
            db.transaction(queryForSearch, errorCB);
        }
        

        return false;//prevents refresh on submit
    });
        
        
          
}


function queryCategoriesForSelectBox(tx)
{   
	tx.executeSql('SELECT * FROM CATEGORY_MASTER', [], renderCategoriesToSelectBox);
}

function renderCategoriesToSelectBox(tx,results)
{   
    var categoriesString = '';
	
	for(var ind=0; ind < results.rows.length ; ind++ )
	{
		categoriesString += '<option value="'+results.rows.item(ind).SysPk_CatgyMstr+'">'+results.rows.item(ind).CategoryName_CatgyMstr+'</option>';
	}
	$('.search-category').append(categoriesString);
 

}

function queryCataloguesForSelectBox(tx)
{
   
    	tx.executeSql('SELECT * FROM CATALOGUE_MASTER', [], renderCataloguesToSelectBox);
}

function renderCataloguesToSelectBox(tx,results)
{  
    
    var CataloguesString = '';

	for(var ind=0; ind < results.rows.length ; ind++ )
	{
		CataloguesString += '<option value="'+results.rows.item(ind).SysPk_CatMstr+'">'+results.rows.item(ind).CatalogueTitle_CatMstr+'</option>';
	}
	$('.search-catalogue').append(CataloguesString);
}

































function queryCartSettings(tx)
{
	  
    tx.executeSql('SELECT * FROM SETTINGS' , [], renderCartList, errorCB);

}



function renderCartList(tx,results)
{
	/*initialization of variables for valid items. Only  data  from valid variables will be passed to order all button*/
    varlidORDERIDS = [];//TURNED TO GLOBAL.. set back to zero each time cart is opened.
    responsecount = 0;//set back to zero whenever rendercartlist
    
	var validSKUArr = [];
	var validpicturefilenameArr = [];
	var validbarcodeArr = [];
	var validbrandArr = [];
	var validfulldescriptionArr = [];
	var validcataloguetitleArr = [];
	var validpromonameArr = [];
	var validpromoPriceArr = [];
	var validpromoEndDateArr = [];
	var validpromoStartDateArr = [];
	var validQuantityArr = [];
	var validsubtotalArr = [];
	var validorderedFromArr = [];
  
	
	
    //removing last comma from end of locaStorage.
    var orderAllTotal = 0;
    var SKUForArr = localStorage.sku.replace(/,\s*$/,'');
	var picturefilenameForArr = localStorage.picturefilename.replace(/,\s*$/,'');
	var BarcodeInvtyCatForArr = localStorage.BarcodeInvtyCat.replace(/,\s*$/,'');
	var BrandInvtyCatForArr = localStorage.BrandInvtyCat.replace(/,\s*$/,'');
	var fulldescriptionForArr = localStorage.fulldescription.replace(/,\s*$/,'');
	var cataloguetitleForArr = localStorage.cataloguetitle.replace(/,\s*$/,'');
	var promoPriceForArr = localStorage.promoPrice.replace(/,\s*$/,'');
	var promoEndDateForArr = localStorage.promoenddate.replace(/,\s*$/,'');
	var promoStartDateForArr = localStorage.promostartdate.replace(/,\s*$/,'');
	var promonameForArr = localStorage.promoname.replace(/,\s*$/,'');
	var quantityForArr = localStorage.quantity.replace(/,\s*$/,'');
	var subtotalForArr = localStorage.subtotal.replace(/,\s*$/,'');
	var orderedFromArr = localStorage.orderedfrom.replace(/,\s*$/,'');

   
	
	/*turn strings seperated by commas into array*/
    cartSKUArr = SKUForArr.split(',');
	cartpicturefilenameArr =  picturefilenameForArr.split(',');
	cartbarcodeArr =  BarcodeInvtyCatForArr.split(',');
	cartbrandArr =  BrandInvtyCatForArr.split(',');
	cartfulldescriptionArr =  fulldescriptionForArr.split(',');
	cartcataloguetitleArr = cataloguetitleForArr.split(',');
	cartpromoPriceArr =  promoPriceForArr.split(',');
	cartpromoEndDateArr = promoEndDateForArr.split(',');
	cartpromoStartDateArr = promoStartDateForArr.split(',');
	cartpromonameArr =  promonameForArr.split(',');
	cartQuantityArr =  quantityForArr.split(',');
	cartsubtotalArr = subtotalForArr.split(',');
	cartorderedFromArr = orderedFromArr.split(',');

    
    var cartLength = cartbarcodeArr.length;
    var htmlstringcart = '';
    
    var orderid ='';

    if(cartLength == 1 && !cartbarcodeArr[0])
    {  
        htmlstringcart = '<div class="row"><div class="col-md-12 col-sm-12 col-xs-12"><h1>No Orders</h1></div></div>';
    }
    else
    {
        
     for(var ind=0; ind < cartLength; ind++)
     {
       
		 orderid += ind.toString() + ',';


			if((getDateTimeNow() >= cartpromoStartDateArr[ind]) && (getDateTimeNow()<= cartpromoEndDateArr[ind]))//if valid date
			{
				orderAllTotal += parseFloat(cartsubtotalArr[ind]);//only valid items are totaled
				
                
                
                htmlstringcart += '<div class="row cartItemCont"><div class="col-md-3 col-sm-3 col-xs-12">';
                
                toNormalString(cartpicturefilenameArr[ind]);
                htmlstringcart += '<img src="'+ returnedNormal+'" class="responsiveImage" alt="no image available"></div><div class="col-md-9 col-sm-9 col-xs-12"><div class="row"><div class="col-md-11 col-sm-11 col-xs-11">';
				
                //commas are toNormal because this is for display
				toNormalString(cartpromonameArr[ind]);
				htmlstringcart +=  '<h2>'+ returnedNormal +'</h2>';
                
                toNormalString(cartbrandArr[ind]);
				htmlstringcart +=  '<h4>'+ returnedNormal +'</h4>';
				
				toNormalString(cartfulldescriptionArr[ind]);
				htmlstringcart +='<p><b>Description: </b><br><span>'+returnedNormal+'</span><br><br>';		
				
				toNormalString(cartcataloguetitleArr[ind]);
				htmlstringcart +='<b>Catalogue :</b><span>'+returnedNormal+'</span></p>';
                
            
				
				htmlstringcart += '</div><div class="col-md-1 col-sm-1 col-xs-1"><a href="#" class="edit-order" data-orderid="'+ ind +'">edit</a></div></div></div><div class="col-md-12 col-sm-12 col-xs-12"><p class="pull-left">quantity: <span>'+cartQuantityArr[ind]+'</span></p><p class="pull-right">$<span>'+ cartsubtotalArr[ind] +'</span></p></div></div>' ;


				
                varlidORDERIDS.push(ind);

				validSKUArr.push(cartSKUArr[ind]);
				validpicturefilenameArr.push(cartpicturefilenameArr[ind]);
				validbarcodeArr.push(cartbarcodeArr[ind]);
				validbrandArr.push(cartbrandArr[ind]);
				validfulldescriptionArr.push(cartfulldescriptionArr[ind]);
				validcataloguetitleArr.push(cartcataloguetitleArr[ind]);
				validpromonameArr.push(cartpromonameArr[ind]);
				validpromoPriceArr.push(cartpromoPriceArr[ind]);
				validpromoEndDateArr.push(cartpromoEndDateArr[ind]);
				validpromoStartDateArr.push(cartpromoStartDateArr[ind]);
				validQuantityArr.push(cartQuantityArr[ind]);
				validsubtotalArr.push(cartsubtotalArr[ind]);
				validorderedFromArr.push(cartorderedFromArr[ind]);




			}
			else
			{
				htmlstringcart +=  '<div class="row cartItemCont invalid"><div class="col-md-3 col-sm-3 col-xs-12"><img src="'+ cartpicturefilenameArr[ind]+'" class="responsiveImage" alt="no image available"></div><div class="col-md-9 col-sm-9 col-xs-12"><div class="row"><div class="col-md-11 col-sm-11 col-xs-11">';
                
                toNormalString(cartpromonameArr[ind]);
                htmlstringcart += '<h2>'+returnedNormal+ '</h2>';
                
                toNormalString(cartbrandArr[ind]);
                htmlstringcart += '<h4>'+returnedNormal+'</h4>';
                
                htmlstringcart += '<small class="warning"> - This Item is only valid from '+ cartpromoStartDateArr[ind] + ' to ' +  cartpromoEndDateArr[ind] +'</small><br>';
                
				toNormalString(cartfulldescriptionArr[ind]);
				htmlstringcart +='<p><b>Description: </b><br><span>'+returnedNormal+'</span><br><br>';		
				
				toNormalString(cartcataloguetitleArr[ind]);
				htmlstringcart +='<b>Catalogue :</b><span>'+returnedNormal+'</span></p>';
				
				htmlstringcart += '</div><div class="col-md-1 col-sm-1 col-xs-1"><a href="#" class="edit-order" data-orderid="'+ ind +'">edit</a></div></div></div><div class="col-md-12 col-sm-12 col-xs-12"><p class="pull-left">quantity: <span>'+cartQuantityArr[ind]+'</span></p><p class="pull-right">$<span>'+ cartsubtotalArr[ind] +'</span></p></div></div>' ;

			}


			 
  		}//end of for loop
		

        
    }

    
    localStorage.orderid = orderid;
    $('#cartListCont').empty();
    $('#cartListCont').append(htmlstringcart);
  
    
    


    


	
    
    if(networkstatus =='disconnected')
    {
        $('.orderAll-cont').empty(); 

        $('.orderAll-cont').append('<a href="#" class="btn btn-default btn-large orderAllDisabledLook">Order All</a>');
        $('.orderAll-cont').append('<small class="orderAllAreaNote">You must be online inorder to checkout.</small>');
    }
    else if(orderAllTotal == 0)
    {
        $('.orderAll-cont').empty(); 

        $('.orderAll-cont').append('<a href="#" class="btn btn-default btn-large orderAllDisabledLook">Order All</a>');
        $('.orderAll-cont').append('<small class="orderAllAreaNote">There is nothing to check out.</small>');
    }
    else
    {
        $('.orderAll-cont').empty(); 
    
        $('.orderAll-cont').append('<a href="#" class="btn btn-success btn-large orderAll" data-orderid="'+varlidORDERIDS.toString()+'" data-sku="'+ validSKUArr.toString() +'" data-picturefilename="'+ validpicturefilenameArr.toString() +'" data-barcode="'+validbarcodeArr.toString()+'" data-brand="'+validbrandArr.toString()+'" data-fulldescription="'+ validfulldescriptionArr.toString() +'"  data-cataloguetitle="'+ validcataloguetitleArr.toString() +'" data-promoname="' + validpromonameArr.toString() +'"  data-promoPrice="'+ validpromoPriceArr.toString()+'" data-promoEndDate="'+validpromoEndDateArr.toString()+'" data-promoStartDate="'+validpromoStartDateArr.toString()+'"  data-quantity= "'+validQuantityArr.toString() +'"  data-subtotal="'+ validsubtotalArr.toString()+'" data-orderedfrom="'+validorderedFromArr.toString()+'">Order All</a>');
   

        if(orderAllTotal >= results.rows.item(0).MinimumPrice_Settings)
        {

            $('.orderAll-cont').append('<br><small class="orderAllAreaNote">Total: P'+ orderAllTotal +'<br>-You get free shipping for purchasing atleast P'+ results.rows.item(0).MinimumPrice_Settings+'.</small>');

        }
        else
        {

           $('.orderAll-cont').append('<small class="orderAllAreaNote"><small>Total: P'+ orderAllTotal +'</small><br>-If you reach atleast P'+ results.rows.item(0).MinimumPrice_Settings+' worth of items, you can get free shipping.</small>');


        }
    }
    
    $('body').off('click','.orderAll').on('click','.orderAll' , function()
    {
        
        $('.noti-any , .noti-blanket').show();
        $('.noti-any').html('<p>This will transfer all valid items in list to the online cart.</p><br><a href="#" class="btn btn-danger orderAllCancel">Cancel</a><a href="#" class="btn btn-success pull-right orderAllAgree">Okay</a><div class="clearfix"></div>');
    });

    $('body').off('click','.orderAllCancel').on('click','.orderAllCancel', function()
    {
         $('.noti-any , .noti-blanket').hide();
    });
    
     $('body').off('click','.orderAllAgree').on('click','.orderAllAgree' , function()
     {
         
         $('.noti-any , .noti-blanket').hide();
     
       /* alert($('.orderAll').attr('data-sku'));
        alert($('.orderAll').attr('data-picturefilename'));
        alert($('.orderAll').attr('data-barcode'));
        alert($('.orderAll').attr('data-brand'));
        alert($('.orderAll').attr('data-fulldescription'));
        alert($('.orderAll').attr('data-cataloguetitle'));
        alert($('.orderAll').attr('data-promoname'));
        alert($('.orderAll').attr('data-promoPrice'));
        alert($('.orderAll').attr('data-promoEndDate'));
        alert($('.orderAll').attr('data-promoStartDate'));
        alert($('.orderAll').attr('data-quantity'));
        alert($('.orderAll').attr('data-subtotal'));
        alert('ordered from: ' + $('.orderAll').attr('data-orderedfrom'));
        alert('TOTAL:' + orderAllTotal);
         */
         
        
        alert('http://viveg.net/index.php?barcode='+$('.orderAll').attr('data-barcode')+'&quantity='+$('.orderAll').attr('data-quantity')+'&email=useremail@gmail.com'+'&mobile=09999999999'+'&localmobiledate='+getDateNow()+'&glog-app-access=76ef0d45220fdee3ac883a0c7565e50c');
        
        ref = window.open('http://viveg.net/index.php?barcode='+$('.orderAll').attr('data-barcode')+'&quantity='+$('.orderAll').attr('data-quantity')+'&email=useremail@gmail.com'+'&mobile=09999999999'+'&localmobiledate='+getDateNow()+'&glog-app-access=76ef0d45220fdee3ac883a0c7565e50c', '_blank', 'location=yes');
    


        
      
        //This simply removes all valid items. after order all button is clicked.
        for(var xx=0; xx < varlidORDERIDS.length; xx++)
        { 
            //alert('removing ' + varlidORDERIDS[xx]);
           removeitems(varlidORDERIDS[xx],varlidORDERIDS.length);  
            
        }
        
        /*~~~~~~~~~This area should be erased when using waitforresponse function~~~~~~~~~~~~~~~~~~~~~~~~~~*/
         $('.navbar-nav > li > a[href="list.html"]').click();
        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        
        
       //IMPORTANT: IF YOU WANT TO WAIT FOR RESPONSE API ON WHAT ITEM TO REMOVE FROM CART
        //waitforresponse(); //but there is still no response api
   

 
         
         
     });
        



        

        
    


        
	

    
}

var removeFromCartPlease = [];

function waitforresponse()
{
   
     //alert('responsecount: ' + responsecount + '/' +varlidORDERIDS.length);
    if(responsecount < varlidORDERIDS.length)
    {

        $.getJSON("http://viveg.net/dummyprestashop/response.php",function(data)
        {
                 $.each(data, function( index, value ) 
                 {
                    $.each(value, function(inde, valu)
                     {
                         $.each(valu, function(ind, val)
                          {    


                          //  alert(val['orderid'] + ' - ' +val['do']);
                             
                             if(val['do']=='remove')
                             {
                                 removeFromCartPlease.push(val['orderid']);
                             //    alert(val['orderid'] + ' pushed');
                             }


                             

                                   responsecount += 1;
                               
                      
                         });

                      });
                });
        }); 
        setTimeout(function() {
           waitforresponse();
        }, 400);
    }
    else
    {
       // alert('received response for all items');
       // alert('removeplease array values :'  + removeFromCartPlease);
        
        for(var xx=0; xx < removeFromCartPlease.length; xx++)
        { 
         //   alert('removing ' + removeFromCartPlease[xx]);
           removeitems(removeFromCartPlease[xx],removeFromCartPlease.length);  
            
        }
        
        //clear
        removeFromCartPlease = [];
        responsecount = 0;
        
         $('.navbar-nav > li > a[href="list.html"]').click();
    }
}

function removeitems(itemindex,numberOfItemsThatNeedsToBeRemoved)
{
    // alert('before splice number#'+numberOfItemsRemovedSofar+'----'+ cartpromonameArr);
  
                    cartSKUArr[itemindex] = null;//change values to null first to not mess up the orderids.
					cartpicturefilenameArr[itemindex] = null;
					cartbarcodeArr[itemindex] = null;
					cartbrandArr[itemindex] = null;
					cartfulldescriptionArr[itemindex] = null;
					cartcataloguetitleArr[itemindex] = null;
                    cartpromonameArr[itemindex] = null;
                    cartpromoPriceArr[itemindex] = null;
					cartpromoEndDateArr[itemindex] = null;
					cartpromoStartDateArr[itemindex] = null;
                    cartQuantityArr[itemindex] = null;
                    cartsubtotalArr[itemindex] = null;
                    cartorderedFromArr[itemindex] = null;



        numberOfItemsRemovedSofar+= 1;
     // alert(numberOfItemsRemovedSofar + ' of ' + numberOfItemsThatNeedsToBeRemoved + ' removed');
 //   alert('before splice number#'+numberOfItemsRemovedSofar+'----'+ cartpromonameArr);
    
    


    if(numberOfItemsRemovedSofar == numberOfItemsThatNeedsToBeRemoved )
    {
            updatelocalStorageAfterSplicing();

        
        numberOfItemsRemovedSofar = 0;//set back to zero because remove completed.
     //     alert('removed all items that needed to be removed.');
    }
                    
              
}


function updatelocalStorageAfterSplicing()
{
   
    
    
        cartSKUArr= jQuery.grep(cartSKUArr, function(n, i){return (n !== "" && n != null); });
        cartpicturefilenameArr= jQuery.grep(cartpicturefilenameArr, function(n, i){return (n !== "" && n != null); });
        cartbarcodeArr= jQuery.grep(cartbarcodeArr, function(n, i){return (n !== "" && n != null); });
        cartbrandArr= jQuery.grep(cartbrandArr, function(n, i){return (n !== "" && n != null); });
        cartfulldescriptionArr= jQuery.grep(cartfulldescriptionArr, function(n, i){return (n !== "" && n != null); });
        cartcataloguetitleArr= jQuery.grep(cartcataloguetitleArr, function(n, i){return (n !== "" && n != null); });
        cartpromonameArr= jQuery.grep(cartpromonameArr, function(n, i){return (n !== "" && n != null); });
        cartpromoPriceArr= jQuery.grep(cartpromoPriceArr, function(n, i){return (n !== "" && n != null); });
        cartpromoEndDateArr= jQuery.grep(cartpromoEndDateArr, function(n, i){return (n !== "" && n != null); });
        cartpromoStartDateArr= jQuery.grep(cartpromoStartDateArr, function(n, i){return (n !== "" && n != null); });
        cartQuantityArr= jQuery.grep(cartQuantityArr, function(n, i){return (n !== "" && n != null); });
        cartsubtotalArr= jQuery.grep(cartsubtotalArr, function(n, i){return (n !== "" && n != null); });
        cartorderedFromArr= jQuery.grep(cartorderedFromArr, function(n, i){return (n !== "" && n != null); });
     

    
    
  //      alert('after grep '  + cartpromonameArr);
    
                    if(cartbarcodeArr.length > 0)
                    {
                        
                      //  alert(cartbarcodeArr.length + '> 0');
						var newarrstring_sku = cartSKUArr.toString()+",";
						var newarrstring_picturefilename = cartpicturefilenameArr.toString()+",";
						var newarrstring_cartbarcode = cartbarcodeArr.toString()+",";
						var newarrstring_cartbrand = cartbrandArr.toString()+",";
						var newarrstring_fulldescription = cartfulldescriptionArr.toString()+",";
						var newarrstring_cataloguetitle = cartcataloguetitleArr.toString()+",";
                        var newarrstring_promoname = cartpromonameArr.toString()+",";
                        var newarrstring_promoPrice = cartpromoPriceArr.toString()+",";
						var newarrstring_promoEndDate = cartpromoEndDateArr.toString()+",";
						var newarrstring_promoStartDate = cartpromoStartDateArr.toString()+",";
                        var newarrstring_cartQuantity = cartQuantityArr.toString()+",";
                        var newarrstring_cartsubtotal = cartsubtotalArr.toString()+",";
                        var newarrstring_cartorderedFrom = cartorderedFromArr.toString()+",";
                       
                        
                       

                        
                        
                    } 
                    else//if last item, do not put comma at the end.
                    {
                        
                    //     alert(cartbarcodeArr.length + '<= 0');
                        
                        var newarrstring_sku = '';
                        var newarrstring_picturefilename = '';
                        var newarrstring_cartbarcode = '';
                        var newarrstring_cartbrand = '';
						var newarrstring_fulldescription = '';
						var newarrstring_cataloguetitle = '';
						var newarrstring_promoname = '';
                        var newarrstring_promoPrice ='';
						var newarrstring_promoEndDate = '';
						var newarrstring_promoStartDate = '';
                        var newarrstring_cartQuantity = '';
                        var newarrstring_cartsubtotal = '';
                        var newarrstring_cartorderedFrom = '';
        
                    }
               
    
    
    
    
    
                    localStorage.sku = newarrstring_sku;
                    localStorage.picturefilename = newarrstring_picturefilename;
					localStorage.BarcodeInvtyCat = newarrstring_cartbarcode;
					localStorage.BrandInvtyCat = newarrstring_cartbrand;
                    localStorage.fulldescription = newarrstring_fulldescription;
                    localStorage.cataloguetitle = newarrstring_cataloguetitle;
					localStorage.promoname = newarrstring_promoname;
                    localStorage.promoPrice = newarrstring_promoPrice;
					localStorage.promoenddate = newarrstring_promoEndDate;
					localStorage.promostartdate = newarrstring_promoStartDate;
                    localStorage.quantity = newarrstring_cartQuantity;
                    localStorage.subtotal = newarrstring_cartsubtotal;
                    localStorage.orderedfrom = newarrstring_cartorderedFrom;

}
/*----------------------------------------------------------------------*/
/*-------------------//navClickedListener.js-------------------------------*/
/*----------------------------------------------------------------------*/




/*----------------------------------------------------------------------*/
/*-------------------viewItemClicked.js-------------------------------*/
/*----------------------------------------------------------------------*/
function queryItemDetails(tx,idForSinglePage)
{

//tx.executeSql('SELECT IMC.*,CM.* FROM INVENTORY_MASTER_CATALOGUE AS IMC INNER JOIN CATALOGUE_MASTER AS CM ON IMC.SysFk_CatMstr_InvtyCat = CM.SysPk_CatMstr  WHERE IMC.RowNumber_InvtyCat=' + idForSinglePage , [], renderSinglePage, errorCB);  

tx.executeSql('SELECT CatgyM.*, CMIMCIMCCatgy.* FROM(SELECT IMCIMCCatgy.*,CM.* FROM CATALOGUE_MASTER AS CM  INNER JOIN(SELECT IMC.* , IMCCatgy.* FROM INVENTORY_MASTER_CATALOGUE AS IMC LEFT JOIN INVENTORY_MASTER_CATALOGUE_CATEGORY AS IMCCatgy ON IMC.SysPk_InvtyCat=IMCCatgy.SysFk_InvtyCat_InvtyCatCatgy)AS IMCIMCCatgy ON IMCIMCCatgy.SysFk_CatMstr_InvtyCat = CM.SysPk_CatMstr)AS CMIMCIMCCatgy LEFT JOIN CATEGORY_MASTER AS CatgyM ON CatgyM.SysPk_CatgyMstr = CMIMCIMCCatgy.SysFk_CatgyMstr_InvtyCatCatgy   WHERE CMIMCIMCCatgy.SysPk_InvtyCat= ?' , [idForSinglePage], renderSinglePage, errorCB);  


    
    
if(globalorderFromSwitch == 1){	globalorderedFrom = 'search';  }	else{globalorderedFrom = 'catalogue';	}
	
	
   
	
}

function renderSinglePage(tx,results)
{
   
    var doesThisExist = results.rows.length;
   
    
   
    if(doesThisExist > 0)
    {
		
		
        $('.content-cont').load('single-item.html',null,function(){
        
         $('.singleitemPictureFileName').attr('src',results.rows.item(0).PictureFileName_InvtyCat);
         $('.singleitempromoname').append(results.rows.item(0).PromoName_InvtyCat);
         $('.singleitembrand').append(results.rows.item(0).Brand_InvtyCat);
         $('.singleitemfulldescription').append(results.rows.item(0).FullDescription_InvtyCat);
         $('.singleitemcatalogue').append(results.rows.item(0).CatalogueTitle_CatMstr);
			//will be more complex than this afterall. since 1 item can belong to multiple categories // $('.singleitemcategory').append(results.rows.item(0).CategoryName_CatgyMstr);
         $('.singleitempromoprice').append(results.rows.item(0).PromoPrice_InvtyCat);
         $('.singleitemsubtotal').append(results.rows.item(0).PromoPrice_InvtyCat);//temporary. value will change on quantity input
			
            


            
			
		if((getDateTimeNow() >= results.rows.item(0).PromoStartDate_CatMstr)&&(getDateTimeNow() <= results.rows.item(0).PromoEndDate_CatMstr))
		{
			$('.InvalidNote').hide();
			
		}
		else
		{
			$('.InvalidNote').append('-This item is only valid from ' + results.rows.item(0).PromoStartDate_CatMstr + ' to ' + results.rows.item(0).PromoEndDate_CatMstr +'.<br>');

		}
            

			
            /*----------------------------------Add To List button----------------------------------------*/
          
                var placeorderbtnstring =  '<a href="#" class="btn btn-success btn-large addToList" data-sku="'+ results.rows.item(0).SKU_InvtyCat +'" data-promoPrice="'+ results.rows.item(0).PromoPrice_InvtyCat +'" data-promoEndDate="'+ results.rows.item(0).PromoEndDate_CatMstr +'" data-promoStartDate="'+ results.rows.item(0).PromoStartDate_CatMstr +'" ';

                toCustomString(results.rows.item(0).CatalogueTitle_CatMstr);
                placeorderbtnstring	+=' data-catalogue="'+ returnedCustom +'" ';

                toCustomString(results.rows.item(0).PromoName_InvtyCat);
                placeorderbtnstring	+=' data-promoname="'+ returnedCustom +'" ';

                toCustomString(results.rows.item(0).PictureFileName_InvtyCat);
                placeorderbtnstring += ' data-picturefilename="'+ returnedCustom  +'"';

                toCustomString(results.rows.item(0).FullDescription_InvtyCat);
                placeorderbtnstring +=' data-fulldescription="'+ returnedCustom +'" data-BarcodeInvtyCat="'+results.rows.item(0).Barcode_InvtyCat+'" data-BrandInvtyCat="'+results.rows.item(0).Brand_InvtyCat+'" data-quantity="1" data-subtotal="'+ results.rows.item(0).PromoPrice_InvtyCat +'" data-orderedfrom="'+ globalorderedFrom +'">Add To list</a>';
          
			  /*----------------------------------//Add To List button----------------------------------------*/		
			
			//alert(placeorderbtnstring);
			$( '.singleitemtable' ).after(placeorderbtnstring);
		
        });
       
        

    }
    else
    {
        htmlstringSingle = 'Sorry, we do not have this item.';
        $('.content-cont').empty();
        $('.content-cont').append(htmlstringSingle);
    
    }


    
    
    

}
/*----------------------------------------------------------------------*/
/*-------------------//viewItemClicked.js-------------------------------*/
/*----------------------------------------------------------------------*/

/*----------------------------------------------------------------------*/
/*-------------------itemScannedListener.js-------------------------------*/
/*----------------------------------------------------------------------*/
function queryItemDetailsByBarcode(tx,scanResult)
{
  //alert('queryItemDetailsByBarcode started');
  tx.executeSql('SELECT IMC.*, CM.* FROM INVENTORY_MASTER_CATALOGUE AS IMC INNER JOIN CATALOGUE_MASTER AS CM  ON IMC.SysFk_CatMstr_InvtyCat = CM.SysPk_CatMstr WHERE IMC.Barcode_InvtyCat="' + scanResult +'"', [], renderSinglePage, errorCB); 
  //alert('queryItemDetailsByBarcode done');
	globalorderedFrom = 'scan';
}

//renderSinglePage already created for viewItemClicked.js

/*----------------------------------------------------------------------*/
/*-------------------//itemScannedListener.js-------------------------------*/
/*----------------------------------------------------------------------*/



/*-----------------single-itme.html to list.html---------------------*/

   
    
    $(document).on('input','#glogquantity',function ()
    {
        /*keycodes undefined are undefined so i did this instead*/

        
        var glogprice = $('.glogprice').html(); 
        
         var currentvalue = $('#glogquantity').val();
         var glogqlen = $.trim($('#glogquantity').val());
        
        //alert('glogqlen ='+glogqlen);
        
        if(glogqlen.length>0 && currentvalue != 0 && currentvalue !='0' && testinput(/[^0-9.]/, currentvalue)==0)//if not empty && not zero && (does not contain any none numeric && glogqlen == 1)
        {
          //alert('in if');
            //alert('currentvalue =' + currentvalue);
            
            var newvalue = currentvalue.toString().replace(/[^0-9\.]+/g, '');
            $('#glogquantity').val(newvalue);
            var qval = $('#glogquantity').val();
            
            
        }
        else
        {
            
          //alert('in else');
            currentvalue = 1;
           // //alert('currentvalue =' + currentvalue);
            
            var newvalue = currentvalue.toString().replace(/[^0-9\.]+/g, '');
            $('#glogquantity').val('');
            var qval = 1;

        }
        
        
        //alert('after if else');
             
            
           
            parseInt(qval);
                
           // //alert(qval);
            var glogtotaltemp = qval *  glogprice;   
            var glogtotal = glogtotaltemp.toFixed(2);
           // //alert('glogtotal =' + glogtotal);
            $('.glogtotal').empty();
            $('.glogtotal').append(glogtotal);
           
    
            $('.addToList').attr('data-quantity',qval);
            $('.addToList').attr('data-subtotal',glogtotal);
       
      
    });
    

function testinput(re, str)
{
  
    
    if (re.test(str) && (str.length == 1))
    {
       // //alert('contains none numeric and string length == 1');
        return 1;
    } 
    else
    {
      //  //alert('does not contain none numeric || or contains but length > 1');
        return 0;
    }
  
}



$(document).on('click','.addToList', function()
{
    var SKU = $(this).attr('data-sku');
    var picturefilename = $(this).attr('data-picturefilename');
	var BarcodeInvtyCat = $(this).attr('data-BarcodeInvtyCat');
	var BrandInvtyCat = $(this).attr('data-BrandInvtyCat');
	var fulldescription = $(this).attr('data-fulldescription');
	var cataloguetitle = $(this).attr('data-catalogue');
    var promoname = $(this).attr('data-promoname');
    var promoPrice = $(this).attr('data-promoPrice'); 
	var promoEndDate = $(this).attr('data-promoEndDate'); 
	var promoStartDate = $(this).attr('data-promoStartDate'); 
    var quantity = $(this).attr('data-quantity');
    var subtotal = $(this).attr('data-subtotal');
    var orderedFrom = $(this).attr('data-orderedfrom');
   

    

    //this prevents commas from promonames from being interpreted as , when localstorage string is turned into an array
		//SKU = toCustomString(SKU.toString());
		// picturefilename = toCustomString(picturefilename.toString());
		// BarcodeInvtyCat = toCustomString(BarcodeInvtyCat.toString());
		//fulldescription = toCustomString(fulldescription);
		//promoname = toCustomString(promoname);
		//promoPrice = toCustomString(promoPrice.toString());
		//promoEndDate = toCustomString(promoEndDate.toString());
		//promoStartDate = toCustomString(promoStartDate.toString());
		// quantity = toCustomString(quantity.toString());
		// subtotal = toCustomString(subtotal.toString());
		//orderedFrom = toCustomString(orderedFrom.toString());


	
	
	localStorage.sku += SKU.toString()+',';

	localStorage.picturefilename += picturefilename.toString()+',';
	
	localStorage.BarcodeInvtyCat += BarcodeInvtyCat.toString()+',';
    
    toCustomString(BrandInvtyCat);
	localStorage.BrandInvtyCat += returnedCustom+',';

	
	toCustomString(fulldescription);
    localStorage.fulldescription += returnedCustom+',';
	
	toCustomString(cataloguetitle);
	localStorage.cataloguetitle += returnedCustom +',';
	
	toCustomString(promoname);
	localStorage.promoname += returnedCustom +',';
	
    localStorage.promoPrice += promoPrice+',';
	localStorage.promoenddate += promoEndDate.toString()+',';
	localStorage.promostartdate += promoStartDate.toString()+',';
    localStorage.quantity += quantity.toString()+',';
    localStorage.subtotal += subtotal.toString()+',';
	localStorage.orderedfrom += orderedFrom.toString()+',';
    


    $('.noti-any').html('<p>Item Added to List</p>');
    
    $('.noti-any, .noti-blanket').show();

setTimeout(function()
{
    
     $('.noti-any , .noti-blanket').hide();
     $('.forsingleonly a').click();//back
}, 1500);
    
    
   
});

/*----------------//single-itme.html  to list.html-------------------*/

/*---------------------------------------editOrder.html-----------------------------------*/
function editOrderPageQuantityInputListener()
{

   
    $(document).on('input','.edit-order-quantity',function ()
    {
        /*keycodes undefined are undefined so i did this instead*/
        var editorderpromoprice = $('.edit-order-promoPrice').html(); 
        var currentq = $('.edit-order-quantity').val();
         var editorderlen = $.trim($('.edit-order-quantity').val());

        
        if(editorderlen.length>0 && currentq != 0 && currentq !='0' && testinput(/[^0-9.]/, currentq)==0)//if not empty && not zero && (does not contain any none numeric && glogqlen == 1)
        {
            var newq = currentq.toString().replace(/[^0-9\.]+/g, '');
            $('.edit-order-quantity').val(newq);
            var qval = $('.edit-order-quantity').val();
   
        }
        else
        {
            currentq = 1;
            var newq = currentq.toString().replace(/[^0-9\.]+/g, '');
            $('.edit-order-quantity').val('');
            var qval = 1;

        }
        
            parseInt(qval);     
          
            var glogtotaltemp = qval *  editorderpromoprice;   
            var glogtotal = glogtotaltemp.toFixed(2);
          
            $('.edit-order-subtotal').empty();
            $('.edit-order-subtotal').append(glogtotal);

    });
}
/*-------------------------------//editorder.html----------------------------*/







//---------------------FUNCTIONS THAT DO SMALL STUFF like replace strings------------------------------
function toNormalString(stringWithCustomString)
{

	
	if((stringWithCustomString.indexOf('(xxxGLogCommaxxx)') != -1) || (stringWithCustomString.indexOf('(xxxGLogDQxxx)') != -1))
	{
		stringWithCustomString = stringWithCustomString.replace('(xxxGLogCommaxxx)',',');
		stringWithCustomString = stringWithCustomString.replace('(xxxGLogDQxxx)','"');//double quote
 		
		
		
		toNormalString(stringWithCustomString)
	}
	else
	{
		
		returnedNormal = stringWithCustomString;
		
    	
	}
}

function toCustomString(stringWithNormalString)
{
	

	
	if((stringWithNormalString.indexOf(',') != -1) || (stringWithNormalString.indexOf('"') != -1))
	{
		stringWithNormalString = stringWithNormalString.replace(',','(xxxGLogCommaxxx)');
		stringWithNormalString = stringWithNormalString.replace('"','(xxxGLogDQxxx)');//Double Quote

		
		toCustomString(stringWithNormalString)
	}
    else
	{
		returnedCustom = stringWithNormalString;
	 	

	}
}


function getDateTimeNow()
{
	var d = new Date();

	var month = d.getMonth()+1;
	var day = d.getDate();
	var hours = d.getHours();
	var minutes = d.getMinutes();
	var seconds = d.getSeconds();

	var output = d.getFullYear() + '-' +
		(month<10 ? '0' : '') + month + '-' +
		(day<10 ? '0' : '') + day + ' ' +
		(hours<10 ? '0' : '')+hours +':'+(minutes<10 ? '0' : '')+minutes+':'+(seconds<10 ? '0' : '')+seconds;

	return output;
}

function getDateNow()
{
    
    var d = new Date();

	var month = d.getMonth()+1;
	var day = d.getDate();
	var hours = d.getHours();
	var minutes = d.getMinutes();
	var seconds = d.getSeconds();

	var output = d.getFullYear() + '-' +
		(month<10 ? '0' : '') + month + '-' +
		(day<10 ? '0' : '') + day;

	return output;
}

function checkForWhereAnd(str)//replace all WHERE AND with WHERE
{	
	//alert('Initial String: ' + str);
	//alert('Index: ' + str.indexOf("WHERE AND"));
	if(str.indexOf("WHERE AND") != -1)
	{
		str = str.replace("WHERE AND", "WHERE"); 
		//alert('New String: ' + str);
		checkForWhereAnd(str);
	}

	
	return str;
}

function replaceQuotes(str)
{
	//alert('before replace: '+str);
	if(str.indexOf('"') != -1)
	{
		str=str.replace('"','%');
	//	alert('after replace: ' + str);
		replaceQuotes(str);
	}
	else
	{
		returnedReplaceQuote = str;//alert('return: ' +str);
	
	}
}