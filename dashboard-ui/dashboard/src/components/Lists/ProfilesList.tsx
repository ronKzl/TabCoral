// import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
// import Collapse from '@mui/material/Collapse';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import Divider from '@mui/material/Divider'; //TODO -> Figure out why divider is not rendering
// import ListItemIcon from '@mui/material/ListItemIcon';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import DraftsIcon from '@mui/icons-material/Drafts';
// import SendIcon from '@mui/icons-material/Send';
import { useSessionSelector } from "../../hooks";
import {type session} from "../../interfaces/session"
import ProfileListItem from "./ProfileListItem"
import { type PopUpState } from "../../App";
// import { ListItemIcon } from '@mui/material';

interface ProfileListProps {
  setPopUpOpen: React.Dispatch<React.SetStateAction<PopUpState>>;
}

export default function ProfilesList({setPopUpOpen}:ProfileListProps) {
  // const [open, setOpen] = React.useState(true);
  const sessions = useSessionSelector((state) => (
    state.sessions ?? []
  )) 
  
  // const handleClick = () => {
  //   setOpen(!open);
  // };

  return (
    <List
      sx={{ width: '100%', maxWidth: 360}}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader sx={{fontSize: '1rem',bgcolor: 'inherit', color: 'inherit'}} component="div" id="nested-list-subheader">
          Your Profiles:
        </ListSubheader>
      }
    >
        {/* Create all the listItemButtons */}
        {sessions.map((entry: session, index: number) => (<ProfileListItem session_id={entry.id} session_index={index} setPopUpOpen={setPopUpOpen} />))}
        
      {/* THIS FOR LATER WHEN DISPLAYING MORE INFO ON WHAT IS IN A PROFILE */}
      {/* <ListItemButton onClick={handleClick}>
        <ListItemText primary="Study" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Relax" />
          </ListItemButton>
        </List>
      </Collapse> */}
    </List>
  );
}