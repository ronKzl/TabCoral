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

function TabCard({ favicon, url, title, index, id }: tab) {
  
  const handleTabOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    chrome.tabs.create({ active: true, index: index, url: url });
    //get id and update in db
    event.stopPropagation();
  };

  const [isDialogOpen, setOpen] = React.useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    //show abort snackbar
    setOpen(false);
  };

  //event: React.MouseEvent<HTMLButtonElement>
  async function handleTabRemoval() {
    handleClose();
    
    let result = await chrome.tabs.get(id);
    if (result !== undefined) {
      chrome.tabs.remove(id);
    }
    //   //remove from database
    
    //   //show snackbar

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
          <a target="_blank" href={url}>{title}</a>
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
          Remove From Session
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
        onAgreeClick={() => {handleTabRemoval()}}
      />
    </Box>
  );
}

export default TabCard;
