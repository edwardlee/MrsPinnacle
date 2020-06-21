// different actions based on the message received from background
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var url = location.href;

        if (request.message === "activated_tab") {
            chrome.storage.sync.set({"active_tab": url});
            addTab(url);
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
        if (response.active_tab === url) {
            var website = url;
            increaseTime(website);
        }
    })
}

// check to update variables every half second = 500 milliseconds
window.setInterval(() => updateVars(), 500);

// helper functions

// helper function to add website to time_spent
function addWebsite(website) {
    let seen = false;
    chrome.storage.sync.get({"time_spent":[]}, (response) => {
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
    var str1;
    addWebsite(str1);
}

// helper function to updateVars
function increaseTime(website) {
    chrome.storage.sync.get({"time_spent":[]}, (response) => {
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
