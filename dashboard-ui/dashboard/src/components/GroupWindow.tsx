import Box from "@mui/material/Box";
import { useSessionSelector } from "../hooks";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TabCard from "./TabCard";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { type group} from "../interfaces/session";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';


function GroupWindow() {
  
  const tabs = useSessionSelector(
    (state) => state.sessions[0]?.userData.tabGroups ?? {}
  );
  const groupInfo = useSessionSelector(
    (state) => state.sessions[0]?.userData.groupInfo ?? {}
  ) as Record<string, group>;
  console.log(groupInfo);
  console.log(tabs)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const [selectedGroupId, setSelectedGroupId] = useState(-1)

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id:string) => {
    setSelectedGroupId(parseInt(id))
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
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
    
    //close dialog
    handleClose();
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
            }}>
              {id} {" "}
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
                <MenuItem key={id} onClick={(e) => {handleClose(), e.stopPropagation();}}> <DeleteIcon /> Remove From Session </MenuItem>
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
                <TabCard {...tab}></TabCard>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default GroupWindow;
