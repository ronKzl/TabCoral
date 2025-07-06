//import * as React from "react";
// import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
import Alert, { type AlertColor } from "@mui/material/Alert";

interface PopUpBarProps {
  duration: number;
  message: string;
  statusColor: AlertColor;
  style: 'standard' | 'filled' | 'outlined';
  handleClick: any;
  isOpen: boolean;
}

function PopUpBar({duration, message, isOpen, statusColor, style, handleClick}: PopUpBarProps) {

  return (
    <Snackbar open={isOpen} autoHideDuration={duration} onClose={handleClick}>
      <Alert
        onClose={handleClick}
        severity={statusColor}
        variant={style}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default PopUpBar;
