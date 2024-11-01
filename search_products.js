$ = jQuery;
jQuery(function ($) {
	function search_products(string, rems) {
		$('#search_results').html('<div id="please_wait">Loading products... please wait</div>');
		var data = 'ss_action=search_products&search_string=' + string + '&remember_search=' + rems;
		$.ajax({
			async: true,
			data: data,
			url: 'shopsite.php',
			success: 
			function(data) {
				$('#search_results').html(data);
			}
		});
	}

	let ctrl = 0, shift = false, mac = navigator.platform.indexOf('Mac')===0;
	$(document).keydown(function(event){
    //console.log('which:',event.which);
		switch(event.which){
			case 17:
				ctrl = true;break;
			case 91:
      case 93:
				if(mac){ctrl++;}break;
			case 16:
				shift = true;
			case 13:
				if ($('#search_input').length && $('#search_input').is(':focus')) {
					$('#search_button').trigger('click');
				}break;
		}
	});

	$(document).keyup(function(event){
    //console.log('which:',event.which);
		switch(event.which){
			case 17:
				ctrl = false;break;
			case 91:
      case 93:
				if(mac){ctrl--;}break;
			case 16:
				shift = false;
		}
	});


	var last_selected = false;
	$(document).on('click', '.wp_product', function() {
		var count = parseInt($(this).attr('id').substr(11));
		if (!ctrl)
			$('.selected_product').removeClass('selected_product');


		if (shift && last_selected) {
			if (count > last_selected) {
				for (i = last_selected; i <= count; i++) {
					$('#wp_product_'+i).addClass('selected_product');
				}
			} else {
				for (i = count; i <= last_selected; i++) {
					$('#wp_product_'+i).addClass('selected_product');
				}
			}
		} else {
			$(this).toggleClass('selected_product');
			last_selected = count;
		}
	});

	$(document).on('dblclick', '.wp_product', function() {
		$('.selected_product').removeClass('selected_product');
		$(this).addClass('selected_product');
		insert_shortcodes();
	});

	$(document).on('click', '#insert_button', function() {insert_shortcodes();});

	var search_performed = false;

	$('.tab').click(function() {
		if ($(this).hasClass('selected_tab'))
			return;

		$('.selected_tab').removeClass('selected_tab');
		$(this).addClass('selected_tab');

		if ($(this).attr('id') == 'search') {
			$(this).html('').append($('<input type="text" id="search_input" name="search_input">').val(last_search_string)).append($('<div id="search_button">Search</div>'));
			$('#search_input').focus();
		} else {
			$('#tabs #search').html('Search');
			if (search_performed)
				search_products('*', 'true');
			search_performed = false;
		}
	});


	$(document).on('click', '#search_button', function() {
		search_products(encodeURIComponent($('#search_input').val()), 'true');
		search_performed = true;
		last_search_string = $('#search_input').val();
	});


	var last_search_string = '';
	if (ss_remembered_search_string == '*')
		search_products('*', 'true');
	else {
		last_search_string = ss_remembered_search_string;
		$('#search').trigger('click');
		$('#search_button').trigger('click');
	}
});

function insert_shortcodes() {
	var shortcodes = '';
	$('.selected_product').each(function() {
		var shortcode = ('[ss_product id="'+$(this).find('.guid_input').val()+'"');
		var sku = $(this).find('.sku_input').val()
		if (sku.length)
			shortcode += (' sku="'+sku+'"');
		shortcode += ']'+$(this).find('.name_input').val()+'[/ss_product]';

		shortcodes += '<p>'+shortcode+'</p>';
	});

	tinyMCEPopup.execCommand('mceInsertContent', false, shortcodes); 
	tinyMCEPopup.close();
}