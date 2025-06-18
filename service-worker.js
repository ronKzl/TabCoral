//FOR LATER
//chrome.storage API

//keep track of the id of the dashboard extension tab
let extensionTab = null;

//on first install,update,closing of chrome
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install" || details.reason === "update") {
    //make the dashboard
    openDashboard();
  }
});

//On a specific tab remove ~ so that you always have the dashbaord tab open in chrome
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (extensionTab && tabId === extensionTab) {
    openDashboard();
  }
});

//Worker Helpers

//Opens the extension dashboard html page and records its tab id for later use
function openDashboard() {
  chrome.tabs.create(
    { url: "dashboard-ui/dashboard/dist/index.html", pinned: true, index: 0 },
    (tab) => {
      extensionTab = tab.id; //reassign id to new one
    }
  );
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openSidePanel",
    title: "Open side panel",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openSidePanel") {
    // This will open the panel in all the pages on the current window.
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "SAVE_ALL") {
    chrome.storage.local.get("workflows").then((store) => {
      const all = store.workflows || [];
      const existingIndex = all.findIndex((w) => w.id === msg.data.id);

      if (existingIndex !== -1) {
        // Overwrite the existing one
        all[existingIndex] = msg.data;
      } else {
        // Otherwise, push it as new
        all.push(msg.data);
      }
      //all.push({ id: Date.now(), data: msg.data });
      return chrome.storage.local.set({ workflows: all });
    });
  }
});
