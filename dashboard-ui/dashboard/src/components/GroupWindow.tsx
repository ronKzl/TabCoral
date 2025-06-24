import Box from "@mui/material/Box";
import { useSessionSelector } from "../hooks";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TabCard from "./TabCard";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { type group } from "../interfaces/session";
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const [selectedGroupId, setSelectedGroupId] = useState('-1')
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id:string) => {
    setSelectedGroupId(id)
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleGroupOpen = () => {
    // chrome.tabs.group({createProperties : {groupId: id }}) 
    console.log(selectedGroupId)
    handleClose();
  }

  const tabColorMap: Record<string, string> = {
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      {Object.entries(tabs).map(([id, tabs]) => (
        <Accordion key={id} sx={{ width: "100%" }}>
          <AccordionSummary
            sx={{ "& .MuiAccordionSummary-content": { alignItems: "center" } }}
            expandIcon={<ExpandMoreIcon />}
          >
            <Box>
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
