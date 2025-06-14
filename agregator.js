console.log("on");

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
      promises.push(p)
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
    "width: 16; height: 16px; position:center; margin-right: 3px;";
  listItem.appendChild(favicon);
  link.text = title;
  link.href = url;
  listItem.appendChild(link);
  return listItem;
}

//TODO: all DOM logic should start here after all data gathered
function populateCoral() {
  let curGroup = -2;
  let sawGroup = false;
  let ulist = document.createElement("ul");

  orderedEntries.forEach((tab) => {
    if (tab.groupId === -1) {
      ulist.append(createTabListEntry(tab.favicon, tab.title, tab.url));
    } else if (tab.groupId != curGroup) {
      if (!sawGroup) {
        sawGroup = true;
        //make title by coloring and title
        let h2 = document.createElement("h2");
        h2.textContent = groupInfo.get(tab.groupId).title;
        h2.style = `color: ${
          groupInfo.get(tab.groupId).color
        }; underline: true;`;
        ulist.appendChild(h2);
      }
    }
  });
  mainWindow.appendChild(ulist);
}

/* 
//TODO: SEPERATE INTO ITS OWN FUNCTION - ONLY GATHER THE TABS AND GROUPS HERE
    //DOM manips to create a list of groups
    let ulist = document.createElement("ul"); //CLEAN
    let curGroupId = -2
    let curGroupList = document.createElement("ul")
    // 1 to n cuz first tab will be the newly opened dashboard html 
    for (let i = 1; i < tabs.length; i++){
        if (tabs[i].groupId === -1){
            ulist.append(createTabListEntry(tabs[i].favIconUrl,tabs[i].title,tabs[i].url)) //CLEAN
        }
        else if (tabs[i].groupId !== curGroupId){
            let g = document.createElement("p").text = "New group"
            curGroupId = tabs[i].groupId
            ulist.append(g)
            ulist.append(createTabListEntry(tabs[i].favIconUrl,tabs[i].title,tabs[i].url))
        }
        else {
            ulist.append(createTabListEntry(tabs[i].favIconUrl,tabs[i].title,tabs[i].url))
        }
        //ulist.append(createTabListEntry(tabs[i].favIconUrl,tabs[i].title,tabs[i].url)) //CLEAN
        //start an unordered list object
        //
        //want to know if it belongs to a group isGrouped, groupNumber
        //groupcolor, group name
        //want title, faviconUrl, url, index possibly
        // console.log(tabs[i].url)
    }
    
    mainWindow.appendChild(ulist) //CLEAN

*/
