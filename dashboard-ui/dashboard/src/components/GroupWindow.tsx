import Box from "@mui/material/Box";
import { useAppSelector } from "../hooks";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TabCard from "./TabCard";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { type PopUpState } from "../App";
import AlertDialog from "./Actions/AlertBox";
import { type tab, type sessions, type group, type session } from "../interfaces/session";
import { useSelector } from 'react-redux';

interface GroupWindowProps {
    setPopUpOpen: React.Dispatch<React.SetStateAction<PopUpState>>;
}

const tabColorMap: Record<string, string> = {
    grey: "#5f6368",
    blue: "#1a73e8",
    cyan: "#007b83",
    green: "#188038",
    orange: "#fa903e",
    pink: "#d01884",
    purple: "#a142f4",
    red: "#d93025",
    yellow: "#f9ab00",
  };


function GroupWindow({setPopUpOpen}: GroupWindowProps) {
  
  const sessions = useSelector((state: sessions) => state.sessions)
  const selectedIndex = useAppSelector((state) => state.profile.selectedIndex)
  
  const [selectedGroupId, setSelectedGroupId] = useState('-2') 
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); 
  const [alertDialogState, setalertDialogState] = useState({isOpen:false,text:""});

  console.log("GroupWindow mount");
  console.log("sesh group index")
  console.log(selectedIndex)
  if (selectedIndex < 0 || selectedIndex >= sessions.length ) return <div>No profile selected.</div> //TODO: style here

  // const tabs = useSessionSelector(
  //   (state) => state.sessions[selectedIndex]?.userData.tabGroups ?? {}
  // );
  const tabs = sessions[selectedIndex].userData.tabGroups ?? {} as session
  
  // const groupInfo = useSessionSelector(
  //   (state) => state.sessions[selectedIndex]?.userData.groupInfo ?? {}
  // ) as Record<string, group>;
  const groupInfo = sessions[selectedIndex].userData.groupInfo ?? {} as Record<string, group>;
  console.log(tabs)
  console.log(groupInfo)
  const open = Boolean(anchorEl);
  
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id:string) => {
    setSelectedGroupId(id)
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAlertBoxClose = () => {
    setalertDialogState({isOpen:false, text:""})
    setPopUpOpen({
      open: true,
      duration: 3000,
      message: "Group Remove Operation Cancelled.",
      status: "warning",
      variant: "standard",
    });
  }
  
  async function handleGroupOpen() {
    //open the tabs that belonged in this group
    let groupTabIds = await Promise.all(tabs[selectedGroupId].map(async (tab) => {
      console.log(tab.id)
      let newTab = await chrome.tabs.create({active: false, index: tab.index, url: tab.url})
      return newTab.id}))
    
    //filter on to get out undefined ids
    let cleanIds: number[] = groupTabIds.filter((id) => {
      return id !== undefined
    })
    let newGroupId = await chrome.tabs.group({tabIds: cleanIds}) 
    //now that group is avaiable can style it
    chrome.tabGroups.update(newGroupId, {collapsed: groupInfo[selectedGroupId].collapsed,
      color: groupInfo[selectedGroupId].color,
      title: groupInfo[selectedGroupId].title
    });
    
    //update the groupId and newTabs id in the database OR lazy way call aggreagator.js to scrape again somehow? just that group and update it?
    //or no need? -> currently functionality works as intended
    
    //close the dropdown
    handleClose();
  }

  
  async function handleGroupRemovalFromSession() {
    setalertDialogState({isOpen:false, text:""})
    console.log(`Will now remove session and tabs associated with ${selectedGroupId}`)
    let success = false
    
    //first get the state from the DB
    let sessions_db = await chrome.storage.local.get("sessions");

    if (selectedIndex >= 0 && sessions_db.sessions[selectedIndex] != undefined) {
      let currentSession = sessions_db.sessions[selectedIndex]
      
      //We can then get all the tab Ids from tabGroups from the tabs
      let groupTabsRemove = Object.entries(tabs).find(([id, _]) => id === selectedGroupId)?.[1]
      console.log(groupTabsRemove) 
      let tabIds = groupTabsRemove?.map((t: tab) => t.id)
      console.log(tabIds) 
      //Filter the ordered Entities based on the ids to not have them
      if (tabIds != undefined  && tabIds.length != 0){
          console.log("Tab Removal is happening here!")
          let orderedEntries = currentSession.userData.orderedEntries
          console.log(orderedEntries)
          console.log(orderedEntries.length)
          let newOrderedEntries = orderedEntries.filter((t: tab) => !(tabIds.includes(t.id)))
          console.log(newOrderedEntries)
          console.log(newOrderedEntries.length)
          currentSession.userData.orderedEntries = newOrderedEntries
      }

      // Then we want to filter out the tabGroups such that it does not have that group anymore
      let newGroupInfo = Object.fromEntries(Object.entries(tabs).filter(([id, _]) => id != selectedGroupId))
      console.log("Removed the group and its tabs from tabGroups:")
      console.log(newGroupInfo)
      currentSession.userData.tabGroups = newGroupInfo
      //And if the group is not -1 we want to filter out groupInfo so that it does not have any info on that group
      if (selectedGroupId != '-1'){
        console.log("Trying to delete it from the cosmetic group")
        console.log(groupInfo)
        console.log(groupInfo[selectedGroupId])
        const modifiedGroupInfo = {... groupInfo} //copy first to mutate
        delete modifiedGroupInfo[selectedGroupId]
        currentSession.userData.groupInfo = modifiedGroupInfo
      }
      //Set state for the selectedGroupId to be something else
      setSelectedGroupId('-2')
      //Attempt to save the new modified state to the db
      console.log("New db before saving!");
      console.log(currentSession)
      console.log("All updated sessions before saving!");
      sessions_db.sessions[selectedIndex] = currentSession
      console.log("attempting to save");                                                 
      let res = await chrome.storage.local.set({ sessions: sessions_db.sessions  });
      console.log(res);
      success = true
    }
    
    if (success){
      setPopUpOpen({
        open: true,
        duration: 5000,
        message: "Group & Tabs succesfully removed from current session!",
        status: "success",
        variant: "filled",
      });
    }else {
      setPopUpOpen({
        open: true,
        duration: 8000,
        message:
          "Error: Current group was not found in local storage, attempt to reload the page and try again.",
        status: "error",
        variant: "filled",
      });
    }
    
  }

  const openGroupDeletionDialog = () => {
    //set state for the dialog
    let groupName = groupInfo[selectedGroupId]?.title ?? "Ungrouped"
    setalertDialogState({isOpen:true, text:`Remove ${groupName} from your current saved groups for this session?\n`})
    handleClose();
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {Object.entries(tabs).map(([id, tabs]) => (
        <Accordion key={id} sx={{ width: "100%" }}>
          <AccordionSummary
            sx={{ "& .MuiAccordionSummary-content": { alignItems: "center" } }}
            expandIcon={<ExpandMoreIcon />}
          >
            <Box sx={{
              color: `${tabColorMap[groupInfo[id]?.color] ?? "black"}`,
              fontSize: "1.25rem"
            }}>
             {id}  {" "}   
              {groupInfo[id]?.title ?? "Ungrouped"} ({tabs.length})
            </Box>
            <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
              <IconButton size="small" onClick={(e) => {handleMenuOpen(e, id); e.stopPropagation();}}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                  list: {
                    "aria-labelledby": "basic-button",
                  },
                }}
              >
                <MenuItem onClick={(e) => {handleGroupOpen(), e.stopPropagation();}}> <FolderOpenIcon /> Open Group</MenuItem>
                <MenuItem key={id} onClick={(e) => {openGroupDeletionDialog(), e.stopPropagation();}}> <DeleteIcon /> Remove From Profile </MenuItem>
              </Menu>
            </Box>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              background: `${tabColorMap[groupInfo[id]?.color] ?? "white"}`,
            }}
          >
            {tabs?.map((tab) => (
              <Box key={tab.index}>
                <TabCard id = {tab.id} favicon= {tab.favicon}  url={tab.url} title={tab.title} index={tab.index} setPopUpOpen ={setPopUpOpen}></TabCard>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
      <AlertDialog
                open={alertDialogState.isOpen}
                close={() => handleAlertBoxClose()}
                title={alertDialogState.text}
                content={"This operation will remove the current group and its associated tabs from the session and can't be undone."}
                onAgreeClick={() => {
                 handleGroupRemovalFromSession()
                }}
              />
    </Box>
  );
}

export default GroupWindow;
