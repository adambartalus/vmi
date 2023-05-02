import React, { useState } from 'react';
import { useMutation } from 'react-query';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import AddIcon from '@mui/icons-material/Add';

import dayjs from 'dayjs';
import { postTicketType } from '../../fetch/fetchTickets';

const AddTicketTypeForm = (props) => {
  const [name, setName] = useState(null);
  const [validFor, setValidFor] = useState(null);
  const [unit, setUnit] = useState({ value: 'days', label: 'nap' });
  const [price, setPrice] = useState(null);
  const [visitLimit, setVisitLimit] = useState(null);
  const [purchasable, setPurchasable] = useState(true);
  const [unitAnchor, setUnitAnchor] = useState(null);
  const [description, setDescription] = useState(null);
  const [descriptionArea, setDescriptionArea] = useState(false);

  const [errorMessages, setErrorMessages] = useState(null);
  const mutation = useMutation(postTicketType, {
    onError: async (error) => {
      try {
        const data = await error.json();
        console.log(data);
        setErrorMessages(data);
      } catch (error) {}
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const duration = dayjs.duration(validFor, unit.value);

    mutation.mutate({
      name,
      validFor: `P${duration.asDays()}D`,
      price,
      purchasable,
      visitLimit,
    });
  };

  return (
    <form onSubmit={handleSubmit} {...props}>
      <Grid2 spacing={{ xs: 2, md: 3 }} container>
        <Grid2 xs={12}>
          <TextField
            fullWidth
            label="Név"
            value={name || ''}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(errorMessages?.name)}
            helperText={errorMessages?.name}
          />
        </Grid2>
        <Grid2 xs={12}>
          <TextField
            fullWidth
            label="Ár"
            error={Boolean(errorMessages?.price)}
            helperText={errorMessages?.price}
            value={price || ''}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">HUF</InputAdornment>,
            }}
          />
        </Grid2>
        <Grid2 xs={12}>
          <TextField
            fullWidth
            label="Érvényesség"
            error={Boolean(errorMessages?.validFor)}
            helperText={errorMessages?.validFor}
            value={validFor || ''}
            onChange={(e) => setValidFor(e.target.value)}
            InputProps={{
              endAdornment: (
                <Box>
                  <span style={{ cursor: 'pointer' }} onClick={(e) => setUnitAnchor(e.currentTarget)}>
                    {unit.label}
                  </span>
                  <Menu anchorEl={unitAnchor} open={Boolean(unitAnchor)} onClose={() => setUnitAnchor(null)}>
                    <MenuItem
                      onClick={() => {
                        setUnit({ value: 'days', label: 'nap' });
                        setUnitAnchor(null);
                      }}
                    >
                      nap
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setUnit({ value: 'weeks', label: 'hét' });
                        setUnitAnchor(null);
                      }}
                    >
                      hét
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setUnit({ value: 'months', label: 'hónap' });
                        setUnitAnchor(null);
                      }}
                    >
                      hónap
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setUnit({ value: 'years', label: 'év' });
                        setUnitAnchor(null);
                      }}
                    >
                      év
                    </MenuItem>
                  </Menu>
                </Box>
              ),
            }}
          />
        </Grid2>
        <Grid2 xs={12}>
          <TextField
            fullWidth
            label="Alkalom limit"
            error={Boolean(errorMessages?.visitLimit)}
            helperText={errorMessages?.visitLimit}
            value={visitLimit || ''}
            onChange={(e) => {
              setVisitLimit(e.target.value);
            }}
          />
        </Grid2>
        <Grid2 xs={6}>
          <FormControlLabel
            label="Vásárolható"
            control={
              <Checkbox
                label="Vásárolható"
                checked={Boolean(purchasable)}
                onChange={(e) => setPurchasable(e.target.checked)}
              />
            }
          />
        </Grid2>
        <Grid2 xs={6} display="flex" justifyContent="end">
          <Button startIcon={<AddIcon />} onClick={(e) => setDescriptionArea(!descriptionArea)}>
            Leírás megadása
          </Button>
        </Grid2>
        <Grid2 xs={12}>
          <Collapse in={descriptionArea}>
            <TextField
              multiline
              fullWidth
              label="Leírás"
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 1 }}
            />
          </Collapse>
        </Grid2>
      </Grid2>
      <Button type="submit">Létrehoz</Button>
    </form>
  );
};

export default AddTicketTypeForm;
