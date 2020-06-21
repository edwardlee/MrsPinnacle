// Reset variables if a new day occurs.
// All in background since the current page is never needed.

// initialize variables
function initializeVars() {
    // ordered pairs of website and time
    chrome.storage.sync.set({"time_spent": []});

    const d = Date();
    const d_string = d.toString();
    const d_array = d_string.split(" ");
    chrome.storage.sync.set({"saved_day": Number(d_array[2])}); // save the day
}

// when installed, all variables are initialized
chrome.runtime.onInstalled.addListener(function() {
    initializeVars();
});

// when a new day begins, all variables are initialized
function newDay() {
    const d = Date();
    const d_string = d.toString();
    const d_array = d_string.split(" ");
    const day = Number(d_array[2]);

    chrome.storage.sync.get("saved_day", (response) => {if (day !== response.saved_day) initializeVars()})
}

// check for a new day every minute = 60000 milliseconds
window.setInterval(() => newDay(), 60000);

// Edit time_spent
// Split in background and content since current page is needed.

// send message to content if a new tab with nonempty url is opened
// from: https://thoughtbot.com/blog/how-to-make-a-chrome-extension
// for the communication between background and content javascript files
chrome.tabs.onCreated.addListener(function(tab) {
    // Sent a message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currTab = tabs[0];
        chrome.tabs.sendMessage(currTab.id, {"message": "created_tab"});
    });
});

// send message to content if tab is updated and the url of the tab is nonempty
// from: https://thoughtbot.com/blog/how-to-make-a-chrome-extension
// for the communication between background and content javascript files
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // Sent a message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currTab = tabs[0];
        chrome.tabs.sendMessage(currTab.id, {"message": "updated_tab"});
    });
});

// whenever active tab is changed, edit local active tab variable
// from: https://stackoverflow.com/questions/1979583/how-can-i-get-the-url-of-
// the-current-tab-from-a-google-chrome-extension
chrome.tabs.onActivated.addListener(function(activeInfo) {
    // Sent a message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currTab = tabs[0];
        chrome.tabs.sendMessage(currTab.id, {"message": "activated_tab"});
    });
});
