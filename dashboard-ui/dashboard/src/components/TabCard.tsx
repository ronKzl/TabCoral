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
import { type PopUpState } from "../App";
import { useAppSelector } from "../hooks";

interface TabCardProps {
  favicon: string;
  setPopUpOpen: React.Dispatch<React.SetStateAction<PopUpState>>;
  title: string;
  url: string;
  id: number;
}
const OUT_OF_BOUNDS = "-1";
const EMPTY = 0;
function TabCard({ favicon, url, title, id, setPopUpOpen }: TabCardProps) {
  const selectedIndex = useAppSelector((state) => state.profile.selectedIndex);

  const [isDialogOpen, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

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

    let sessions_db = await chrome.storage.local.get("sessions");

    if (
      selectedIndex >= EMPTY &&
      sessions_db.sessions[selectedIndex] != undefined
    ) {
      let orderedEntries =
        sessions_db.sessions[selectedIndex].userData.orderedEntries;
      let gId = orderedEntries.find((tab: tab) => tab.id === id)?.groupId;

      let newOrder = orderedEntries.filter((tab: tab) => tab.id != id);

      if (
        gId != undefined &&
        gId in sessions_db.sessions[selectedIndex].userData.tabGroups
      ) {
        let newGroup = sessions_db.sessions[selectedIndex].userData.tabGroups[
          gId
        ].filter((tab: tab) => tab.id != id);

        sessions_db.sessions[selectedIndex].userData.orderedEntries = newOrder;

        if (newGroup.length === EMPTY) {
          let newGroupInfo = Object.fromEntries(
            Object.entries(
              sessions_db.sessions[selectedIndex].userData.tabGroups
            ).filter(([id, _]) => id != gId)
          );

          sessions_db.sessions[selectedIndex].userData.tabGroups = newGroupInfo;

          if (gId != OUT_OF_BOUNDS) {
            const modifiedGroupInfo = {
              ...sessions_db.sessions[selectedIndex].userData.groupInfo,
            };
            delete modifiedGroupInfo[gId];
            sessions_db.sessions[selectedIndex].userData.groupInfo =
              modifiedGroupInfo;
          }
        } else {
          sessions_db.sessions[selectedIndex].userData.tabGroups[gId] =
            newGroup;
        }

        await chrome.storage.local.set({ sessions: sessions_db.sessions });

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
              backgroundColor: "grey",
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
