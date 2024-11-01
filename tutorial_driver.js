function start_tutorial() {
	$(window).on('load',function() { 
		$("#menu-settings").parents().css({'z-index':'auto', 'position':'relative'});
		$('#menu-settings').tutorial({'instruction':"Hover over 'Settings' to the left and click on 'ShopSite' from the dropdown menu", 'placement':'right', 'move':{'x':0, 'y':-25}});
		//$(".wp-menu-name:contains('Settings')").tutorial({'instruction':"Hover over 'Settings' to the left and click on 'ShopSite' from the dropdown menu", 'placement':'right'});
	});
}
function continue_tutorial() {
	$('#content_ifr').tutorial({'instruction':'You\'ll see something like [ss_product...] in your blog and when you preview or publish that tag will show your Order Button <br> <a href="#" class="remove_me">Finish tutorial</a>',
		'instructionCss':{'width':400},'placement':'above', 'removeOnClose':false});
	$('.remove_me').one('click', function () {
		$.tutorial.remove();
	});
	/*$('.remove_me').one('click', function () {
		$.tutorial.remove();
		$('#post-preview').tutorial({'instruction':'Click here', 'placement':'left'});
		$('#post-preview').one('click', function () {
			$.tutorial.remove();
			$('#publish').tutorial({'instruction':'Click here to publish your new post. That\'s the end of the tutorial', 'placement':'left', 'instructionCss':{'width':250}, 'removeOnClick':true});
			$('#publish').one('click', function () {
				$.tutorial.remove();
			});
		});
	});*/
}
function five_fields() {
	$('#ss_11_settings').css({'display':'table-row-group'}); 
	$('#ss_12_settings').css({'display':'none'});
	$('#ss_11_settings').parent().tutorial({'instruction':
		"Paste 5 fields from your ShopSite WordPress configuration below."+
		'<p style="text-align:right;color:#cccccc;font-size:8pt;margin:0px;"><a id="ss_12" style="display:inline;color:#cccccc;">Go back</a> to 1-field config</p>', 
		'placement':'above', 'move':{'x':0, 'y':-45}, 'instructionCss':{'width':500, 'text-align':'left', 'padding-left':50},});
	$('#ss_12').one('click', function () {
		$.tutorial.remove();
		one_field();
	});
	var paste_count = 0;
	$('#ss_11_settings input').one('paste', function () {
		paste_count++;
		if (paste_count == 5) {
			$.tutorial.remove();
			$('#test_connection').tutorial({'instruction':'Now click "Test connection" to ensure that the Plugin can communicate with your store', 'placement':'right', 'move':{'x':10, 'y':0}});
		}
	});
}
function one_field() {
	$('#ss_12_settings').css({'display':'table-row-group'}); 
	$('#ss_11_settings').css({'display':'none'});
	$('#config_dump').tutorial({'instruction':
		'In your ShopSite, go to Merchandizing then Social Media then WordPress.<br>'+
		'If there\'s one field there for you to copy and paste, paste it in the space below.<br>'+
		'If there are 5 fields to copy and paste, <a id="ss_11" style="display:inline;">click here</a>.',
		'instructionCss':{'width':700, 'text-align':'left', 'padding-left':50},'placement':'above'});
	$('#ss_11').one('click', function () {
		$.tutorial.remove();
		five_fields();
	});
	$('#config_dump').one('paste', function() { 
		$.tutorial.remove();
		$('#test_connection').tutorial({'instruction':'Now click "Test connection" to ensure that the Plugin can communicate with your store', 'placement':'right', 'move':{'x':10, 'y':0}});
	} );
}
$(window).on('load',function() { 
	var l = window.location.href;
	if (l.search("tutorial=1") != -1) {
		if (l.search("page=shopsite_menu") != -1) {
			var state = $('#state').val();
			if (state == 'new_config') {
				$('#get_shopsite').tutorial({'instruction':
					'This tutorial helps you configure ShopSite plugin. <a id="proceed_tutorial">Click here</a> to continue, or click the link above if you don\'t have a ShopSite store.', 
					'instructionCss':{'width':500},
					'css':{'background-color':'white', 'padding':'0px 5px'}, 'placement':'below', 'move':{'x':0, 'y':0}});
				$('#proceed_tutorial').one('click', function() {
					$.tutorial.remove();
					if ($('#config_type').val() == 'ss_12') {
						one_field();
					} else {
						five_fields();
					}
				});
			} else if (state == 'testing_completed') {
				if ($('#test_bad').length) {
					$('#test_result').tutorial({'instruction':'Connection test failed. Please double-check your settings. If the problem still persists, contact ShopSite.<br><a href="#" class="remove_me">Finish tutorial</a>',
						'placement':'above', 'instructionCss':{'width':400}, 'css':{'background-color':'white', 'padding':'0px 5px'}});
					$('.remove_me').one('click', function () {
						window.location.replace("options-general.php?page=shopsite_menu");
					});
				} else
					$('#save_settings').tutorial({'instruction':'Now Save your Settings', 'instructionCss':{'height':40},'placement':'right', 'move':{'x':10, 'y':0}});
			} else if (state == 'settings_saved') {
				$("#menu-posts").parents().css({'z-index':'auto', 'position':'relative'});
				$('#menu-posts').tutorial({'instruction':"Hover over 'Posts' to the left and click on 'Add New' from the dropdown menu to try out the Plugin", 'instructionCss':{'height':55, 'width':400}, 'move':{'x':0, 'y':-45}, 'placement':'right'});
			}
		} else if (l.search("post-new.php") != -1) {
			//$("#wp-content-editor-tools").css({'z-index':'auto'});
			$("#content-tmce").parents().css({'z-index':'auto'});
			$("#content-tmce").tutorial({'instruction':'Select Visual Display', 'placement':'above'});
			$('#content-tmce').one('click', function() { 
				$.tutorial.remove();
				window.setTimeout(function() {
					el = $(".mce-btn[aria-label*='ShopSite']");
					el.parents().css({'z-index':'auto'});
					el.tutorial({'instruction':'Click this ShopSite Icon to now add a product to your blog', 'placement':'above', 'css':{'background-color':'white'}});
					el.one('click', function() { 
						$.tutorial.remove();
					});
				}, 500);
			});
		} 
		else if (l.search("ss_action=insert") != -1) {
			$('#search_form').tutorial({'instruction':'Enter a product name or "*" and click the Search button', 'placement':'right', 'overlay': false,
				'instructionCss':{'background-color':'#DFDFDF'}, 'css':{'padding':'5px'}, 'removeOnClose':false});
			$('#search_button').bind('click', function () {
				$.tutorial.remove();
				$( document ).ajaxComplete(function() {
					if ($('#no_products').length) {
						$.tutorial.remove();
						$('#search_form').tutorial({'instruction':'No matching products found. Try searching for "*"', 'placement':'right', 'overlay': false,
							'instructionCss':{'background-color':'#DFDFDF'}, 'css':{'padding':'5px'}, 'removeOnClose':false});
					} else {
						$.tutorial.remove();
						$('#product').tutorial({'instruction':'Select a product from the list', 'placement':'left', 'overlay': 1,
							'instructionCss':{'background-color':'#DFDFDF'}, 'removeOnClose':false});
						$('#product').one('change', function() {
							$.tutorial.remove();
							//$(this).attr('selected', true);
							$('#product').val($(this).val());
							$('#insert_product').tutorial({'instruction':'This inserts the product into your blog', 'placement':'left', 'overlay': 1,
								'instructionCss':{'background-color':'#DFDFDF', 'height':60, 'width':200}, 'css':{'background-color':'white', 'padding':'2px'}, 'removeOnClose':false});
							$('#insert_product').one('click', function() {
								//tinyMCE.activeEditor.windowManager.onClose = function() {alert('Bye!');};
								$.tutorial.remove();
								$('#close_popup').tutorial({'instruction':'Click here to close this popup', 'placement':'left', 'overlay': 1,
									'instructionCss':{'background-color':'#DFDFDF', 'height':60}, 'css':{'background-color':'white', 'padding':'2px'}, 'removeOnClose':false});
							});
						});
					}
				});
			});
		}
	}
});