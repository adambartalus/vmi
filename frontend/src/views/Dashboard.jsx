import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import { useMediaQuery, useTheme } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Typography from '@mui/material/Typography';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

import AddTicketDialog from '../components/AddTicketDialog';
import TicketScanner from '../components/TicketScanner';

import { getActiveUsers } from '../fetch/fetchUsers';
import { getAvailablePadlocks } from '../fetch/fetchPadlocks';
import { addMessage } from '../slices/snackbarMessagesSlice';

// const actions = [
//   { icon: <SpeedDialIcon />, name: 'Jegy hozzáadás' },
//   { icon: <QrCodeScannerIcon />, name: 'Jegy beolvasás' },
// ];

const Dashboard = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [scanning, setScanning] = useState(false);
  const [addTicketDialogOpen, setAddTicketDialogOpen] = useState(false);
  const dispatch = useDispatch();

  const usersQuery = useQuery(['users', { active: true }], getActiveUsers);
  const padlocksQuery = useQuery(['padlocks', { available: true }], getAvailablePadlocks);

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        {usersQuery.isLoading ? <Skeleton /> : `Teremben tartózkodik: ${usersQuery.data.length} fő`}
      </Typography>

      <Typography variant="h6" gutterBottom>
        {padlocksQuery.isLoading ? <Skeleton /> : `Szabad lakatok: ${padlocksQuery.data.length}`}
      </Typography>
      <AddTicketDialog
        open={addTicketDialogOpen}
        onClose={() => setAddTicketDialogOpen(false)}
        onSuccess={() => {
          setAddTicketDialogOpen(false);
          dispatch(addMessage({ message: 'A jegy sikeresen létrehozva', severity: 'success' }));
        }}
        fullScreen={xs}
      />

      <TicketScanner scanning={scanning} onClose={() => setScanning(false)} />
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        <SpeedDialAction
          key="Jegy hozzáadás"
          icon={<SpeedDialIcon />}
          tooltipTitle="Jegy hozzáadás"
          tooltipOpen
          onClick={() => setAddTicketDialogOpen(true)}
        />
        <SpeedDialAction
          key="Jegy beolvasás"
          icon={<QrCodeScannerIcon />}
          tooltipTitle="Jegy beolvasás"
          tooltipOpen
          onClick={() => setScanning(true)}
        />
      </SpeedDial>
    </Container>
  );
};

export default Dashboard;
