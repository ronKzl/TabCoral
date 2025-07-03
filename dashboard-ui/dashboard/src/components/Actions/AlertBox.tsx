import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface AlertDialogProps {
    open: boolean,
    close: React.MouseEventHandler<HTMLButtonElement> | undefined, //<- idk used in multiple contexts
    title: string,
    content?: string,
    onAgreeClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
}

export default function AlertDialog({title, open, close, content, onAgreeClick}: AlertDialogProps) {
  
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} autoFocus>No</Button>
          <Button onClick={onAgreeClick}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}