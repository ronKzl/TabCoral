//keep track of the id of the dashboard extension tab
let extensionTab = null;

const MAX_PROFILES = 10;
const tabColorMap = {
  grey: "#5f6368",
  blue: "#1a73e8",
  red: "#d93025",
  yellow: "#f9ab00",
  green: "#188038",
  pink: "#d01884",
  purple: "#a142f4",
  cyan: "#007b83",
  orange: "#fa903e",
};
const OUT_OF_BOUNDS = -1;

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

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveCurProfile",
    title: "Save tabs and groups to profile.",
    contexts: ["all"],
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "createNewProfile",
    title: "Create new profile.",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openSidePanel") {
    // This will open the panel in all the pages on the current window.
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

chrome.contextMenus.onClicked.addListener((info, _) => {
  if (info.menuItemId === "createNewProfile") {
    chrome.storage.local.get("sessions").then((store) => {
      const allProfiles = store.sessions || [];
      if (allProfiles.length < MAX_PROFILES) {
        let newProfileData = {
          id: crypto.randomUUID(),
          name: "New Profile",
          savedAt: new Date().toISOString(),
          userData: {},
        };
        allProfiles.push(newProfileData);
        chrome.storage.local.set({ sessions: allProfiles });
      }
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, _) => {
  if (info.menuItemId === "saveCurProfile") {
    const tabGroups = new Map(); // groupIndex, TabInfo - index, fav, url, text
    const groupInfo = new Map(); //gorupIndex, GroupInfo - color, title, collapsed
    const orderedEntries = [];
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      //store all the grouped and ungrouped windows
      tabs.forEach((tab) => {
        //skip first tab it will be the extension
        if (tab.index === 0) {
          return;
        }
        //if entry DNE
        if (!tabGroups.has(tab.groupId)) {
          tabGroups.set(tab.groupId, []);
        }
        //set the value
        tabGroups.get(tab.groupId).push({
          index: tab.index,
          favicon: tab.favIconUrl,
          title: tab.title,
          url: tab.url,
          id: tab.id,
        });
        //save the order as well
        orderedEntries.push({
          index: tab.index,
          groupId: tab.groupId,
          favicon: tab.favIconUrl,
          title: tab.title,
          url: tab.url,
          id: tab.id,
        });
      });
      tabGroups.forEach((tabs, groupId) => {
        if (groupId !== OUT_OF_BOUNDS) {
          chrome.tabGroups.get(groupId, (group) => {
            groupInfo.set(groupId, {
              title: group.title,
              color: group.color,
              collapsed: group.collapsed,
            });
          });
        }
      });

      chrome.storage.local
        .get("currentSessionId")
        .then(({ currentSessionId }) => {
          console.log("Selected session id is", currentSessionId);
          if (currentSessionId === undefined || currentSessionId < 0) {
            return; //todo: Some kind of msg
          }

          chrome.storage.local.get("sessions").then((store) => {
            const allProfiles = store.sessions || [];
            const existingIndex = allProfiles.findIndex(
              (w) => w.id === currentSessionId
            );
            if (existingIndex !== OUT_OF_BOUNDS) {
              //update the existing one
              const safeData = {
                tabGroups: Object.fromEntries(tabGroups),
                groupInfo: Object.fromEntries(groupInfo),
                orderedEntries: orderedEntries,
              };
              allProfiles[existingIndex].userData = safeData;
              allProfiles[existingIndex].savedAt = new Date().toISOString();
              return chrome.storage.local.set({ sessions: allProfiles });
            }
          });
        });
    });
  }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "SAVE_ALL") {
    chrome.storage.local.get("sessions").then((store) => {
      const allProfiles = store.sessions || [];
      const existingIndex = allProfiles.findIndex((w) => w.id === msg.data.id);
      if (existingIndex !== OUT_OF_BOUNDS) {
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
          name: "",
          savedAt: new Date().toISOString(),
          userData: {},
        };
        allProfiles.push(newProfileData);
        chrome.storage.local.set({ sessions: allProfiles }).then(() => {
          sendResponse({ success: true });
        });
      }
    });
  }
  return true; //keep channel open for async use
});
