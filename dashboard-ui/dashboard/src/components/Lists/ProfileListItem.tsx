import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { setProfileIndex } from "../../profileSlice";
import { useDispatch } from "react-redux";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import { useAppSelector } from "../../hooks";
import { useState } from "react";
import AlertDialog from "../Actions/AlertBox";
import { type PopUpState } from "../../App";
import { type session } from "../../interfaces/session";

interface ProfileListItemProps {
  session_id: string;
  session_index: number;
  setPopUpOpen: React.Dispatch<React.SetStateAction<PopUpState>>;
}

export default function ProfileListItem({
  session_id,
  session_index,
  setPopUpOpen,
}: ProfileListItemProps) {
  const dispatch = useDispatch();
  const selectedIndex = useAppSelector((state) => state.profile.selectedIndex);
  const [alertDialogState, setalertDialogState] = useState({
    isOpen: false,
    text: "",
  });

  async function handleDeletingProfile(
    profileId: string,
    profileIndex: number
  ) {
    //show the pop up as pre-req
    console.log(profileIndex);
    console.log(`deleting profile index: ${profileId}`);
    setalertDialogState({ isOpen: false, text: "" });
    let success = false;
    //get all the sessions from the chrome store
    let sessions_db = await chrome.storage.local.get("sessions");
    console.log(`what i got is:`);
    console.log(sessions_db.sessions);
    //filter out all but the current ussing the sessionIndex which is the id so cant be changed
    let updated_sessions_db = sessions_db.sessions.filter(
      (session: session) => !(session.id === profileId)
    );
    console.log(`Now I updated array is:`);
    console.log(updated_sessions_db);
    sessions_db.sessions = updated_sessions_db;

    //save back
    let res = await chrome.storage.local.set({
      sessions: sessions_db.sessions,
    });
    console.log(res);

    chrome.storage.local.set({ currentSessionIndex: -1 });
    chrome.storage.local.set({ currentSessionId: -1 });
    dispatch(setProfileIndex(-1));

    success = true;
    //show the success snackbar
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
    console.log(`Opening session ${session_index}`);
   
    //get current profiles from DB by selected index
    let profiles = (await chrome.storage.local.get("sessions")) as {
      sessions: session[];
    };

    let profile = profiles.sessions[session_index];
    const { groupInfo, orderedEntries, tabGroups } = profile.userData;
    console.log(orderedEntries);

    if (Object.keys(tabGroups ?? {}).length > 0) {
       //Clear all tabs of current session from the tab bar?
      //query all tabs and call close
      // await chrome.tabs.query({}, function(tabs) {
      //   tabs.forEach((tab) => {
      //     if (tab?.id !== undefined){
      //       console.log(tab.id)
      //       //chrome.tabs.remove(tab.id) UNCOMENT WHEN ALL WORK ON EXTENSION IS DONE
      //     }

      //   })
      // });
      console.log(tabGroups);
      for (const [groupId, groupTabs] of Object.entries(tabGroups)) {
        let groupTabIds = await Promise.all(
          groupTabs.map(async (tab) => {
            console.log(tab.id);

            let newTab = await chrome.tabs.create({
              active: false,
              index: tab.index,
              url: tab.url,
            });
            return newTab.id;
          })
        );
        console.log(groupTabIds);
        console.log(groupId);
        //filter on to get out undefined ids
        let cleanIds: number[] = groupTabIds.filter((id) => {
          return id !== undefined;
        });
        //put the tabs into 1 group
        let newGroupId = await chrome.tabs.group({tabIds: cleanIds})
        //now that group is avaiable can style it
        chrome.tabGroups.update(newGroupId, {collapsed: groupInfo[groupId].collapsed,
          color: groupInfo[groupId].color,
          title: groupInfo[groupId].title
        });
      }
    }
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
                text: `Deleting profile ${session_id}, curr index in array ${session_index}`,
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
        <ListItemText primary={session_id} key={session_index} />
      </ListItemButton>
      <AlertDialog
        open={alertDialogState.isOpen}
        close={() => handleAlertBoxClose()}
        title={alertDialogState.text}
        content={`This operation will remove the profile ${session_id} and ALL of its associated saved groups and tabs, are you sure you want to proceed?`}
        onAgreeClick={() => {
          handleDeletingProfile(session_id, session_index);
        }}
      />
    </ListItem>
  );
}

//FUTURE REFERENCE:
{
  /* THIS FOR LATER WHEN DISPLAYING MORE INFO ON WHAT IS IN A PROFILE */
}
{
  /* <ListItemButton onClick={handleClick}>
        <ListItemText primary="Study" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Relax" />
          </ListItemButton>
        </List>
      </Collapse> */
}
