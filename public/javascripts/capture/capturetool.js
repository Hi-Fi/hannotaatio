
// @URL@

// @CAPTURE_UTILS@

// @PREFERENCES@

// @CAPTURER@

// @UPLOADER@

// @LIB_JSON2@

// @IMAGE_CAPTURER@

// @HTML2CANVAS@

$(document).ready(function($){

    /**
     *
     * @constructor
     * @param {object} prefs The prefences for the site to be annotated.
     */
    // This functionality should be wrapped inside a class
    // That creates the Hannotaatio UI to the screen
    
    var prefs = new Preferences(window._hannotaatioPreferences);
    
    var ui = new CaptureUI(prefs);
    ui.createButton(document.body, function() {
	
        // Notify about ongoing capture
        ui.createDialog(document.body);
        ui.showStatus('<p>Capturing page...</p>', 'LOADER');
        
		var uploader = new Uploader(prefs);
		
		if (prefs.captureTool==="capturer"){
			window.console.log("Using Capturer");
			var capturer = new Capturer($('html'), prefs);
			
			
			setTimeout(function(){
				
				// Strip <script> tags
				capturer.stripScriptTags();
				
				// Remove capture controls
				capturer.removeCaptureControls();
				
				capturer.captureStylesheets(function() {
					capturer.captureImages(function() {
						ui.showStatus('<p style="font-size: 20px">' +
						'Capture successful!</p>' +
						'<p>Redirecting you to the edit page...', 'SUCCESS');
						uploader.uploadForm(capturer);
					});
				});
				
				return false;
			}, 1000);
		};
		
		if (prefs.captureTool==="html2canvas"){
			window.console.log("Using html2canvas");
			var h2c = new h2ccapture(prefs);
			h2c.removeCaptureControls();
			
			setTimeout(function(){				
				html2canvas(document.body, {
					onrendered: function(canvas) {
						h2c.htmlContent = "<html><head></head><body><img src='"+canvas.toDataURL()+"' /></body></html>"

						ui.showStatus('<p style="font-size: 20px">' +
						'Capture successful!</p>' +
						'<p>Redirecting you to the edit page...', 'SUCCESS');
						uploader.uploadForm(h2c);
					}
				});
				return false;
			}, 1000);
		};
		
		
		});
		
});
