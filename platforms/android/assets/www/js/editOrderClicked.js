$(document).on('editOrderClicked',function(event,orderidtoedit)
{			
    

    
 

    
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
                 
                
                

                

                /*edting*/
                editOrderPageQuantityInputListener();
                
                
                
                /*save changes*/
                $('.content-cont').off('click', '.saveChanges').on('click', '.saveChanges',function()
                {
                    var editOrderNewQuantity = $('.edit-order-quantity').val();
                    var editOrderNewSubtotal = $('.edit-order-subtotal').html();

                    
                 
                    
                    var newQuantitylength =  $.trim(editOrderNewQuantity).length;
                    
                    
                    if(newQuantitylength == 0)//if field is left empty , the quantity will be 1
                    {
                        editOrderNewQuantity = 1;
                    }
                  
                    
                    cartQuantityArr[orderidtoedit] = editOrderNewQuantity;
                    cartsubtotalArr[orderidtoedit] = editOrderNewSubtotal;
            
        
                    
                    
                    var Quantity_ArrToSTring = cartQuantityArr.toString()+",";
                    var Subtotal_ArrToSTring = cartsubtotalArr.toString()+",";

                    
                    localStorage.quantity =  Quantity_ArrToSTring;
                    localStorage.subtotal = Subtotal_ArrToSTring;

                    
                    
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
                   

                    
               
                    
                    
                    alert('item removed');
                    $('.foreditorderonly a').click();
                    

                });
       
            });
    
      

});