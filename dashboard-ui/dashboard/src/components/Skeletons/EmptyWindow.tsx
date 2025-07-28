import { Box, Typography, Button,Paper } from "@mui/material";
import { type PopUpState } from "../../App";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

interface EmptyWindowProps {
  setPopUpOpen: React.Dispatch<React.SetStateAction<PopUpState>>;
}

function EmptyWindow({setPopUpOpen}:EmptyWindowProps) {
    async function handleCreatingNewProfile() {
    let res = await chrome.runtime.sendMessage({ type: "CREATE_NEW_PROFILE" });

    if (res.success) {
      setPopUpOpen({
        open: true,
        duration: 3000,
        message: "New Profile Created!",
        status: "success",
        variant: "filled",
      });
    } else {
      setPopUpOpen({
        open: true,
        duration: 8000,
        message: "Error: profile limit reached or data error in transit.",
        status: "error",
        variant: "filled",
      });
    }
  }
  
    return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.05)", 
          maxWidth: 400,
        }}
      >
        <CreateNewFolderIcon sx={{ fontSize: 60, mb: 2, color: "grey.400" }} />
        <Typography variant="h6" sx={{ mb: 1, color: "white" }}>
          No Profile Selected
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "grey.400" }}>
          Please select or create  profile to get started. (<b>MAX: 10.</b>)
          You can also create your profile by right-clicking and using the extension dropdown!
        </Typography>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={() => handleCreatingNewProfile()}
        >
          Create New Profile
        </Button>
      </Paper>
    </Box>
  );
}

export default EmptyWindow;