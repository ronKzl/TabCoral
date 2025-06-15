//TODO: map with colors defined by google that translate that pop better and match
//TODO: srviceworker send function
//TODO: cleanup file

//metadata
const tabGroups = new Map(); // groupIndex, TabInfo - index, fav, url, text
const groupInfo = new Map(); //gorupIndex, GroupInfo - color, title, collapsed
const orderedEntries = [];
let mainWindow = document.getElementById("display");


chrome.tabs.query({ currentWindow: true }, (tabs) => {
  console.log(tabs);
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
    });
    //save the order as well
    orderedEntries.push({
      index: tab.index,
      groupId: tab.groupId,
      favicon: tab.favIconUrl,
      title: tab.title,
      url: tab.url,
    });
  });
  formGroupInfo().then(() => {
    populateCoral();
  });
  console.log(tabGroups);
  console.log(groupInfo);
  //   populateCoral();
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

  favicon.src = favIconUrl;
  favicon.style =
    "width: 16; height: 16px; position:center; margin-right: 5px; vertical-align:middle";
  listItem.appendChild(favicon);
  link.text = title;
  link.style = "offset: -200px;"
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
        h2.style = `color: ${
          groupInfo.get(tab.groupId).color
        }; text-decoration: underline;`;

        const btn = document.createElement("button");
        btn.textContent = "Save Group";
        btn.onclick = () => {
          console.log("Comm with the service worker....");
        };
        btn.style = "margin-left:15px;";
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
  console.log("saving entire workflow");
}
