jQuery(document).ready(function($){
	console.log('loaded');
	// need the array of areas already entered into the database
  $('li.master_child').on('click',function(){
    // diable & check / uncheck holder list
		$('li.master_child.active').removeClass('active');
		$(this).addClass('active');
		console.log(typeof disabled_areas);
		
		// if array
		if(disabled_areas){
			$('.area-toggle').prop('checked',false);
			// Does the area exist in the array?
			if($(this).data('postid') in disabled_areas){
				// check all boxes that are set
				var post_id = $(this).data('postid');
				var this_disabled_areas = disabled_areas[post_id];
				//console.log(this_disabled_areas);
				$.each(this_disabled_areas,function(key,value){
				 	$('.area-toggle[data-holder-id="'+value+'"]').prop('checked',true);
				});

			}
		}else{
			// nothing selected yet. Uncheck all boxes
			$('.area-toggle').prop('checked',false);
		}

  });

  $('.area-toggle').on('change',function(){
		console.log('change triggered');
		var post_id = $('.master_child.active').data('postid');
    var holder_id = $(this).data('holder-id');
    var action = $(this).prop('checked');
    // console.log(action);
		// console.log(post_id);
		// console.log(holder_id);
		  // enable code after check
      if(action){
      	// TRUE : Disable area
				update_campaign(post_id,holder_id,'disable');
				if(!disabled_areas){
					disabled_areas = {};
				}
				if(post_id in disabled_areas){
					// key already exists
					disabled_areas[post_id].push(holder_id)
				}else{
					// new
					disabled_areas[post_id] = [holder_id];
				}

      }else{
				//FALSE : Enable Area
       update_campaign(post_id,holder_id,'enable');
			 disabled_areas[post_id].splice( $.inArray(holder_id, disabled_areas[post_id]), 1 );
      }

		//console.log(disabled_areas);
  })


	function update_campaign(post_id,holder_id,action){
			$.ajax({ url: '../wp-content/plugins/dh-localised/admin/campaign-manager.php',
				data: {
					'dhlp_campaign_action': action,
	      	'post_id' : post_id,
	      	'holder_id': holder_id
				},
				type: 'post'
			});
			return false;
	}

})
