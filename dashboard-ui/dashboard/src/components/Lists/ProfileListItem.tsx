import ListItemButton from "@mui/material/ListItemButton";
import { setProfileIndex } from "../../profileSlice";
import { useDispatch } from "react-redux";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import { useAppSelector } from "../../hooks";
import { useState } from "react";
import AlertDialog from "../Actions/AlertBox";
import { type PopUpState } from "../../App";
import { type session } from "../../interfaces/session";
import { TextField } from "@mui/material";
interface ProfileListItemProps {
  session_id: string;
  session_index: number;
  session_name: string;
  setPopUpOpen: React.Dispatch<React.SetStateAction<PopUpState>>;
}

const OUT_OF_BOUNDS = -1;
const EXT_TAB_INDEX = 0;
export default function ProfileListItem({
  session_id,
  session_index,
  session_name,
  setPopUpOpen,
}: ProfileListItemProps) {
  const dispatch = useDispatch();
  const selectedIndex = useAppSelector((state) => state.profile.selectedIndex);
  const [alertDialogState, setalertDialogState] = useState({
    isOpen: false,
    text: "",
  });

  const [inputValue, setValue] = useState(session_name);
  const [isEditing, setIsEditing] = useState(false);

  async function handleDeletingProfile(profileId: string) {
    setalertDialogState({ isOpen: false, text: "" });
    let success = false;

    let sessions_db = await chrome.storage.local.get("sessions");

    let updated_sessions_db = sessions_db.sessions.filter(
      (session: session) => !(session.id === profileId)
    );

    sessions_db.sessions = updated_sessions_db;

    await chrome.storage.local.set({
      sessions: sessions_db.sessions,
    });

    chrome.storage.local.set({ currentSessionIndex: OUT_OF_BOUNDS });
    chrome.storage.local.set({ currentSessionId: OUT_OF_BOUNDS });
    dispatch(setProfileIndex(OUT_OF_BOUNDS));

    success = true;

    if (success) {
      setPopUpOpen({
        open: true,
        duration: 5000,
        message: "Profile was succesfully removed from storage.",
        status: "success",
        variant: "filled",
      });
    } else {
      setPopUpOpen({
        open: true,
        duration: 8000,
        message:
          "Error: Current profile was not found in local storage, attempt to reload the page and try again.",
        status: "error",
        variant: "filled",
      });
    }
  }

  const handleAlertBoxClose = () => {
    setalertDialogState({ isOpen: false, text: "" });
    setPopUpOpen({
      open: true,
      duration: 3000,
      message: "Profile Remove Operation Cancelled.",
      status: "warning",
      variant: "standard",
    });
  };

  async function openCurrentSession(session_index: number) {
    let profiles = (await chrome.storage.local.get("sessions")) as {
      sessions: session[];
    };

    let profile = profiles.sessions[session_index];
    const { groupInfo, tabGroups } = profile.userData;

    if (Object.keys(tabGroups ?? {}).length > 0) {
      await chrome.tabs.query({}, function (tabs) {
        tabs.forEach((tab) => {
          if (tab?.id !== undefined && tab?.index !== EXT_TAB_INDEX) {
            chrome.tabs.remove(tab.id);
          }
        });
      });

      for (const [groupId, groupTabs] of Object.entries(tabGroups)) {
        let groupTabIds = await Promise.all(
          groupTabs.map(async (tab) => {
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
        if (groupId !== OUT_OF_BOUNDS.toString()) {
          let newGroupId = await chrome.tabs.group({ tabIds: cleanIds });

          chrome.tabGroups.update(newGroupId, {
            collapsed: groupInfo[groupId].collapsed,
            color: groupInfo[groupId].color,
            title: groupInfo[groupId].title,
          });
        }
      }
    }
  }

  async function handleProfileNameUpdate() {
    setIsEditing(false);
    let profiles = await chrome.storage.local.get("sessions");

    profiles.sessions[session_index].name = inputValue;
    await chrome.storage.local.set({ sessions: profiles.sessions });
  }

  return (
    <ListItem
      key={session_index}
      disablePadding
      secondaryAction={
        <>
          <Button
            onClick={() => openCurrentSession(session_index)}
            sx={{ color: "silver" }}
            variant="text"
          >
            Restore
          </Button>{" "}
          <Button
            onClick={() =>
              setalertDialogState({
                isOpen: true,
                text: `Deleting profile ${session_name}`,
              })
            }
            sx={{ color: "red" }}
            variant="text"
          >
            Delete
          </Button>
        </>
      }
    >
      <ListItemButton
        selected={session_index === selectedIndex}
        sx={{
          borderColor: "white",
          border: "solid",
          borderTop: "none",
          borderRight: "none",
          borderLeft: "none",
        }}
        onClick={() => {
          chrome.storage.local.set({ currentSessionIndex: session_index });
          chrome.storage.local.set({ currentSessionId: session_id });
          dispatch(setProfileIndex(session_index));
        }}
      >
        <TextField
          value={inputValue}
          variant="standard"
          label={
            (isEditing && "Editing Profile...") ||
            (!isEditing && "Edit Profile Name")
          }
          slotProps={{
            input: {
              readOnly: !isEditing,
            },
          }}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => handleProfileNameUpdate()}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          sx={{
            width: "50%",
            input: { color: "white" },
            label: { color: "white" },
            borderBottom: "1px solid white",
            "& .MuiInput-underline:after": {
              borderBottomColor: "white",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "white",
            },
          }}
        />
      </ListItemButton>
      <AlertDialog
        open={alertDialogState.isOpen}
        close={() => handleAlertBoxClose()}
        title={alertDialogState.text}
        content={`This operation will remove the profile ${session_name} and ALL of its associated saved groups and tabs, are you sure you want to proceed?`}
        onAgreeClick={() => {
          handleDeletingProfile(session_id);
        }}
      />
    </ListItem>
  );
}
