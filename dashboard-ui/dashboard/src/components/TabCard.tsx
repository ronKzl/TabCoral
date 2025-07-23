import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import { type tab } from "../interfaces/session";
import AlertDialog from "./Actions/AlertBox";
import {type PopUpState} from "../App"
import { useAppSelector } from '../hooks';

interface TabCardProps {
  favicon: string;
  setPopUpOpen: React.Dispatch<React.SetStateAction<PopUpState>>;
  index: number;
  title: string;
  url: string;
  id: number;
}

function TabCard({ favicon, url, title, index, id, setPopUpOpen }: TabCardProps) {
  
  const selectedIndex = useAppSelector((state) => state.profile.selectedIndex)

  const handleTabOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    chrome.tabs.create({ active: true, index: index, url: url });
    event.stopPropagation();
  };

  const [isDialogOpen, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    //show abort snackbar
    setPopUpOpen({
      open: true,
      duration: 3000,
      message: "Tab Remove Operation Cancelled.",
      status: "warning",
      variant: "standard",
    });
  };

  
  async function handleTabRemoval() {
    let success: boolean = false;
    //TODO: Think architectually if it makes sense to close the tab if its currently open
    // let result = await chrome.tabs.get(id);
    // if (result !== undefined) {
    //   //chrome.tabs.remove(id); 
    // }
    //remove from database orderedEntries - query for it
    let sessions_db = await chrome.storage.local.get("sessions");
  
    if (selectedIndex >= 0 && sessions_db.sessions[selectedIndex] != undefined) {
      //find what group the tab belongs to and then filter it out of the array
      let orderedEntries = sessions_db.sessions[selectedIndex].userData.orderedEntries;
      let gId = orderedEntries.find((tab: tab) => tab.id === id)?.groupId;
      
      let newOrder = orderedEntries.filter((tab: tab) => tab.id != id);
    
      //now remove the tab from its associated group
      if (
        gId != undefined &&
        gId in sessions_db.sessions[selectedIndex].userData.tabGroups
      ) {
        let newGroup = sessions_db.sessions[selectedIndex].userData.tabGroups[gId].filter(
          (tab: tab) => tab.id != id
        );
        //set the modified arrays as new memebers
        sessions_db.sessions[selectedIndex].userData.orderedEntries = newOrder;

        //IF NEW GROUP IS EMPTY WE NEED TO JUST REMOVE IT FROM TABGROUPS CAN FILTER BY gID
        //AND FILTER IT OUT FROM GROUPINFO
        console.log("MY EMPTY GROUP?")
        if (newGroup.length === 0){
          // Then we want to filter out the tabGroups such that it does not have that group anymore
          let newGroupInfo = Object.fromEntries(Object.entries(sessions_db.sessions[selectedIndex].userData.tabGroups).filter(([id, _]) => id != gId))
          console.log("Removed the group and its tabs from tabGroups:")
          console.log(newGroupInfo)
          sessions_db.sessions[selectedIndex].userData.tabGroups = newGroupInfo
          //And if the group is not -1 we want to filter out groupInfo so that it does not have any info on that group
          if (gId != '-1'){
            console.log("Trying to delete it from the cosmetic group")
            console.log(sessions_db.sessions[selectedIndex].userData.groupInfo)
            console.log(sessions_db.sessions[selectedIndex].userData.groupInfo[gId])
            const modifiedGroupInfo = {... sessions_db.sessions[selectedIndex].userData.groupInfo} //copy first to mutate
            delete modifiedGroupInfo[gId]
            sessions_db.sessions[selectedIndex].userData.groupInfo = modifiedGroupInfo
          }
        }
        else{
          sessions_db.sessions[selectedIndex].userData.tabGroups[gId] = newGroup;
        }

        console.log("New db before saving!");
        console.log(sessions_db.sessions[selectedIndex]);

        console.log("attempting to save");
        //let arr = [sessions_db]
        let res = await chrome.storage.local.set({ sessions: sessions_db.sessions  });
        console.log(res);
        success = true;
      }
    }
    if (success) {
      setPopUpOpen({
        open: true,
        duration: 5000,
        message: "Tab succesfully removed from current session!",
        status: "success",
        variant: "filled",
      });
    } else {
      setPopUpOpen({
        open: true,
        duration: 8000,
        message:
          "Error: Either current session was not found or tab identification has changed, please attempt to save session and try again.",
        status: "error",
        variant: "filled",
      });
    }
  }

  const card = (
    <React.Fragment>
      <CardContent sx={{ maxHeight: 150 }}>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
          <CardMedia
            component="img"
            alt={title}
            height="16"
            image={favicon}
            sx={{
              maxWidth: 16,
              backgroundColor: "grey", // light gray background #f0f0f0
              borderRadius: "4px",
              padding: "2px",
              border: "2px solid #ccc",
            }}
          />
        </Typography>
        <Typography noWrap variant="h5" component="div">
          <a target="_blank" href={url}>
            {title}
          </a>
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" sx={{ color: "green" }} onClick={handleTabOpen}>
          Open Tab
        </Button>
        <Button
          size="small"
          sx={{ color: "red" }}
          onClick={(e) => {
            handleClickOpen(), e.stopPropagation();
          }}
        >
          Remove From Profile
        </Button>
      </CardActions>
    </React.Fragment>
  );

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{card}</Card>
      <br />
      <AlertDialog
        open={isDialogOpen}
        close={() => handleClose()}
        title={`Remove ${title} from your current saved session?\n`}
        content={"This action can't be undone."}
        onAgreeClick={() => {
          handleTabRemoval();
        }}
      />
    </Box>
  );
}

export default TabCard;
