// different actions based on the message received from background
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var url = location.href;

        if (request.message === "activated_tab") {
            chrome.storage.sync.set({"active_tab": url});
            var temp_time_spent;
            chrome.storage.sync.get({"time_spent":[]}, (response) => {
                temp_time_spent = response.time_spent;
                temp_time_spent.push([website, 0.0]);
            })
            chrome.storage.sync.set({"time_spent": temp_time_spent});
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
