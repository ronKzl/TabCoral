//keep track of the id of the dashboard extension tab
let extensionTab = null;

const MAX_PROFILES = 10;

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
    chrome.storage.local.get("sessions").then((store) => {
      const allProfiles = store.sessions || [];
      const existingIndex = allProfiles.findIndex((w) => w.id === msg.data.id);

      if (existingIndex !== -1) {
        // Overwrite the existing one
        allProfiles[existingIndex] = msg.data;
      }
      return chrome.storage.local.set({ sessions: allProfiles });
    });
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "CREATE_NEW_PROFILE") {
    chrome.storage.local.get("sessions").then((store) => {
      const allProfiles = store.sessions || [];
      if (allProfiles.length >= MAX_PROFILES) {
        sendResponse({ success: false }); //, reason: "max_profiles" } TODO: for later
      } else {
        let newProfileData = {
          id: crypto.randomUUID(),
          savedAt: new Date().toISOString(),
          userData: {},
        };
        //temp_id += 1;
        allProfiles.push(newProfileData);
        chrome.storage.local.set({ sessions: allProfiles }).then(() => {
          sendResponse({ success: true });
        });
      }
    });
  }
  return true; //keep channel open for async use
});
