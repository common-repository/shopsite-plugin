//search for $.tutorial.defaults to see acceptable options
(function( $ ) {
	$.tutorial = function( options ) {
		if (options.placement == 'right') {
			$.extend($.tutorial.defaults.instructionCss, {'text-align':'left', 'height':70} );
		} 

		if (options.placement == 'left') {
			$.extend($.tutorial.defaults.instructionCss, {'text-align':'right', 'height':70, 'width':150} );
		}

		$.tutorial.state = {
			obj: this,
			oldinlinestyle: this.attr('style'),
			settings: $.extend(true, {}, $.tutorial.defaults, options )
		};

		settings = $.tutorial.state.settings;

		if (settings.overlay != false)
			$('body').append('<div id="masking_overlay"></div>');

		/*$.each(settings.css, function ( key, value ) {
			$.tutorial.state.oldcss[key]=value;
		});*/

		this.css(settings.css);
		pathway = settings.pathway;
		if (this.prop('tagName') == 'A') {
			url = this.attr('href');
			if (typeof url !== 'undefined') {
				if (url.indexOf('?') == -1)
					this.attr('href', url + '?tutorial='+pathway);
				else
					this.attr('href', url + '&tutorial='+pathway);
			}
		}

		this.find('a').each(function() {
			url = $(this).attr('href');
			if (typeof url !== 'undefined') {
				if (url.indexOf('?') == -1)
					$(this).attr('href', url + '?tutorial='+pathway);
				else
					$(this).attr('href', url + '&tutorial='+pathway);
			}
		});

		this.after('<input type="hidden" name="tutorial" id="tutorial_pass" value="'+pathway+'">');

		if (settings.instruction !== false) {
			html = '<div id="tutorial">'+settings.instruction;
			if (settings.removeOnClose !== false)
				html += '<div id="tutorial_close">&nbsp;</div>';
			html += '</div>';
			object = $(html);
			if (settings.placement == 'below') {
				ptop = this.offset().top + this.height() + 2 + settings.move.y;
				pleft = this.offset().left + this.width()/2 - settings.instructionCss.width/2 + settings.move.x;;
				if (pleft < 0) pleft = 0;
				if (pleft + settings.instructionCss.width > $( window ).width())
					pleft = $( window ).width() - settings.instructionCss.width;
				$.extend(settings.instructionCss, {top: ptop, left: pleft} );
			}

			if (settings.placement == 'above') {
				pbottom = $(window).height() - this.offset().top + 2 + settings.move.y;
				pleft = this.offset().left + this.width()/2 - settings.instructionCss.width/2 + settings.move.x;
				if (pleft < 0) pleft = 0;
				if (pleft + settings.instructionCss.width > $( window ).width())
					pleft = $( window ).width() - settings.instructionCss.width;
				$.extend(settings.instructionCss, {bottom: pbottom, left: pleft} );
			}

			if (settings.placement == 'right') {
				ptop = this.offset().top + this.height()/2 - settings.instructionCss.height/2 + settings.move.y;
				pleft = this.offset().left + this.width() + 5 + settings.move.x;
				if (ptop < 0)
					ptop = 0;
				$.extend(settings.instructionCss, {top: ptop, left: pleft} );
			}

			if (settings.placement == 'left') {
				ptop = this.offset().top + this.height()/2 - settings.instructionCss.height/2 + settings.move.y;
				pleft = this.offset().left - settings.instructionCss.width - 5 + settings.move.x;
				if (ptop < 0)
					ptop = 0;
				$.extend(settings.instructionCss, {top: ptop, left: pleft} );
			}


			$(object).css(settings.instructionCss);
			//$('#nav_buttons').after(object);
			$('body').prepend(object);
		}

		if (settings.removeOnClick !== false) {
			$('#masking_overlay').one('click', function() { $.tutorial.remove();});
		}

		if (settings.removeOnClose !== false) {
			$('#tutorial_close').bind('click', function() { 
				if (settings.removeOnClose == 'confirm') {
					if (confirm(settings.removeOnCloseConfirmText)) {
						$.tutorial.remove({'reload':true});

					}
				} else {
					$.tutorial.remove({'reload':true});
				}
			});
		}

		return this;
	};

	//overwritable options
	$.tutorial.defaults = {
		instruction: false,
		placement: 'below',
		css: {'z-index':'10001', 'position':'relative'},
		instructionCss: {'text-align': 'center', 'box-sizing':'border-box', 'width':300},
		pathway: 1,
		overlay:true,
		removeOnClick: false,
		move: {'x':0,'y':0},
		removeOnClose: 'confirm', //allowed values are false, true, and confirm
		removeOnCloseConfirmText: 'Are you sure you want to stop the tutorial?'
		//width: 300
	};


	$.tutorial.remove = function( options ) {
		$('#masking_overlay').remove();

		var obj = $.tutorial.state.obj;

		if (typeof $.tutorial.state.oldinlinestyle === 'undefined')
			obj.removeAttr('style');
		else
			obj.attr('style', $.tutorial.state.oldinlinestyle);


		if (obj.prop('tagName') == 'A') {
			url = obj.attr('href');
			if (typeof url !== 'undefined') {
				if (url.search('tutorial=') != -1)
					obj.attr('href', url.substr(0,url.length-('&tutorial='+pathway).length));
			}
		}

		obj.find('a').each(function() {
			url = $(this).attr('href');
			if (typeof url !== 'undefined') {
				if (url.search('tutorial=') != -1)
					$(this).attr('href', url.substr(0,url.length-('&tutorial='+pathway).length));
			}
		});

		$('#tutorial_pass').remove();


		if ($.tutorial.state.instruction !== false) {
			$('#tutorial').remove();
		}

		if (options && options.reload) {
			url = window.location.href;
			if (url.search('tutorial=') != -1)
				window.location.replace(url.substr(0,url.length-('&tutorial='+pathway).length));
		}

	};

	$.fn.tutorial = $.tutorial;
}( jQuery ));