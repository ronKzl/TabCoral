import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { setProfileIndex } from "../../profileSlice";
import { useDispatch } from "react-redux";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
// import { useState } from "react";
// import Collapse from "@mui/material/Collapse";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";

interface ProfileListItemProps {
  session_id: string;
  session_index: number;
}

//TODO -> Expand component later based on other things that will be needed.
export default function ProfileListItem({
  session_id,
  session_index,
}: ProfileListItemProps) {
  const dispatch = useDispatch();
  return (
    <ListItem
      key={session_index}
      disablePadding
      secondaryAction={<><Button sx={{color:"silver"}} variant="text">Restore</Button> <Button sx={{color:"red"}} variant="text">Delete</Button></>}
    >
      <ListItemButton
        sx={{
          borderColor: "white",
          border: "solid",
          borderTop: "none",
          borderRight: "none",
          borderLeft: "none",
        }}
        onClick={() => dispatch(setProfileIndex(session_index))}
      >
        <ListItemText primary={session_id} key={session_index} />
      </ListItemButton>
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
