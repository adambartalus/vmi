import React, { useEffect, useState } from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import { useMutation } from '@tanstack/react-query';
import { patchPadlock } from '../fetch/fetchPadlocks';

const EditPadlockDialog = ({ open, padlock, onSuccess, onClose, fullScreen, ...props }) => {
  const [padlockId, setPadlockId] = useState();
  const [text, setText] = useState();

  const [errorMessages, setErrorMessages] = useState(null);
  const [confirmCloseDialogOpen, setConfirmCloseDialogOpen] = useState(false);

  const mutation = useMutation(patchPadlock, {
    onSuccess,
    onError: async (error) => {
      try {
        const data = await error.json();
        setErrorMessages(data);
      } catch (error) { /* empty */ }
    },
  });
  const stateChanged = () => padlockId !== padlock?.padlock_id || text !== padlock?.text 
  const resetState = () => {
    setPadlockId(null);
    setText(null);
    setErrorMessages(null);
  }
  const handleSubmit = () => {
    mutation.mutate({ padlock, padlockId, text });
  };

  useEffect(() => {
    if(padlock) {
      setPadlockId(padlock.padlock_id);
      setText(padlock.text);
    } else {
      resetState();
    }
  }, [padlock]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      {...props}
    >
      {fullScreen ? (
        <AppBar color="inherit" position="relative" enableColorOnDark elevation={0}>
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              onClick={() => {
                if (padlockId !== padlock?.padlock_id || text !== padlock?.text) setConfirmCloseDialogOpen(true);
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
              Lakat módosítása
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit} sx={{ mr: 1 }}>
              Mentés
            </Button>
          </Toolbar>
        </AppBar>
      ) : (
        <DialogTitle display="flex" alignItems="center" justifyContent='space-between'>
          <span>
            Lakat módosítása
          </span>
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
        <Stack gap={2} mt={2}>
          <TextField
            label="Azonosító"
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
      </DialogContent>
      {!fullScreen && (
        <DialogActions>
          <Button onClick={onClose}>Mégsem</Button>
          <Button onClick={handleSubmit}>Módosít</Button>
        </DialogActions>
      )}
      <Dialog open={confirmCloseDialogOpen}>
        <DialogTitle>Módosítás megszakítása</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmCloseDialogOpen(false)}>Mégse</Button>
          <Button
            onClick={() => {
              setConfirmCloseDialogOpen(false);
              onClose();
            }}
          >
            Megszakítás
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop sx={{ color: '#fff' }} open={mutation.isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default EditPadlockDialog;
