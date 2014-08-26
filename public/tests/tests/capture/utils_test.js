$(document).ready(function(){


	module("CaptureUtils.js", {
		setup: function() {

		},
		teardown: function() {

		}
	});

    test("isJQuery results correct result", function() {
        $jQueryObj = $('html');
        domObj = $jQueryObj.get(0);

        ok(CaptureUtils.isJQuery($jQueryObj), 'Is jQuery object');
        ok(!(CaptureUtils.isJQuery(domObj)), 'Is not jQuery object');
    });

	test("The tag name of the cloned element is the same as the original", function() {
		var cloned = CaptureUtils.clone($('html').get(0));

		equals(cloned.tagName.toLowerCase(), 'html', 'Tag name must remain the same');
	});

	test("The cloned content of a random element is the same as the original", function() {
		var $original = $('<div id="test_div"><p>Test content</p></div>');
		var cloned = CaptureUtils.clone($original.get(0));

		equals($(cloned).html().toLowerCase(), $original.html().toLowerCase(), 'Contents are the same');
	});

	test("The cloned content of a 'html' element is the same as the original", 1, function() {
		var $original = $('html');
		var $cloned = $(CaptureUtils.clone($original.get(0)));

		var silent = true; // For debugging purposes you may want to turn silent to false

		clonedDomEqual($cloned.html(), $original.html(), 'Contents are the same', silent);
	});
	
	test("clone()", 1, function() {
	    var cloned = CaptureUtils.clone($('#pre-clone-test').get(0)).innerHTML;
	    	    
	    equals(cloned.indexOf('<script'), -1, 'should pre elements should contain unencoded <script>');
	})

	test("Replaces relative CSS rules", function() {
		var rule = "background-image: url(/assets/image.png) !important;";

		var currentLocation = "https://myservice.com/mypath/page.html";

		equals(CaptureUtils.replaceRelativeUrlsFromCSSRule(rule, currentLocation), "background-image: url(https://myservice.com/assets/image.png) !important;", "Relative CSS url changed");
	});

	test("Replace all the relative URLs from CSS rules", function() {
		var currentLocation = "https://myservice.com/mypath/page.html";
		var rule = "background-image: url(/assets/image.png) !important; background-image: url('assets/image.png'); background-image: url(\"assets/image.png\");";
		var expected = "background-image: url(https://myservice.com/assets/image.png) !important; background-image: url('https://myservice.com/mypath/assets/image.png'); background-image: url(\"https://myservice.com/mypath/assets/image.png\");";

		equals(CaptureUtils.replaceRelativeUrlsFromCSSRule(rule, currentLocation), expected, "Relative CSS url changed");

	});
	
    test('imageURLToBase64()', function() {
        if(ImageCapturer.isCanvasSupported() === false){
			ok(true, 'Canvas not supported, skipping');
			start();
			return;
		}
		
		/* Test only the image loading part. Encoding is tested in the next test case */
        expect(4);
        
        stop();
        stop();
        
        var existingImage = new URL("tests/resources/red_dot.png");
		CaptureUtils.imageURLToBase64(existingImage, function(data, url) {
		    notEqual(null, data, 'Data should not be null');
		    equal(existingImage, url, 'URL should remain the same');
		    
		    start();
		});
		
		var notExistingImage = new URL("tests/resources/red_dot-not-existing.png");
		CaptureUtils.imageURLToBase64(notExistingImage, function(data, url) {
		    equal(null, data, 'Data should be null if image does not exist');
		    equal(notExistingImage, url, 'URL should remain the same');
		    
		    start();
		});
    });

	test("Encode IMG to data URI", function() {
		if(ImageCapturer.isCanvasSupported() === false){
			ok(true, 'Canvas not supported, skipping');
			return;
		}
		
		// This is hard to test since each browser seem to have a bit
		// different canvas implementation.
		// Resutl1 matches to Chrome and Safari (WebKit)
		// Result2 matches to Firefox
		var result1 = "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAG0lEQVQIW2NkAIL/YAQBjEDEiCwAlyBeEJuZAE0nCgCf3xSJAAAAAElFTkSuQmCC";
		var result2 = "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQImWNgYGBg+M/A8B+GGdAF4BLEC2IzEwCVRCnXHdHSggAAAABJRU5ErkJggg==";

		var actual = CaptureUtils.imgToBase64($('#red_dot').get(0));
		console.log(actual)
		ok(actual === result1 || actual === result2, 'Converted image to base64');
	});

	test("Data encoder encodes also JPGs", function() {
		if(ImageCapturer.isCanvasSupported() === false){
			ok(true, 'Canvas not supported, skipping');
			return;
		}
		
		// This is hard to test since each browser seem to have a bit
		// different canvas implementation thus the result string varies. 
		// Anyhow, they should start with the 'expected' value
		
		var expected = "iVBORw0KGgoAAAANSUh"; // This is only the beginning of the string
		var actual = CaptureUtils.imgToBase64($('#flower').get(0));

		ok(actual.startsWith(expected), 'Converted JPG image to base64');
	});

	test("replaceRelativeUrlsFromImgs()", function(){
		// Helper method
		// http://yelotofu.com/2008/08/jquery-outerhtml/
		var outerHTML = function($element) {
			return jQuery("<p>").append($element.eq(0).clone()).html().toLowerCase();
		}

		var currentLocation = 'https://myservice.com:8080/assets/'

		// Relative
		var relativeUrlImg = $('<img src="img/picture.jpg">');
		// There are slight differences between browsers. If the browser return absolute URL there is no need
		// to replace it anymore. In those cases, skip the test
		if(URL.isAbsolute(relativeUrlImg.attr('src'))) {
		    ok(true, "Browser returns absolute src. No need to replace. Skipping this test");
	    } else {
		    CaptureUtils.replaceRelativeUrlFromImg(relativeUrlImg, currentLocation);
		    equals(outerHTML(relativeUrlImg), '<img src="https://myservice.com:8080/assets/img/picture.jpg">', 'Replace ok');
        }

		// Relative with slash
		var relativeUrlWithSlashImg = $('<img src="/img/picture.jpg">');
		
		if(URL.isAbsolute(relativeUrlWithSlashImg.attr('src'))) {
		    ok(true, "Browser returns absolute src. No need to replace. Skipping this test");
	    } else {
		    CaptureUtils.replaceRelativeUrlFromImg(relativeUrlWithSlashImg, currentLocation);
		    equals(outerHTML(relativeUrlWithSlashImg), '<img src="https://myservice.com:8080/img/picture.jpg">', 'Replace ok');
        }

		// Absolute url
		var absoluteUrlImg = $('<img src="https://myservice.com:8080/assets/img/picture.jpg">');
		CaptureUtils.replaceRelativeUrlFromImg(absoluteUrlImg, currentLocation);

		equals(outerHTML(absoluteUrlImg), '<img src="https://myservice.com:8080/assets/img/picture.jpg">', 'Left untouch');

	});

	test("parseURLsFromCSSContent(css)", function() {
		expect(4);
		var css = "background-image: url(\"https://image1.png\"); background-image: url(\'https://image2.png\'); background-image: url(https://image3.png)";

		var urlList = CaptureUtils.parseURLsFromCSSContent(css);

		equals(urlList.length, 3, 'Length');
		equals(urlList[0], "https://image1.png", 'Image1');
		equals(urlList[1], "https://image2.png", 'Image2');
		equals(urlList[2], "https://image3.png", 'Image3');
	});

});
