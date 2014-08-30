$(document).ready(function() {
	// Fancybox for the steps
	$("a.step").fancybox({
		'margin'		: '100',
		'titlePosition' : 'over',
		'transitionIn'	: 'elastic'
	});
	
	// Fancybox for the video
	$("a#video").click(function() {
		$.fancybox({
			'padding'		: 0,
			'autoScale'		: false,
			'width'			: '100%',
			'height'		: '100%',
			'margin'		: '100',
			'href'			: this.href.replace(new RegExp("watch\\?v=", "i"), 'v/'),
			'type'			: 'swf',
			'swf'			: {
				'wmode'		: 'transparent',
				'allowfullscreen'	: 'true'
			}
		});
		return false;
	});
		
	function constructApiKeyUrl() {
		return '/api/api_key';
	}
		
	$('#submit').click(function() {
			
		$('#installation-error').hide();
		$('#email-recommended').hide();
		$('#installation').hide();
		$("#installation-loader").show();
			
		var url = constructApiKeyUrl();
		var emailValue = $('#email').val();
		var data;
		if(emailValue.length > 0) {
			data = "api_key[email]=" + emailValue;
		}
			
		$.ajax({
			type: 'POST',
			url: url,
			data: data,
			dataType: 'json',
			success: function(response) {
					
				$("#installation-code").html('' +
'&lt;script type="text/javascript"&gt;\n' + 
'  window._hannotaatioPreferences = {\n'+
'    apiKey: \'' + response.api_key + '\'\n'+
'  }\n'+
'&lt;/script&gt;\n'+
'&lt;script type="text/javascript"&gt;\n'+
'  (function(d, t) {\n'+
'    var h = d.createElement(t), s = d.getElementsByTagName(t)[0];\n'+
'    h.type = "text/javascript"; h.async = 1; h.src = "//hannotaatio.futurice.com/hannotaatio.js";\n'+
'    s.parentNode.insertBefore(h, s);\n'+
'  })(document, \'script\');\n'+
'&lt;/script&gt;\n');
				$('#api-successful').html('Your API key: <strong>' + response.api_key + '</strong><br />The key has been sent to your email if you filled an email address field.');

				copyClipboard('#api-code-clipboard');

				$("#installation-loader").hide();
				$('#installation').show();
			},
			error: function(response) {
				$("#installation-loader").hide();
				$('#installation-error').html(response.responseText).show();
			}
		});
			
		return false;
	});
		
	$('.hover-effect').hover(function(){
		$(this).animate({
			'backgroundColor': 'rgb(255, 255, 255)'
		}, "fast");
	}, function() {
		// Out
		$(this).animate({
			'backgroundColor': 'rgb(245, 245, 245)'
		}, "fast");
	});
		
	$('.clipboard-wrapper').hover(function() {
		$('.clippy-button', this).show();
	}, function() {
		$('.clippy-button', this).hide();
	})
		
	function escapeCode(code) {
		return escape(code
			.replace('&lt;', '<')
			.replace('&gt;', '>')
			.replace('&amp;', '&'));
	}
		
	function copyClipboard(selector) {
		$(selector).each(function() {
			$(this).append(
			'<div class="clippy-button hidden"><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" '+
           	'width="110" '+
           	'height="14" '+
           	'id="clippy"> '+
   			'<param name="movie" value="flash/index/clippy.swf"/> '+
    		'<param name="allowScriptAccess" value="always" /> '+
    		'<param name="quality" value="high" /> '+
    		'<param name="scale" value="noscale" /> '+
    		'<param NAME="FlashVars" value="text=' + escapeCode($(this).children().first().text()) + '"> '+
    		'<param name="bgcolor" value="#FFFFFF"> '+
    		'<embed src="flash/index/clippy.swf" '+
          	'width="110" '+
          	'height="14" '+
           	'name="clippy" '+
           	'quality="high" '+
           	'allowScriptAccess="always" '+
           	'type="application/x-shockwave-flash" '+
           	'pluginspage="http://www.macromedia.com/go/getflashplayer" '+
           	'FlashVars="text=' + escapeCode($(this).children().first().text()) + '" ' +
           	'bgcolor="#FFFFFF"'+
    		'/>'+
    		'</object></div>');
		});
	}
		
	copyClipboard('#install-code-clipboard');
	copyClipboard('#advanced-clipboard');
});