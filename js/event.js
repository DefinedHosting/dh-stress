jQuery(document).ready(function($){
//console.log(dh_events_script_vars.entrypage);
	$('a[href^="tel:"]').on('click', function(){
    //console.log('clicked');
    $.ajax({
      url : dh_events_script_vars.ajaxurl,
      type : 'post',
      data : {
          action : 'dh_event',
          domain : window.location.host,
          url : window.location.pathname,
          subject: $(this).attr('href').replace('tel:',''),
          type: 'Phone Call',
					entrypage:dh_events_script_vars.entrypage,
					email:dh_events_script_vars.email,
					user_agent: dh_events_script_vars.userAgent
        }
	    });
  });
	$('a[href^="mailto:"]').on('click', function(){
  //  console.log('clicked');
    $.ajax({
      url : dh_events_script_vars.ajaxurl,
      type : 'post',
      data : {
          action : 'dh_event',
          domain : window.location.host,
          url : window.location.pathname,
          subject: 'Email link clicked',
          type: 'Email',
					entrypage:dh_events_script_vars.entrypage,
					email:dh_events_script_vars.email,
					user_agent: dh_events_script_vars.userAgent

        }
	   });
  });
	$('form').on('submit', function(){
		//console.log('well were here');
		var formSubject = '';
		var submission_type = 'Form Submission';
		// woo-commerce
		if($(this).hasClass('woocommerce-checkout') || $(this).attr('id') == 'sn_checkout_form'){
				formSubject = 'Order Placed';
				submission_type = 'Order';
		}else if(
			   $(this).hasClass('cart')
			|| $(this).hasClass('woocommerce-cart-form')
			|| $(this).hasClass('woocommerce-form-coupon')
			|| $(this).hasClass('woocommerce-ordering')
			|| $(this).hasClass('pa_size')
			|| $(this).hasClass('orderby')
			|| $(this).attr('action') == window.location.pathname){
					// do nothing
					return;
		}
		else{
			var subjectField = $('*.subject-field');
			if(subjectField.length > 0){
				if(subjectField.find('input').length > 0){
					formSubject = subjectField.find('input').first().val();
				}
				if(subjectField.find('select').length > 0){
					formSubject = subjectField.find('select').first().val();
				}
			}else{
				formSubject = $(this).find('select').first().val();
			}
		}
    $.ajax({
      url : dh_events_script_vars.ajaxurl,
      type : 'post',
      data : {
          action : 'dh_event',
          domain : window.location.host,
          url : window.location.pathname,
          subject: formSubject,
          type: submission_type,
					entrypage:dh_events_script_vars.entrypage,
					email:dh_events_script_vars.email,
					user_agent: dh_events_script_vars.userAgent
        }
	   });
		 //console.log('maybe not here');
  });
});
