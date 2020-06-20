const extractTags = function extractTags() {
  const url = document.location.href;
  if (!url || !url.match(/^http/)) return;

  const data = {
    title: "",
    description: "",
    url: document.location.href
  };

  const ogTitle = document.querySelector("meta[property='og:title']");
  if (ogTitle) {
    data.title = ogTitle.getAttribute("content");
  } else {
    data.title = document.title;
  }

  const descriptionTag = document.querySelector("meta[property='og:description']") || document.querySelector("meta[name='description']");
  if (descriptionTag) {
    data.description = descriptionTag.getAttribute("content");
  }

  return data;
};

function onRequest(request, sender, sendResponse) {
  if (request.action === 'process-page') {
    return sendResponse(extractTags());
  }
}

chrome.extension.onMessage.addListener(onRequest);
