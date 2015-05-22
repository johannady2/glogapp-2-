$(document).on('viewItemClicked',function(event,idForSinglePage)
{
  if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/))
    {   
        
        $('.navbar-brand , .navbar-nav > li').not('.forsingleonly').hide();
        $('.forsingleonly').show();
        db.transaction(function(tx){queryItemDetails(tx,idForSinglePage)},errorCB);
        
        

    }
});