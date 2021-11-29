//All the cookie setting stuff
function dhSetCookie(cookieName, cookieValue, nDays) {
	var today = new Date();
	var expire = new Date();
	if (nDays==null || nDays==0) nDays=1;
	expire.setTime(today.getTime() + 3600000*24*nDays);
	document.cookie = cookieName+"="+escape(cookieValue)+ ";expires="+expire.toGMTString()+"; path=/";
}
function dhAcceptCookies() {
	dhSetCookie('dhAccCookies', DHcc_vars.version, DHcc_vars.expiry);
	jQuery("#dh-cookie-bar").fadeOut();
}
// The function called by the timer
function dhccCloseNotification() {
		dhAcceptCookies();
}
jQuery(document).ready(function($){
	$('.x_close').on('click', function(){
		dhAcceptCookies();
	});
});
