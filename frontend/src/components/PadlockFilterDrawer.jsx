import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';

import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

const PadlockFilterDrawer = ({ filters, setFilters, open, setOpen, ...props }) => {
  const theme = useTheme();
  const lgAndUp = useMediaQuery(theme.breakpoints.up('lg'));
  const [localFilters, setLocalFilters] = useState(filters);

  return (
    <Drawer
      variant={lgAndUp ? 'persistent' : 'temporary'}
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        width: '300px',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: '300px',
          boxSizing: 'border-box',
        },
        ...(lgAndUp &&
          !open && {
            zIndex: -1,
          }),
        ...(!lgAndUp && {
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }),
      }}
      {...props}
    >
      {lgAndUp && <Toolbar />}
      <Box
        sx={{
          mb: 2,
          pt: 3,
          pr: 3,
          pl: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5">Szűrés</Typography>
        <IconButton onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Stack height="100%" p={{ xs: 2, md: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Azonosító"
            value={localFilters.padlock_id || ''}
            onChange={(e) => setLocalFilters((f) => ({ ...f, padlock_id: e.target.value }))}
          />
          <TextField
            label="Szöveg"
            value={localFilters.text || ''}
            onChange={(e) => setLocalFilters((f) => ({ ...f, text: e.target.value }))}
          />
          <FormControl>
            <FormLabel>Státusz</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={localFilters.available || ''}
              name="radio-buttons-group"
              onChange={(e) => setLocalFilters({ ...localFilters, available: e.target.value })}
            >
              <FormControlLabel value={true} control={<Radio />} label="Szabad" />
              <FormControlLabel value={false} control={<Radio />} label="Használatban" />
              <FormControlLabel value="" control={<Radio />} label="Mind" />
            </RadioGroup>
          </FormControl>
        </Stack>
      </Stack>
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
          pb: 3,
          pr: 3,
          pl: 2,
        }}
      >
        <Button onClick={() => setFilters(localFilters)} color="secondary" variant="contained">
          Alkalmaz
        </Button>
      </Box>
    </Drawer>
  );
};

export default PadlockFilterDrawer;
