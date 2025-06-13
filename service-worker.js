//FOR LATER
//chrome.storage API

//keep track of the id of the dashboard extension tab
let extensionTab = null;

//on first install,update,closing of chrome
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install" || details.reason === "update") {
    //make the dashboard
    openDashboard()
  }
});

//On a specific tab remove ~ so that you always have the dashbaord tab open in chrome
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (extensionTab && tabId === extensionTab) {
    openDashboard()
  }
});


//Worker Helpers

//Opens the extension dashboard html page and records its tab id for later use
function openDashboard(){
  chrome.tabs.create({ url: "dashboard.html", pinned: true, index: 0 }, (tab) => {
        extensionTab = tab.id; //reassign id to new one
      });
}