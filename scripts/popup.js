const popup = document.getElementById("app");
chrome.storage.sync.get('color', function (resp) {
  const color = resp.color;
  if (color) {
    popup.style.backgroundColor = color;
  }
});

const template = function template(data) {
  const json = JSON.stringify(data);
  return "\n  <div class=\"site-description\">\n    <h3 class=\"title\">" +
      data.title + "</h3>\n    <p class=\"description\">" +
      data.description + "</p>\n    <a href=\"" + data.url +
      "\" target=\"_blank\" class=\"url\">" + data.url +
      "</a>\n  </div>\n  <div class=\"action-container\">\n    <button data-bookmark='" +
      json + "' id=\"save-btn\" class=\"btn btn-primary\">Save</button>\n  </div>\n  ";
};
const renderMessage = function renderMessage(message) {
  const displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = "<p class='message'>" + message + "</p>";
};

const renderBookmark = function renderBookmark(data) {
  const displayContainer = document.getElementById("display-container");
  if (data) {
    displayContainer.innerHTML = template(data);
  } else {
    renderMessage("Probably need to reload this page");
  }
  const time = document.getElementById("time");
  let sec = 0;
  window.setInterval(() => {sec += 1; time.innerHTML = Math.floor(sec / 60).toString() + ((sec/60 - Math.floor(sec / 60))*60).toString()}, 1000);
};

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { action: 'process-page' }, renderBookmark);
});

popup.addEventListener("click", function (e) {
  if (e.target && e.target.matches("#save-btn")) {
    e.preventDefault();
    const data = e.target.getAttribute("data-bookmark");
    chrome.runtime.sendMessage({ action: "perform-save", data: data }, function (response) {
      if (response && response.action === "saved") {
        renderMessage("Your bookmark was saved successfully!");
      } else {
        renderMessage("Sorry, there was an error while saving your bookmark.");
      }
    });
  }
});

const optionsLink = document.querySelector(".js-options");
optionsLink.addEventListener("click", function (e) {
  e.preventDefault();
  chrome.tabs.create({ 'url': chrome.extension.getURL('options.html') });
});
