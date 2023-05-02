import React, { useState } from 'react';
import { useMutation } from 'react-query';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { postPadlock } from '../../fetch/fetchPadlocks';
import { Box } from '@mui/material';

const AddPadlockForm = React.forwardRef(({ onSuccess, onSubmit, ...props }, ref) => {
  const [padlockId, setPadlockId] = useState();
  const [text, setText] = useState();

  const [errorMessages, setErrorMessages] = useState(null);

  const mutation = useMutation(postPadlock, {
    onSuccess,
    onError: async (error) => {
      try {
        const data = await error.json();
        setErrorMessages(data);
      } catch (error) {}
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ padlockId, text });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} {...props} ref={ref}>
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
  );
});

export default AddPadlockForm;
