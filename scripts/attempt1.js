let time_spent;
let date;

// initialize variables
function initializeVars() {
    time_spent = []; // ordered pairs of website and time

    var d = Date();
    var d_string = d.toString();
    var d_array = d_string.split(" ");
    var day = Number(d_array[2]);
    localStorage.savedDay = day; // save the day
}

// when installed, all variables are initialized
chrome.runtime.onInstalled.addListener(function() {
    initializeVars();
});

// when a new day begins, all variables are initialized
function newDay() {
    var d = Date();
    var d_string = d.toString();
    var d_array = d_string.split(" ");
    var day = Number(d_array[2]);

    if (day != localStorage.savedDay) {
        initializeVars();
    }
}

// check for a new day every minute = 60000 milliseconds
window.setInterval(() => newDay(), 60000);

// helper function to add website to time_spent
function addWebsite(website) {
    var seen = false;
    for (i = 0; i < time_spent.length; i++) {
        var curr = time_spent[i];
        if (curr[0] === website) {
            seen = true;
        }
    }
    if (seen == false) {
        var website_pair = [website, 0.0];
        time_spent.push(website_pair);
    }
}

// function to add tab
function addTab(str) {
    if (str) { // string cannot be null or undefined
        // string cannot be empty, blank, or contain only white space
        if (!(str === "") && !(str.trim().length === 0) && !str.trim()) {
            var website = str.split("/")[2]; // website after https
            if (website.length > 0) {
                addWebsite(website);
            }
        }
    }
}

// add tab to time_spent if a new tab with nonempty url is opened
// from: https://stackoverflow.com/questions/154059/how-can-i-check-for-
// an-empty-undefined-null-string-in-javascript
chrome.tabs.onCreated.addListener(function(tab) {
    var str = tab.url;
    if (str) { // can't pass null arguments
        addTab(str);
    }
});

// add tab to time_spent if a tab is updated and the url of the tab is nonempty
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    var str = changeInfo.url;
    if (str) { // can't pass null arguments
        addTab(str);
    }
});

// whenever active tab is changed, edit local active tab variable
// from: https://stackoverflow.com/questions/1979583/how-can-i-get-the-url-of-
// the-current-tab-from-a-google-chrome-extension
chrome.tabs.onActivated.addListener(function(activeInfo) {
    var url;
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        url = tabs[0].url;
    });
    localStorage.activeTab = url;
});

// helper function to updateVars
function increaseTime(website) {
    for (i = 0; i < time_spent.length; i++) {
        var curr = time_spent[i];
        if (curr[0] === website) {
            var value = curr[1] + 0.5;
            time_spent[i] = [website, value];
        }
    }
}

// if the current active tab is same as the stored active tab, increase time
// from: https://stackoverflow.com/questions/1979583/how-can-i-get-the-url-of-
// the-current-tab-from-a-google-chrome-extension
function updateVars() {
    var url;
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        url = tabs[0].url;
    });
    if (url === localStorage.activeTab) { // user on the same tab, add time
        // from: https://stackoverflow.com/questions/154059/how-can-i-check-for
        //-an-empty-undefined-null-string-in-javascript
        if (url) { // url cannot be null or undefined
            // url cannot be empty, blank, or contain only white space
            if (!(url === "") && !(url.trim().length === 0) && !str.trim()) {
                var website = str.split("/")[2]; // website after https
                if (website.length > 0) {
                    increaseTime(website);
                }
            }
        }
    };
}

// check for a new day every half second = 500 milliseconds
window.setInterval(() => updateVars(), 500);
