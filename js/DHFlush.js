jQuery(document).ready(function($){

	var listClass = $('input[name="post_type"]').first().val();
	if(listClass == 'landing_page'){
		var topID = $('tr.level-0').first().attr('ID').replace('post-','');
		$('#posts-filter').after('<style>.btn-flush{margin-top:5px; float:right; margin-left:10px;}.btn-flush:hover{cursor:pointer;}</style>');
		$('#posts-filter').before('<button class="" style="margin-top:8px;" data-dh-flush-all data-first-holder-id="'+topID+'">Flush All Top Holder</button>');
		$('#posts-filter').before('<pre id="dh-flush-output-modal" style="display:none; position: absolute;top: -15px;left: -25px;width: 110%;height: 100%;background: rgba(0,0,0,0.6);"><textarea id="dh-flush-output" style="top: 38%;left: 38%;display: block;width: 25%;height: 25%; vertical-align:bottom;background: #fff;position: fixed;box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);border-radius: 5px; padding:10px"></textarea></pre>');
	}


	$('.row-actions').each(function(){
		var tr = $(this).closest('tr');
		//console.log(tr);
		if(!tr.hasClass('level-0') && listClass == 'landing_page'){
			//console.log(tr.attr('id'));
			var p_id = tr.attr('id').replace('post-','');
			//console.log(p_id);
			$(this).after('<button href="#" class="btn-flush" style="display:none;" title="Delete All LP\'s with same title" data-dh-clear-lp data-pid="'+p_id+'">Delete all LP\'s with same title</button> <button href="#" class="btn-flush" style="display:none;" title="Flush through and publish" data-dh-flush data-pid="'+p_id+'">Flush Through Holders and Publish</button>');
		}
	});
	$('div[data-colname="Title"]').on('mouseover',function(){
	});

	$('td[data-colname="Title"]').hover(
		function() {
			var button = $(this).find('button.btn-flush');
			button.show();
		},function() {
			var button = $(this).find('button.btn-flush');
			button.hide();
		}
	);


	$('button[data-dh-clear-lp]').on('click',function(event){
	event.preventDefault();
	$('#dh-flush-output-modal').show();
	var pid = $(this).data('pid');
		$.ajax({ url: '../wp-content/plugins/dh-localised/admin/DHFlush.php',
			data: {action: 'clearpages',post_id: pid},
			type: 'post',
			beforeSend: function(){
				$('#dh-flush-output-modal').show();
				$('#dh-flush-output').append('<p>Starting</p>');
	   	},
			success: function() {
				$('#dh-flush-output').append('<p>done</p>');
				location.reload();
			},
			fail: function(){
				$('#dh-flush-output').append('<p>no post to delete found</p>');
				alert('failed');
			}
		});
		return false;
	});

	var pids = [];

	$('button[data-dh-flush-all]').on('click',function(event){
		event.preventDefault();
		var pid  = $(this).data('first-holder-id');
		$.ajax({
			type: 'GET',
			url: '../wp-content/plugins/dh-localised/admin/DHFlush.php?action=toplevelpages&post_id='+pid,
			data: {},
			contentType: "application/json; charset=utf-8",
      dataType: "json",

			beforeSend: function(){
				$('#dh-flush-output-modal').show();
				$('#dh-flush-output').append('Getting Page IDs...\n');
			},
			success: function(response) {
				$('#dh-flush-output').append('Page ID\'s collected...\n');
				$.each(response, function (i, item) {
					pids.push(item['ID']);
				});
			},
			fail: function(){
				$('#dh-flush-output').append('no Page ID\'s found.</p>');
					alert('failed');
			}
		}).done(function(){
			console.log(pids);
			prep(pids.shift(),1);
		});

		return false;
	});


	$('button[data-dh-flush]').on('click',function(event){
		event.preventDefault();
		var pid = $(this).data('pid');
		prep(pid);
		return false;
	});

	function prep(pid,bulk=0){
		$.ajax({ url: '../wp-content/plugins/dh-localised/admin/DHFlush.php',
			data: {action: 'prep',post_id: pid},
			type: 'post',
			beforeSend: function(){
				$('#dh-flush-output-modal').show();
				$('#dh-flush-output').append('\nStarting Flush of page:'+pid+'\n');
	   	},
			success: function() {
				$('#dh-flush-output').append('Posts Deleted\n');
				create(pid,bulk);
			},
			fail: function(){
				$('#dh-flush-output').append('<p>no other post in holders found</p>');
	//			create(pid);
				alert('failed');
			}
		});
	}
	function create(pid,bulk=0){
		$.ajax({ url: '../wp-content/plugins/dh-localised/admin/DHFlush.php',
			data: {action: 'create',post_id: pid},
			type: 'post',
			beforeSend: function(){
				$('#dh-flush-output').append('Generating MySQL command\n');
	   		},
			success: function() {
				$('#dh-flush-output').append('MySQL Ready!\n');
				importPostsSQL(pid,bulk);
			},
			fail: function(){
				$('#dh-flush-output').append('<p>couldn\'t export data</p>');
			}
		});
	}
	function importPostsSQL(pid,bulk=0){
		$.ajax({ url: '../wp-content/plugins/dh-localised/admin/DHFlush.php',
			data: {action: 'importPosts',post_id: pid},
			type: 'post',
			beforeSend: function(){
				$('#dh-flush-output').append('Creating Pages\n');
	   		},
			success: function(output) {
				$('#dh-flush-output').append('Pages Created Successfully\n');
				importMetaSQL(pid,bulk);

			},
			fail: function(){
				$('#dh-flush-output').append('couldn\'t import data for post: '+pid+'');
			}
		});
	}
	function importMetaSQL(pid,bulk=0){
		$.ajax({ url: '../wp-content/plugins/dh-localised/admin/DHFlush.php',
			data: {action: 'importMeta',post_id: pid},
			type: 'post',
			beforeSend: function(){
				$('#dh-flush-output').append('Importing Meta...\n');
				},
			success: function(output) {
				$('#dh-flush-output').append('Meta Imported...\n');
			},
			fail: function(){
				$('#dh-flush-output').append('<p>couldn\'t import meta data for post: '+pid+'</p>');
			},
			complete: function(){
				if(bulk == 1){
					console.log(pids);
					if(pids.length > 0){
						prep(pids.shift(),1);
					}else{
						$('#dh-flush-output').append('<p>All done, please refresh the page</p>');
						optimize();
					}
				}else{
					$('#dh-flush-output').append('<p>Landing Pages Created Successfully</p>');
					optimize()
				}
			}
		});
	}
	function optimize(){
		$.ajax({ url: '../wp-content/plugins/dh-localised/admin/DHFlush.php',
			data: {action: 'optimize'},
			type: 'post',
			beforeSend: function(){
				$('#dh-flush-output').append('Optimizing DB... this might take a while!\n');
				},
			success: function(output) {
				$('#dh-flush-output').append('Optimized...\n');
			},
			complete: function(){
				location.reload();
			}
		});
	}
//console.log('loaded');
});
