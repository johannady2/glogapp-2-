$(document).on('editOrderClicked',function(event,orderidtoedit)
{			
    
//alert('chosesn texture: ' + carttextureFromArr[orderidtoedit]);
//alert('textures to choose from: ' + carttexturechoicesArr[orderidtoedit]);
//alert('chosen size: ' + cartsizeFromArr[orderidtoedit]);
//alert('sizes to choose from: ' + cartsizechoicesArr[orderidtoedit]);
    

    var arrOftexturechoices = carttexturechoicesArr[orderidtoedit].split('(xxxGLogCommaxxx)');
    var arrOfsizechoices = cartsizechoicesArr[orderidtoedit].split('(xxxGLogCommaxxx)');
    
    //alert('data for radio buttons: ' + arrOftexturechoices + '  -  ' + arrOfsizechoices);

    
            //alert(orderidtoedit);
            $('.navbar-brand , .navbar-nav > li').not('.foreditorderonly').hide();
            $('.foreditorderonly').show();
            
            $('.content-cont').empty();
            $('.content-cont').load("edit-order.html",  null, function()
            {
               
                /*INITIAL DISPLAY - BEFORE EDIT*/
                
                toNormalString(cartpicturefilenameArr[orderidtoedit]);
                $('.edit-order-PictureFileName').attr('src',returnedNormal);//<h1>promoname</h1>
               
				toNormalString(cartfulldescriptionArr[orderidtoedit]);
				$('.edit-order-fulldescription').append(returnedNormal);//<p>fulldescription</p>
				
				toNormalString(cartcataloguetitleArr[orderidtoedit]);
				$('.edit-order-catalogutitle').append(returnedNormal);//<p>fulldescription</p>
				
				toNormalString(cartpromonameArr[orderidtoedit]);
                $('.edit-order-promoname').append(returnedNormal);//<h1>promoname</h1>
				
                toNormalString(cartbrandArr[orderidtoedit]);
                $('.edit-order-brand').append(returnedNormal);
				
				$('.edit-order-promoPrice').append(cartpromoPriceArr[orderidtoedit]);//<h3>$<span>promoPrice</span></h3>
                $('.edit-order-quantity').val(cartQuantityArr[orderidtoedit]);//<input type="text" name="quantity" id="quatity" class="edit-order-quantity" value="1">                
                $('.edit-order-subtotal').append(cartsubtotalArr[orderidtoedit]);//<p><span>$</span><span class="edit-order-subtotal"></span></p>
                 
                
                
                
                var whichCheckedtexture = '';
                for(var indx = 0 ; indx < arrOftexturechoices.length ; indx++)
                {
                    //alert(arrOftexturechoices[indx] +'-'+ carttextureFromArr[orderidtoedit]);
                    if(arrOftexturechoices[indx] == carttextureFromArr[orderidtoedit]){ whichCheckedtexture = 'checked'; /*alert(whichCheckedtexture);*/ }else{whichCheckedtexture= '';}
                    
                    if(arrOftexturechoices[indx] != 'one_texture')
                    {
                        $('.edit-order-texturefieldscont').append('<input type="radio" name="singleitemtexture" value="'+arrOftexturechoices[indx]+'" class="img-radio" id="texture-'+indx+'" '+whichCheckedtexture+' /><label for="texture-'+indx+'"><div style="background-image:url(\''+arrOftexturechoices[indx]+'\'); background-size: 60px 60px; display:block; width:50px; height:50px; border-radius: 5px; margin-left: 20px;"></div></label>');
                    }
                    else
                    {
                        $('.edit-order-texturefieldscont').empty();
                        $('.edit-order-texturefieldscont').append('<input type="radio" name="singleitemtexture" value="one_texture"  id="texture-'+indx+'" checked /><label for="texture-'+indx+'"one_texture</label>');
                        $('.edit-order-texturetr').hide();
                    }
                    
                }
                
                
                var whichCheckedSize = '';
                for(var ind = 0 ; ind < arrOfsizechoices.length ; ind++)
                {
                    //alert(arrOfsizechoices[ind] +'-'+ cartsizeFromArr[orderidtoedit]);
                    if(arrOfsizechoices[ind]==cartsizeFromArr[orderidtoedit]){whichCheckedSize = 'checked'; /*alert(whichCheckedSize);*/}else{whichCheckedSize = '';}
                    
                    
                    if(arrOfsizechoices[ind] != 'one_size')
                    {
                        $('.edit-order-sizefieldscont').append('<input type="radio" name="singleitemsize" value="'+arrOfsizechoices[ind]+'" id="size-'+arrOfsizechoices[ind]+'" '+whichCheckedSize+'/><label for="size-'+arrOfsizechoices[ind]+'">'+arrOfsizechoices[ind]+'</label> &nbsp; &nbsp;');
                    }
                    else
                    {
                         $('.edit-order-sizefieldscont').empty();
                         $('.edit-order-sizefieldscont').append('<input type="radio" name="singleitemsize" value="one_size" id="size-'+arrOfsizechoices[ind]+'" checked/><label for="size-'+arrOfsizechoices[ind]+'">one_size</label> &nbsp; &nbsp;');
                        $('.edit-order-itemsizetr').hide();
                    }
                    
                    
                }
                /*edting*/
                editOrderPageQuantityInputListener();
                
                
                
                /*save changes*/
                $('.content-cont').off('click', '.saveChanges').on('click', '.saveChanges',function()
                {
                    var editOrderNewQuantity = $('.edit-order-quantity').val();
                    var editOrderNewSubtotal = $('.edit-order-subtotal').html();
                    var editOrderTexture = $('input[name="singleitemtexture"]:checked').val();
                    var editOrderSize = $('input[name="singleitemsize"]:checked').val();
                    
                    
                   // alert(editOrderTexture);
                   // alert(editOrderSize);
                    
                    
                    var newQuantitylength =  $.trim(editOrderNewQuantity).length;
                    
                    
                    if(newQuantitylength == 0)//if field is left empty , the quantity will be 1
                    {
                        editOrderNewQuantity = 1;
                    }
                  
                    
                    cartQuantityArr[orderidtoedit] = editOrderNewQuantity;
                    cartsubtotalArr[orderidtoedit] = editOrderNewSubtotal;
                    carttextureFromArr[orderidtoedit] = editOrderTexture;
                    cartsizeFromArr[orderidtoedit] = editOrderSize;
        
                    
                    
                    var Quantity_ArrToSTring = cartQuantityArr.toString()+",";
                    var Subtotal_ArrToSTring = cartsubtotalArr.toString()+",";
                    var Texture_ArrToSTring = carttextureFromArr.toString()+",";
                    var Size_ArrToSTring = cartsizeFromArr.toString()+",";
                    
                    localStorage.quantity =  Quantity_ArrToSTring;
                    localStorage.subtotal = Subtotal_ArrToSTring;
                    localStorage.texture = Texture_ArrToSTring;
                    localStorage.size = Size_ArrToSTring;
                    
                    
                    alert('changes saved.');
                    $('.foreditorderonly a').click();

                });

                
                
                /*remove from cart*/
                $('.content-cont').off('click', '.removeFromCart').on('click', '.removeFromCart',function()
                {
                    
                    //NOTE: there's removeitems function but let's just stick with this for now because that was designed for batch remove and it'll take some time to figure out how to utilize that function here. 
                    
                    //NOTE: probably just removeitems(orderidtoedit,1) but i'll try that some other time.
                    
                    cartSKUArr.splice(orderidtoedit,1);//remove index of array
					cartpicturefilenameArr.splice(orderidtoedit,1);
					cartbarcodeArr.splice(orderidtoedit,1);
					cartbrandArr.splice(orderidtoedit,1);
					cartfulldescriptionArr.splice(orderidtoedit,1);
					cartcataloguetitleArr.splice(orderidtoedit,1);
                    cartpromonameArr.splice(orderidtoedit,1);
                    cartpromoPriceArr.splice(orderidtoedit,1);
					cartpromoEndDateArr.splice(orderidtoedit,1);
					cartpromoStartDateArr.splice(orderidtoedit,1);
                    cartQuantityArr.splice(orderidtoedit,1);
                    cartsubtotalArr.splice(orderidtoedit,1);
                    cartorderedFromArr.splice(orderidtoedit,1);
                    carttextureFromArr.splice(orderidtoedit,1);
                    cartsizeFromArr.splice(orderidtoedit,1);
                    carttexturechoicesArr.splice(orderidtoedit,1);
                    cartsizechoicesArr.splice(orderidtoedit,1);
                    
                    if(cartbarcodeArr.length > 0)
                    {
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
                        var newarrstirng_carttexture = carttextureFromArr.toString()+",";     
                        var newarrstirng_cartsize = cartsizeFromArr.toString()+",";
                        var newarrstirng_carttexturechoices =  carttexturechoicesArr+",";
                        var newarrstirng_cartsizechoices = cartsizechoicesArr+",";
                        
                       

                        
                        
                    } 
                    else//if last item, do not put comma at the end.
                    {
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
                        var newarrstirng_carttexture = '';
                        var newarrstirng_cartsize = '';
                        var newarrstirng_carttexturechoices =  '';
                        var newarrstirng_cartsizechoices = '';
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
                    localStorage.texture  = newarrstirng_carttexture;
                    localStorage.size = newarrstirng_cartsize;
                    localStorage.texturechoicesFOREDITPAGE = newarrstirng_carttexturechoices;
                    localStorage.sizechoicesFOREDITPAGE =newarrstirng_cartsizechoices;

                    
               
                    
                    
                    alert('item removed');
                    $('.foreditorderonly a').click();
                    

                });
       
            });
    
      

});