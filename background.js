chrome.action.onClicked.addListener(async (tab) => {
  // Inject the script into the page
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["fill.js"]
  });
});
