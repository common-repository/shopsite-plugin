(function() {
	tinymce.create('tinymce.plugins.shopsite', {
		init : function(ed, url) {
			var disabled = true;

			ed.addCommand('open_shopsite', function() {
				tutorial = '';
				if (window.location.href.search('tutorial=1') != -1){tutorial = '&tutorial=1';}
				ed.windowManager.open({
					url : ss_path+'/shopsite.php?ss_action=insert'+tutorial,
					width  : 830,
					height : 600,
					title : 'Loading... please wait.',
					inline : true,
					onClose : function(){if(tutorial!=''){continue_tutorial();}}
				}, {plugin_url : url});
			});
			// Register button
			ed.addButton('shopsite', {
				title : 'Insert a ShopSite product',
				cmd : 'open_shopsite',
				id : 'shopsite_button',
				image : url+'/ss-20.png'
			});

			ed.onNodeChange.add(function(ed, cm, n, co) {
				disabled = co && n.nodeName != 'A';
			});
		},

		getInfo : function() {
			return {
				longname : 'ShopSite Wordpress plugin',
				author : 'ShopSite',
				authorurl : 'http://shopsite.com',
				infourl : '',
				version : '1.0'
			};
		}
	});

	tinymce.PluginManager.add('shopsite', tinymce.plugins.shopsite);
})();
