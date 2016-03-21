// This helps avoid conflicts in case we inject 
// this script on the same page multiple times
// without reloading.
var injected = injected || (function(){

	// An object that will contain the "methods"
	// we can use from our event script.
	var methods = {};
	var template = "";

	// This method is to initialize the app
	methods.checkAppActive = function(){
		if(!document.getElementById("specsApp")) {
			return false;
		}
		return true;
	};
	
	methods.init = function(){
		if(!this.checkAppActive()) {
			var div = document.createElement("div");
			//div.innerHTML = "<p>test<p>";

			// load the html file
			var html = "";
			div.innerHTML = html;
			div.id = "specsApp";
			document.getElementsByTagName('body')[0].appendChild(div);

			return true;
		} else {
			document.getElementById('specsApp').remove();
			return false;
		}
	};
	
	methods.setTemplate = function(html){
		document.getElementById("specsApp").innerHTML = html;
		return html;
	};
	
	methods.disableApp = function(){
		document.getElementById("specsApp").remove();
		return "disabled";
	};

	methods.getDOMNodes = function(){
		var nodes = document.querySelectorAll('*');
		return nodes.length;
	};

	// This tells the script to listen for
	// messages from our extension.
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		var data = {};
		var options = '';
		if(request.options) {
			options = request.options;
		}
		// If the method the extension has requested
		// exists, call it and assign its response
		// to data.
		if (methods.hasOwnProperty(request.method))
			data = methods[request.method](options);
		// Send the response back to our extension.
		sendResponse({ data: data });
		return true;
	});

	return true;
})();

// Modify the elements
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}