// different actions based on the message received from background
chrome.tabs.onMessage.addListener(
    function(request, sender, sendResponse) {
        var url = location.href;
        if (request.message === "created_tab" ||
        request.message === "updated_tab") {
            addTab(url);
        } else if (request.message === "activated_tab") {
            chrome.storage.sync.set({"active_tab": url});
        }
    }
);

// if the current active tab is same as the stored active tab, increase time
// from: https://stackoverflow.com/questions/1979583/how-can-i-get-the-url-of-
// the-current-tab-from-a-google-chrome-extension
function updateVars() {
    var url = location.href;
    // if user on the same tab, they've kept surfing it, so add time
    chrome.storage.sync.get("active_tab", (response) => {
        if (url === response.active_tab) {
            // from: https://stackoverflow.com/questions/154059/how-can-i-check-for
            // -an-empty-undefined-null-string-in-javascript
            if (url) { // url cannot be null or undefined
                // url cannot be empty, blank, or contain only white space
                //if (!(url === "") && !(url.trim().length === 0) && !url.trim()) {
                if (!(url === "")) {
                    var website;
                    if ((url.slice(0, 7) === "http://") ||
                    (url.slice(0, 8) === "https://")) {
                        website = url.split("/")[2]; // the url after http or https
                    } else {
                        website = url.split("/")[0]; // the url has no http or https
                    }
                    if (website.length > 0) {
                        increaseTime(website);
                    }
                }
            }
        }
    })
}

// check to update variables every 0.5 seconds = 500 milliseconds
setInterval(() => updateVars(), 500);

// helper functions

// helper function to add website to time_spent
function addWebsite(website) {
    let seen = false;
    chrome.storage.sync.get("time_spent", (response) => {
        var temp_time_spent = response.time_spent;
        for (let i = 0; i < temp_time_spent.length; i++) {
            const curr = temp_time_spent[i];
            if (curr[0] === website) {
                seen = true;
            }
        }
        if (seen === false) {
            const website_pair = [website, 0.0];
            temp_time_spent.push(website_pair);
            chrome.storage.sync.set({"time_spent": temp_time_spent});
        }
    })
}

// function to add tab
function addTab(str1) {
    // from: https://stackoverflow.com/questions/154059/how-can-i-check-for-
    // an-empty-undefined-null-string-in-javascript
    if (str1) { // string cannot be null or undefined
        // string cannot be empty, blank, or contain only white space
        //if (!(url === "") && !(url.trim().length === 0) && !url.trim()) {
        if (!(url === "")) {
            var website;
            if ((str1.slice(0, 7) === "http://") ||
                (str1.slice(0, 8) === "https://")) {
                website = str1.split("/")[2]; // the url after http or https
            } else {
                website = str1.split("/")[0]; // the url has no http or https
            }
            if (website.length > 0) {
                addWebsite(website);
            }
        }
    }
}

// helper function to updateVars
function increaseTime(website) {
    chrome.storage.sync.get("time_spent", (response) => {
        var temp_time_spent = response.time_spent;
        for (let i = 0; i < temp_time_spent.length; i++) {
            const curr = temp_time_spent[i];
            if (curr[0] === website) {
                const value = curr[1] + 0.5;
                temp_time_spent[i] = [website, value];
            }
        }
        chrome.storage.sync.set({"time_spent": temp_time_spent});
    })
}
