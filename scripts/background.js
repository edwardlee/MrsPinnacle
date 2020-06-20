chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "perform-save") {
    console.log("Extension Type: ", "chrome");
    console.log("PERFORM AJAX", request.data);

    sendResponse({ action: "saved" });
  }
});
