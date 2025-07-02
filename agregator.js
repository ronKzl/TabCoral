//TODO: srviceworker send function
//TODO: cleanup file
//TODO: improve styling of components/add css or framework file

//metadata
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
const tabGroups = new Map(); // groupIndex, TabInfo - index, fav, url, text
const groupInfo = new Map(); //gorupIndex, GroupInfo - color, title, collapsed
const orderedEntries = [];
let mainWindow = document.getElementById("display");

//TODO: cleanup later when MVP done
//init main save all btn
let header = document.getElementById("header");
header.style.display = "flex";
const btn = document.createElement("button");
btn.textContent = "Save All";
btn.onclick = () => {
  console.log("Comm with the service worker to save all....");
  const safeData = {
    tabGroups: Object.fromEntries(tabGroups),
    groupInfo: Object.fromEntries(groupInfo),
    orderedEntries: orderedEntries,
  };
  chrome.runtime.sendMessage({
    type: "SAVE_ALL",
    data: {
      id: "current",
      savedAt: new Date().toISOString(),
      userData: safeData,
    },
  });
};
btn.style.cursor = "pointer";
header.append(btn);

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
  formGroupInfo().then(() => {
    populateCoral();
  });
  console.log(tabGroups);
  console.log(groupInfo);
});

//create the groupMap with groupInfo
function formGroupInfo() {
  // Create an array to store "wait until done" objects (Promises)
  const promises = [];
  //value, key

  tabGroups.forEach((tabs, groupId) => {
    if (groupId !== -1) {
      const p = new Promise((resolve) => {
        chrome.tabGroups.get(groupId, (group) => {
          groupInfo.set(groupId, {
            title: group.title,
            color: group.color,
            collapsed: group.collapsed,
          });
          resolve();
        });
      });
      promises.push(p);
    }
  });
  return Promise.all(promises);
}

//creates a <li> for a tab with favicon,title and url to add to the main list of tabs
function createTabListEntry(favIconUrl, title, url) {
  let listItem = document.createElement("li");
  let favicon = document.createElement("img");
  let link = document.createElement("a");
  //Favicon
  favicon.src = favIconUrl;
  favicon.style.width = "16px";
  favicon.style.height = "16px";
  favicon.style.position = "center";
  favicon.style.marginRight = "5px";
  favicon.style.verticalAlign = "middle";
  listItem.appendChild(favicon);
  //text
  link.text = title;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.style.textDecoration = "none";
  link.style.color = "black";
  link.href = url;

  listItem.appendChild(link);
  return listItem;
}
//The main creation function that
//TODO: clean this function up, try to seperate and figure out cleaner logic if possible to insert dividers
function populateCoral() {
  let curGroup = -2;
  let sawGroup = false;
  let ulist = document.createElement("ul");
  let comingFromUngroup = false;
  orderedEntries.forEach((tab) => {
    if (tab.groupId === -1) {
      ulist.append(createTabListEntry(tab.favicon, tab.title, tab.url));
      const btn = document.createElement("button");
      btn.textContent = "Save Tab";
      btn.style.cursor = "pointer";
      btn.onclick = () => {
        console.log("Comm with the service worker....");
      };
      ulist.append(btn);
      comingFromUngroup = true;
      //make line
      let line = document.createElement("hr");
      ulist.appendChild(line);
    } else if (tab.groupId != curGroup) {
      if (!comingFromUngroup) {
        //make line
        let line = document.createElement("hr");
        ulist.appendChild(line);
      }
      comingFromUngroup = false;
      if (sawGroup) {
        sawGroup = !sawGroup;
      }
      //first time
      if (!sawGroup) {
        sawGroup = true;
        curGroup = tab.groupId;
        //make header
        let h2 = document.createElement("h2");
        h2.textContent = groupInfo.get(tab.groupId).title;
        h2.style.color = tabColorMap[groupInfo.get(tab.groupId).color];
        h2.style.textDecoration = "underline";

        const btn = document.createElement("button");
        btn.textContent = "Save Group";
        btn.style.cursor = "pointer";
        btn.onclick = () => {
          console.log("Comm with the service worker....");
        };
        btn.style.marginLeft = "15px";
        h2.appendChild(btn);
        ulist.appendChild(h2);
      }
      ulist.append(createTabListEntry(tab.favicon, tab.title, tab.url));
    } else {
      ulist.append(createTabListEntry(tab.favicon, tab.title, tab.url));
    }
  });

  mainWindow.appendChild(ulist);
}

function saveAll() {
  console.log("saving entire session");
}
