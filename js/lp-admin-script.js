if(jQuery('#original_post_status').val() == 'auto-draft' && jQuery('#post_type').val() == 'landing_page'  && jQuery('#page_template').length != 0){
	//console.log('is landing_page and auto-draft');
	$('#page_template option[value="template-front-page-slider.php"]').prop("selected", true);
}