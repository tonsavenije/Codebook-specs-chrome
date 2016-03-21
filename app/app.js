var templateHTML = "";

// Execute the inject.js in a tab and call a method,
// passing the result to a callback function.
function injectedMethod (tab, method, callback) {
	chrome.tabs.executeScript(tab.id, { file: 'inject.js' }, function(){
		if(method == 'setTemplate') {
			chrome.tabs.sendMessage(tab.id, { method: method, options: templateHTML }, callback);
		} else {
			chrome.tabs.sendMessage(tab.id, { method: method }, callback);
		}
	});
}

function init (tab) {
	if(!checkAppActive(tab)) {
		
		injectedMethod (tab, 'init', function (response) {
			if(response) {
				setTemplate(tab);
			}
		});
		
	} else {
		log("App is already active");
	}
	return true;
}

//var stylesheet = document.createElement("link");
//stylesheet.setAttribute("rel", "stylesheet");
//stylesheet.setAttribute("href", chrome.extension.getURL("stylesheet.css"));
//document.getElementsByTagName("head")[0].appendChild(stylesheet);

function setTemplate (tab) {
	// This file must be in the app.js
	var req = new XMLHttpRequest();
	var url = getFile("app.html");
	req.open('GET', url, true);
	
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			templateHTML = req.responseText;
			injectedMethod(tab, 'setTemplate', function(response) {
				return response;
			});
		}
	}
	req.send();
}

function checkAppActive (tab) {
	injectedMethod(tab, 'checkAppActive', function (response) {
		return response;
	});
}

function getDOMNodes (tab) {
	// When we get a result back from the getBgColors
	// method, alert the data
	injectedMethod(tab, 'getDOMNodes', function (response) {
		alert('Elements in tab: ' + response.data);
		return true;
	});
}

function getFile(fileName) {
	return chrome.extension.getURL(fileName);
}

// When the browser action is clicked, call the
// getBgColors function.
chrome.browserAction.onClicked.addListener(init);

// Debug functions
function log(message) {
	console.log(message);
}