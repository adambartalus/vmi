import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Alert, AlertTitle, Snackbar } from '@mui/material';

import { popMessage } from '../slices/snackbarMessagesSlice';

const SnackbarNotification = () => {
  const [open, setOpen] = useState(false);
  const snackbarMessages = useSelector((state) => state.snackbars);

  useEffect(() => {
    if (snackbarMessages.length > 0) setOpen(true);
  }, [snackbarMessages]);

  // functions
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };
  const handleExited = () => {
    dispatch(popMessage());
  };

  return (
    <>
      {snackbarMessages.length > 0 && (
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          transitionDuration={200}
          TransitionProps={{
            onExited: handleExited,
          }}
          sx={{
            bottom: {
              xs: 90,
              sm: 24,
            },
          }}
        >
          <Alert onClose={handleClose} severity={snackbarMessages[0].severity} sx={{ width: '400px' }}>
            {snackbarMessages[0].title && <AlertTitle>{snackbarMessages[0].title}</AlertTitle>}
            <span>{snackbarMessages[0].message}</span>
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default SnackbarNotification;
