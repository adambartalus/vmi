import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import AsynchronousAutocomplete from './AsyncAutocomplete';
import { getAvailablePadlocks } from '../fetch/fetchPadlocks';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { useMutation } from '@tanstack/react-query';
import { postVisit } from '../fetch/fetchVisits';
import { verifyPassByQrCode } from '../fetch/fetchTickets';

const TicketScanner = ({ scanning, onClose }) => {
  const [verifying, setVerifying] = useState(false);
  const [data, setData] = useState();
  const [checkInTime, setCheckInTime] = useState(dayjs());
  const [padlock, setPadlock] = useState(null);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('sm'));

  const mutation = useMutation(postVisit, {
    onError: async (error) => {
      const data = await error.json();
      console.log(data);
    },
  });

  const verifyQRCode = async (code) => {
    setVerifying(true);
    const response = await verifyPassByQrCode(code);
    const data = await response.json();
    console.log(data);
    setData(data);
    setVerifying(false);
  };

  const handleResult = (result, error) => {
    if (result) {
      onClose();
      verifyQRCode(result?.text);
    }
    if (error) {
      console.info(error);
    }
  };

  const handleSubmit = () => {
    mutation.mutate({
      gym_pass: data.id,
      user: data.owner.id,
      check_in_time: checkInTime,
      padlock: padlock.id,
    });
  };

  return (
    <>
      {scanning && (
        <QrReader
          constraints={{
            facingMode: 'environment',
          }}
          onResult={handleResult}
          style={{ width: '100%' }}
        />
      )}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={verifying}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog open={Boolean(data)} onClose={() => setData()} fullScreen={xs}>
        <DialogTitle>Tag beléptetése</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">Jegyinformáció</Typography>
          <div>
            <Typography>Tulajdonos: {data?.owner.email}</Typography>
            <Typography>
              Érvényes: {new Date(data?.valid_from).toLocaleDateString()} -{' '}
              {new Date(data?.valid_to).toLocaleDateString()}
            </Typography>
          </div>
        </DialogContent>
        <DialogContent>
          <form>
            <Stack gap={2}>
              <AsynchronousAutocomplete
                label="Lakat"
                fetchOptions={getAvailablePadlocks}
                queryKey={['padlocks', { available: true }]}
                getOptionLabel={(option) => `#${option.id} - ${option.text}`}
                value={padlock}
                onChange={(event, option) => {
                  setPadlock(option);
                }}
              />
              <DateTimePicker label="Belépés ideje" value={checkInTime} onChange={(value) => setCheckInTime(value)} />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Mégse</Button>
          <Button onClick={handleSubmit}>Beléptet</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TicketScanner;
