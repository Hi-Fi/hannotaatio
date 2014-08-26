$(document).ready(function(){

	module('ImageCapturer', {
		setup: function() {
			// Setup
		},
		teardown: function() {
			// Tear down
		}
	});

	test('containsJPEGs()', 5, function() {
		var prefs = new Preferences();

		var urls = [new URL("http://futurice.com/image.png")];
		var imageCapturer = new ImageCapturer(prefs, urls);
		equals(imageCapturer.containsJPEGs(urls), false, 'should return false for .png images');

		var urls2 = [new URL("http://futurice.com/image.jpg")];
		var imageCapturer2 = new ImageCapturer(prefs, urls2);
		equals(imageCapturer2.containsJPEGs(urls2), true, 'should return true for .jpg images');

		var urls3 = [new URL("http://futurice.com/image.jpeg")];
		var imageCapturer3 = new ImageCapturer(prefs, urls3);
		equals(imageCapturer3.containsJPEGs(urls3), true, 'should return true for .jpeg images');

		var urls4 = [new URL("http://futurice.com/image.JPG")];
		var imageCapturer4 = new ImageCapturer(prefs, urls4);
		equals(imageCapturer4.containsJPEGs(urls4), true, 'should be case-insensitive');
		
		var urls5 = [
		    new URL("http://futurice.com/image.png"),
		    new URL("http://futurice.com/image.gif"),
		    new URL("http://futurice.com/image.jpg"),
		    new URL("http://futurice.com/image.png")];
		var imageCapturer5 = new ImageCapturer(prefs, urls5);
		equals(imageCapturer5.containsJPEGs(urls5), true, 'should return true even if there is only jpg');
    });

	test('selectCapturingMethod()', 6, function() {
		var prefs = new Preferences();

		var imageCapturer = new ImageCapturer(prefs, []);
		var flash, canvas, jpg;

		jpg = true; canvas = false; flash = true;
		equals(imageCapturer.selectCapturingMethod(jpg, canvas, flash), ImageCapturer.Method.FLASH);

		jpg = true; canvas = false; flash = false;
		equals(imageCapturer.selectCapturingMethod(jpg, canvas, flash), ImageCapturer.Method.NONE);

		jpg = true; canvas = true; flash = false;
		equals(imageCapturer.selectCapturingMethod(jpg, canvas, flash), ImageCapturer.Method.CANVAS);

		jpg = false; canvas = true; flash = true;
		equals(imageCapturer.selectCapturingMethod(jpg, canvas, flash), ImageCapturer.Method.CANVAS);

		jpg = false; canvas = false; flash = true;
		equals(imageCapturer.selectCapturingMethod(jpg, canvas, flash), ImageCapturer.Method.FLASH);

		jpg = false; canvas = false; flash = false;
		equals(imageCapturer.selectCapturingMethod(jpg, canvas, flash), ImageCapturer.Method.NONE);
	});

	asyncTest('capture() with canvas', function() {
		
		if(ImageCapturer.isCanvasSupported() === false){
			ok(true, 'Canvas not supported, skipping');
			start();
			return;
		}
		
		expect(13);

		var prefs = new Preferences();

		var capturer = new Capturer($('html'));
		capturer.captureStylesheets();

		var imageCapturer = new ImageCapturer(prefs, capturer.getUniqueImageURLs(), function() {
			this.capturingMethod = ImageCapturer.Method.CANVAS;
			this.capture(function(images) {

                var length = 0;

                $.each(images, function(index, value){
                    length++;
                    // These are very simple assertions...
                    notEqual(index, null, 'Index not null');
                    notEqual(value, null, 'Index not null');
                    notEqual(value.newUrl, null, 'Index not null');
                    notEqual(value.data, null, 'Index not null');
                });

                equals(length, 3, 'Length ok');
                
                start();

			});
		});
	});
	
    test('capture() with flash', 13, function() {

        var prefs = {
		    flash_url: '/flash/capture/',
            crossDomainFileAvailable: true
        }

        var capturer = new Capturer($('html'));
        capturer.captureStylesheets();
        
        stop();

        var imageCapturer = new ImageCapturer(prefs, capturer.getUniqueImageURLs(), function() {
            this.capture(function(images) {

                var length = 0;

                $.each(images, function(index, value){
                    length++;
                    // These are very simple assertions...
                    notEqual(index, null, 'Index not null');
                    notEqual(value, null, 'Index not null');
                    notEqual(value.newUrl, null, 'Index not null');
                    notEqual(value.data, null, 'Index not null');
                });

                equals(length, 3, 'Length ok');
                
                start();

            }, ImageCapturer.Method.FLASH);
        });
    });

	test('filenameFromPath()', function() {
        var location = "http://futurice.com/tests/resources";

        var relativeUrl = new URL('assets/image.png', location);
        var relativeUrlWithSlash = new URL('/assets/image.png', location);
        var absoluteUrl = new URL('http://futurice.com/tests/resources/assets/image.png', location);

        equals(ImageCapturer.filenameFromPath(relativeUrl), 'assets_image.png');
        equals(ImageCapturer.filenameFromPath(relativeUrlWithSlash), '_assets_image.png');
        equals(ImageCapturer.filenameFromPath(absoluteUrl), '_tests_resources_assets_image.png');

	});
	
	asyncTest('injectFlashEncoder()', 3, function() {
		
		var prefs = {
		    flash_url: '/flash/capture/',
			crossDomainFileAvailable: true
		}
		var imageCapturer = new ImageCapturer(prefs, [], function() {
			
			var id = this.flashContainerId;
			var callback = this.flashLoadedCallback
			
			var callbackFunction = function() {
				ok('Callback function called');
				equals($('#' + id).length, 1, 'Container added to DOM');
    			notEqual(window[callback], null, 'Callback added');
    			
    			start();
			};
			
			// Inject
			this.injectFlashEncoder(callbackFunction);
		})
	});
});
