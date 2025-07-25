import { Box, Typography, Button, Paper } from "@mui/material";
import TabIcon from "@mui/icons-material/Tab";


function EmptyProfilePrompt() {
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
          maxWidth: 420,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: "white" }}>
          Your Profile is Empty
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, color: "grey.400" }}>
          You can save all your current tabs or groups into this profile to start organizing.
          You can also save by right-clicking and using the extension dropdown!
        </Typography>
        
          <Button
            variant="contained"
            color="primary"
            startIcon={<TabIcon />}
            onClick={() => chrome.runtime.sendMessage({ type: "SAVE_ALL" })}
          >
            Save All Current Open Tabs and Groups
          </Button>
        
      </Paper>
    </Box>
  );
}

export default EmptyProfilePrompt;
