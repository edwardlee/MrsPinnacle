const colorSelectors = document.querySelectorAll(".js-radio");

chrome.storage.sync.get('color', function (resp) {
  const color = resp.color;
  let option;
  if (color) {
    option = document.querySelector(".js-radio." + color);
  } else {
    option = colorSelectors[0];
  }

  option.setAttribute("checked", "checked");
});

colorSelectors.forEach(function (el) {
  el.addEventListener("click", function () {
    const value = this.value;
    chrome.storage.sync.set({ color: value }, function () {
      document.body.style.backgroundColor = value;
    });
  });
});
