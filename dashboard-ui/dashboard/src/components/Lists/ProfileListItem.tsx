import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
// import Collapse from "@mui/material/Collapse";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";

interface ProfileListItemProps {
  session_id: string,
  session_index: number
}

//TODO -> Expand component later based on other things that will be needed.
export default function ProfileListItem({session_id, session_index}: ProfileListItemProps) {
  const [index, _] = useState(session_index)

  return (
    <ListItemButton>
      <ListItemText primary={session_id} key={index} />
    </ListItemButton>
  );
}

//FUTURE REFERENCE:
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