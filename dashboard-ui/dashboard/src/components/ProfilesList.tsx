import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
// import Divider from '@mui/material/Divider'; //TODO -> Figure out why divider is not rendering
// import ListItemIcon from '@mui/material/ListItemIcon';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import DraftsIcon from '@mui/icons-material/Drafts';
// import SendIcon from '@mui/icons-material/Send';
// import StarBorder from '@mui/icons-material/StarBorder';

export default function NestedList() {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    //TODO -> Generate the List based on the profiles -> possible extract ListItemButton to its own component
    <List
      sx={{ width: '100%', maxWidth: 360}}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader sx={{bgcolor: 'inherit', color: 'inherit'}} component="div" id="nested-list-subheader">
          Your Profiles:
        </ListSubheader>
      }
    >
      <ListItemButton>
        <ListItemText primary="Profile 1" />
      </ListItemButton>
      <ListItemButton>
        <ListItemText primary="Gaming" />
      </ListItemButton>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary="Study" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Relax" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
}