/**
 * Capture the webpage DOM tree.
 * https://www.pivotaltracker.com/story/show/5827718
 *
 * @constructor
 * @param {jQuery} $element The element to capture.
 * @param {Preferences} prefs h2ccapture preferences.
 */
var h2ccapture = function(prefs) {
	this.prefs = prefs || {};
    this.doctype = this.captureDoctype();

    // Fields related to the Annotation metadata
    this.uuid = this.generateUUID();
    this.captureTime = new Date().getTime() / 1000;
};

/**
 * Gerenates UUID-like random id.
 *
 * The code is copy-pasted from Stackoverflow
 * http://stackoverflow.com/
 * questions/105034/how-to-create-a-guid-uuid-in-javascript
 *
 * Comments from stackoverflow:
 * "For an rfc4122 version 4 compliant solution,
 * this one-liner(ish) solution is the most compact
 * I could come up with."
 *
 * @return {String} valid rfc4122 version 4 compliant UUID string.
 */
h2ccapture.prototype.generateUUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
};

/**
 * Remove capture controls (button and status div).
 */
h2ccapture.prototype.removeCaptureControls = function() {
	var H2C_IGNORE = "data-html2canvas-ignore";	
	document.getElementById('hannotaatio-capture').setAttribute(H2C_IGNORE, true);
	document.getElementById('hannotaatio-status').setAttribute(H2C_IGNORE, true);
};

/**
 * Gets the Annotation metadata which is contained in this h2ccapture object. The
 * annotation metadata includes fields such as the UUID of the page, the
 * capturing time and the page dimensions. The metadata is returned as an
 * Object.
 *
 * @return {string} The Annotation metadata of this capture. The data is given
 *         as an Object (JSON).
 */
h2ccapture.prototype.getAnnotationMetadata = function() {
    var annotationData = {
       'annotation': {
           'uuid': this.uuid,
           'site_name': this.prefs.site.name,
           'capture_time': this.captureTime,
           'captured_url': window.location.href,
           'body_width': $(document).width(),
           'body_height': $(document).height()
       }
    };
    return annotationData;
};

/**
 * Captures the DOCTYPE of the document.
 *
 * Returns DOCTYPE as a string or null if unable
 * to capture doctype
 *
 * Check out this stackoverflow for more info:
 * http://stackoverflow.com/questions/1987493/read-doctype-with-javascript
 *
 * @return {string} doctype or null.
 */
h2ccapture.prototype.captureDoctype = function() {
    var doctype = document.doctype;

    if (doctype == null) {
        // No doctype or IE
        var firstChild = document.childNodes[0];

        // IE mis-parses doctype as a Comment element
        var firstChildContent = firstChild.text;

        if (firstChildContent != null &&
                firstChildContent.indexOf('<!DOCTYPE') !== -1) {
            // Is IE and firstChild is doctype element!!
            return firstChildContent;
        } else {
            // No doctype found
            return null;
        }
    }

    var publicId = doctype.publicId;
    var systemId = doctype.systemId;

    if (publicId == null || systemId == null) {
        // No publicId or systemId, no idea why...
        return null;
    }

    if (publicId.length == 0 || systemId.length == 0) {
        // publicId and systemId length 0. Probably HTML5
        return '<!DOCTYPE HTML>';
    }

    var isXHTML = publicId.indexOf('XHTML') !== -1;
    var html = isXHTML ? 'html' : 'HTML';

    var doctype = '<!DOCTYPE ' + html + ' PUBLIC "' + publicId + '" "' +
        systemId + '">';

    return doctype;
};

/**
 * Gets the captured doctype as a string or null
 * if there is no doctype defined
 *
 * @return {string} The doctype string or empty string.
 */
h2ccapture.prototype.getDoctype = function() {
    return this.doctype;
};

/**
 * Gets the captured element's full HTML content as a string.
 *
 * @return {string} The contents of captured element.
 */
h2ccapture.prototype.getHtmlContent = function() {
		return this.htmlContent;
};

/**
 * @return {string} The contents of the element to capture.
 */
h2ccapture.prototype.toString = function() {
    return this.getHtmlContent();
};

// (function(){ /* test coverage for JSCoverage */ })();
