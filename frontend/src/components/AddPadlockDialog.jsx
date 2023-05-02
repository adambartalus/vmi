import React, { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { postPadlock } from '../fetch/fetchPadlocks';
import { Backdrop, Box, CircularProgress, DialogActions } from '@mui/material';
import { AppBar, Button, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from '@tanstack/react-query';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddPadlockDialog = ({ open, onClose, onSuccess, fullScreen, ...props }) => {
  const [padlockId, setPadlockId] = useState(null);
  const [text, setText] = useState(null);

  const [errorMessages, setErrorMessages] = useState(null);
  const [confirmCloseDialogOpen, setConfirmCloseDialogOpen] = useState(false);

  const resetState = () => {
    setPadlockId(null);
    setText(null);
    setConfirmCloseDialogOpen(false);
    setErrorMessages(null);
  };
  const stateChanged = () => padlockId !== null || text !== null

  const mutation = useMutation(postPadlock, {
    onSuccess,
    onError: async (error) => {
      try {
        const data = await error.json();
        setErrorMessages(data);
      } catch (error) {
        /* empty */
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ padlockId, text });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      TransitionComponent={fullScreen ? Transition : undefined}
      TransitionProps={{
        onExited: resetState,
      }}
      {...props}
    >
      {fullScreen ? (
        <AppBar color="inherit" position="relative" enableColorOnDark elevation={0}>
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              onClick={() => {
                if (padlockId || text) setConfirmCloseDialogOpen(true);
                else onClose();
              }}
              aria-label="close"
              sx={{
                p: 0,
                ml: 2,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Új lakat
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit} sx={{ mr: 1 }}>
              Mentés
            </Button>
          </Toolbar>
        </AppBar>
      ) : (
        <DialogTitle display="flex" alignItems="center" justifyContent='space-between'>
          <span>Új lakat</span>
          <IconButton
            color="inherit"
            onClick={() => {
              if (stateChanged()) setConfirmCloseDialogOpen(true)
              else onClose()
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack gap={2} mt={2}>
            <TextField
              label="Azonosító"
              name="padlock_id"
              error={Boolean(errorMessages?.padlock_id)}
              helperText={errorMessages?.padlock_id}
              value={padlockId || ''}
              onChange={(e) => setPadlockId(e.target.value)}
            />
            <TextField
              label="Szöveg (Opcionális)"
              error={Boolean(errorMessages?.text)}
              helperText={errorMessages?.text}
              value={text || ''}
              onChange={(e) => setText(e.target.value)}
            />
          </Stack>
        </Box>
      </DialogContent>
      {!fullScreen && (
        <DialogActions>
          <Button
            onClick={() => {
              if (padlockId || text) setConfirmCloseDialogOpen(true);
              else onClose();
            }}
          >
            Mégse
          </Button>
          <Button onClick={handleSubmit}>Mentés</Button>
        </DialogActions>
      )}
      <Dialog open={confirmCloseDialogOpen}>
        <DialogTitle>Kilépés</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmCloseDialogOpen(false)}>Mégse</Button>
          <Button
            onClick={() => {
              setConfirmCloseDialogOpen(false);
              onClose();
            }}
          >
            Megszakít
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={mutation.isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default AddPadlockDialog;
