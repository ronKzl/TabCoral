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
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { type PopUpState } from "../App";
import AlertDialog from "./Actions/AlertBox";
import {
  type tab,
  type sessions,
  type group,
  type session,
} from "../interfaces/session";
import { useSelector } from "react-redux";
import EmptyWindow from "./Skeletons/EmptyWindow";

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

const OUT_OF_BOUNDS = "-1"
const DEFAULT_SESSION_SELECTED = "-2"
function GroupWindow({ setPopUpOpen }: GroupWindowProps) {
  const sessions = useSelector((state: sessions) => state.sessions);
  const selectedIndex = useAppSelector((state) => state.profile.selectedIndex);

  const [selectedGroupId, setSelectedGroupId] = useState(DEFAULT_SESSION_SELECTED);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [alertDialogState, setalertDialogState] = useState({
    isOpen: false,
    text: "",
  });

  if (selectedIndex < 0 || selectedIndex >= sessions.length)
    return <EmptyWindow setPopUpOpen={setPopUpOpen}/>; 

  const tabs = sessions[selectedIndex].userData.tabGroups ?? ({} as session);
  
  const groupInfo =
    sessions[selectedIndex].userData.groupInfo ?? ({} as Record<string, group>);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    setSelectedGroupId(id);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAlertBoxClose = () => {
    setalertDialogState({ isOpen: false, text: "" });
    setPopUpOpen({
      open: true,
      duration: 3000,
      message: "Group Remove Operation Cancelled.",
      status: "warning",
      variant: "standard",
    });
  };

  async function handleGroupOpen() {
    let groupTabIds = await Promise.all(
      tabs[selectedGroupId].map(async (tab) => {
        let newTab = await chrome.tabs.create({
          active: false,
          index: tab.index,
          url: tab.url,
        });
        return newTab.id;
      })
    );

    let cleanIds: number[] = groupTabIds.filter((id) => {
      return id !== undefined;
    });
    let newGroupId = await chrome.tabs.group({ tabIds: cleanIds });

    chrome.tabGroups.update(newGroupId, {
      collapsed: groupInfo[selectedGroupId].collapsed,
      color: groupInfo[selectedGroupId].color,
      title: groupInfo[selectedGroupId].title,
    });

    handleClose();
  }

  async function handleGroupRemovalFromSession() {
    setalertDialogState({ isOpen: false, text: "" });

    let success = false;

    let sessions_db = await chrome.storage.local.get("sessions");

    if (
      selectedIndex >= 0 &&
      sessions_db.sessions[selectedIndex] != undefined
    ) {
      let currentSession = sessions_db.sessions[selectedIndex];

      let groupTabsRemove = Object.entries(tabs).find(
        ([id, _]) => id === selectedGroupId
      )?.[1];

      let tabIds = groupTabsRemove?.map((t: tab) => t.id);

      if (tabIds != undefined && tabIds.length != 0) {
        let orderedEntries = currentSession.userData.orderedEntries;

        let newOrderedEntries = orderedEntries.filter(
          (t: tab) => !tabIds.includes(t.id)
        );

        currentSession.userData.orderedEntries = newOrderedEntries;
      }

      let newGroupInfo = Object.fromEntries(
        Object.entries(tabs).filter(([id, _]) => id != selectedGroupId)
      );

      currentSession.userData.tabGroups = newGroupInfo;

      if (selectedGroupId != OUT_OF_BOUNDS) {
        const modifiedGroupInfo = { ...groupInfo };
        delete modifiedGroupInfo[selectedGroupId];
        currentSession.userData.groupInfo = modifiedGroupInfo;
      }

      setSelectedGroupId(DEFAULT_SESSION_SELECTED);

      sessions_db.sessions[selectedIndex] = currentSession;

      await chrome.storage.local.set({ sessions: sessions_db.sessions });

      success = true;
    }

    if (success) {
      setPopUpOpen({
        open: true,
        duration: 5000,
        message: "Group & Tabs succesfully removed from current session!",
        status: "success",
        variant: "filled",
      });
    } else {
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
    
    let groupName = groupInfo[selectedGroupId]?.title ?? "Ungrouped";
    setalertDialogState({
      isOpen: true,
      text: `Remove ${groupName} from your current saved groups for this session?\n`,
    });
    handleClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {Object.entries(tabs).map(([id, tabs]) => (
        <Accordion key={id} sx={{ width: "100%" }}>
          <AccordionSummary
            sx={{ "& .MuiAccordionSummary-content": { alignItems: "center" } }}
            expandIcon={<ExpandMoreIcon />}
          >
            <Box
              sx={{
                color: `${tabColorMap[groupInfo[id]?.color] ?? "black"}`,
                fontSize: "1.25rem",
              }}
            >
              {groupInfo[id]?.title ?? "Ungrouped"} {" | "} {tabs.length} {" "}
              {" Tab"}{tabs.length > 1 ? "s" : ""}
            </Box>
            <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                onClick={(e) => {
                  handleMenuOpen(e, id);
                  e.stopPropagation();
                }}
              >
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
                <MenuItem
                  onClick={(e) => {
                    handleGroupOpen(), e.stopPropagation();
                  }}
                >
                  {" "}
                  <FolderOpenIcon /> Open Group
                </MenuItem>
                <MenuItem
                  key={id}
                  onClick={(e) => {
                    openGroupDeletionDialog(), e.stopPropagation();
                  }}
                >
                  {" "}
                  <DeleteIcon /> Remove From Profile{" "}
                </MenuItem>
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
                <TabCard
                  id={tab.id}
                  favicon={tab.favicon}
                  url={tab.url}
                  title={tab.title}
                  
                  setPopUpOpen={setPopUpOpen}
                ></TabCard>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
      <AlertDialog
        open={alertDialogState.isOpen}
        close={() => handleAlertBoxClose()}
        title={alertDialogState.text}
        content={
          "This operation will remove the current group and its associated tabs from the session and can't be undone."
        }
        onAgreeClick={() => {
          handleGroupRemovalFromSession();
        }}
      />
    </Box>
  );
}

export default GroupWindow;
