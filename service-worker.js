// ======================
// Constants & Globals
// ======================
const MAX_PROFILES = 10;
const OUT_OF_BOUNDS = -1;
let extensionTab = null;

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

// ======================
// Initialization
// ======================
chrome.runtime.onInstalled.addListener(() => {
  openDashboard();
  createContextMenus();
});

// Keep dashboard alive
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === extensionTab) openDashboard();
});

// ======================
// Core Functions
// ======================

// Opens the dashboard and stores its tab ID
function openDashboard() {
  chrome.tabs.create(
    { url: "dashboard-ui/dashboard/dist/index.html", pinned: true, index: 0 },
    (tab) => (extensionTab = tab.id)
  );
}

// Creates all context menu items
function createContextMenus() {
  const menuItems = [
    { id: "saveCurProfile", title: "Save Tabs and Groups to Profile" },
    { id: "createNewProfile", title: "Create New Profile" },
  ];
  menuItems.forEach((item) => chrome.contextMenus.create({ ...item, contexts: ["all"] }));
}

// Generic profile creation
async function createProfile(name = "New Profile") {
  const { sessions = [] } = await chrome.storage.local.get("sessions");
  if (sessions.length >= MAX_PROFILES) return { success: false };

  const newProfile = {
    id: crypto.randomUUID(),
    name,
    savedAt: new Date().toISOString(),
    userData: {},
  };
  sessions.push(newProfile);
  await chrome.storage.local.set({ sessions });
  return { success: true };
}

// Collects tab and group data from the current window
async function collectTabData() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const tabGroups = new Map();
  const groupInfo = new Map();
  const orderedEntries = [];

  for (const tab of tabs) {
    if (tab.id === extensionTab || tab.url && tab.url.includes("dist/index.html")) continue; // skip dashboard
    if (!tabGroups.has(tab.groupId)) tabGroups.set(tab.groupId, []);
    tabGroups.get(tab.groupId).push({
      index: tab.index,
      favicon: tab.favIconUrl,
      title: tab.title,
      url: tab.url,
      id: tab.id,
    });
    orderedEntries.push({
      index: tab.index,
      groupId: tab.groupId,
      favicon: tab.favIconUrl,
      title: tab.title,
      url: tab.url,
      id: tab.id,
    });
  }

  for (const groupId of tabGroups.keys()) {
    if (groupId !== OUT_OF_BOUNDS) {
      const group = await chrome.tabGroups.get(groupId);
      groupInfo.set(groupId, {
        title: group.title,
        color: group.color,
        collapsed: group.collapsed,
      });
    }
  }

  return {
    tabGroups: Object.fromEntries(tabGroups),
    groupInfo: Object.fromEntries(groupInfo),
    orderedEntries,
  };
}

// Updates a session with new tab data
async function updateCurrentSession(tabData) {
  const { currentSessionId } = await chrome.storage.local.get("currentSessionId");
  if (!currentSessionId || currentSessionId < 0) {
    console.warn("No active session ID found.");
    return;
  }

  const { sessions = [] } = await chrome.storage.local.get("sessions");
  const idx = sessions.findIndex((w) => w.id === currentSessionId);
  if (idx !== OUT_OF_BOUNDS) {
    sessions[idx].userData = tabData;
    sessions[idx].savedAt = new Date().toISOString();
    await chrome.storage.local.set({ sessions });
  }
}

async function saveCurrentProfile() {
  const tabData = await collectTabData();
  await updateCurrentSession(tabData);
}

// ======================
// Context Menu Handling
// ======================
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const handlers = {
    createNewProfile: async () => await createProfile(),
    saveCurProfile: async () => {
      await saveCurrentProfile()
    },
  };

  if (handlers[info.menuItemId]) await handlers[info.menuItemId]();
});

// ======================
// Message Handling
// ======================
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const actions = {
    SAVE_ALL: async () => {
      await saveCurrentProfile();
    },
    CREATE_NEW_PROFILE: async () => {
      const result = await createProfile();
      sendResponse(result);
    },
  };

  if (actions[msg.type]) actions[msg.type]();
  return true; // Keep the response channel open for async calls
});

