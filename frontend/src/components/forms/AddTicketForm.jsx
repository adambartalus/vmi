import { Box, Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AsynchronousAutocomplete from '../AsyncAutocomplete';
import { getUsers } from '../../fetch/fetchUsers';
import { getPassTypes, postTicket } from '../../fetch/fetchTickets';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useMutation } from 'react-query';

const AddTicketForm = (props) => {
  const [ticketType, setTicketType] = useState(null);
  const [user, setUser] = useState(null);
  const [validFrom, setValidFrom] = useState(dayjs());
  const [validTo, setValidTo] = useState(null);

  const [errorMessages, setErrorMessages] = useState(null);

  const mutation = useMutation(postTicket, {
    onError: async (error) => {
      try {
        const data = await error.json();
        setErrorMessages(data);
      } catch (error) {}
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({ userId: user?.id, ticketTypeId: ticketType?.id, validFrom: validFrom.format('YYYY-MM-DD') });
  };

  useEffect(() => {
    if (ticketType) {
      const validFor = dayjs.duration(ticketType.valid_for);
      setValidTo(dayjs().add(validFor).endOf('day'));
    }
  }, [ticketType]);

  return (
    <Box component="form" onSubmit={handleSubmit} {...props}>
      <Grid2 spacing={{ xs: 2, md: 3 }} container>
        <Grid2 xs={12}>
          <AsynchronousAutocomplete
            fetchOptions={getUsers}
            queryKey="users"
            getOptionLabel={(o) => o.email}
            label="Felhasználó"
            value={user}
            onChange={(event, option) => setUser(option)}
            TextFieldProps={{
              error: Boolean(errorMessages?.owner),
              helperText: errorMessages?.owner,
            }}
          />
        </Grid2>
        <Grid2 xs={12}>
          <AsynchronousAutocomplete
            label="Jegy típus"
            getOptionLabel={(o) => `${o.name} - ${o.price} HUF`}
            fetchOptions={getPassTypes}
            queryKey={'ticket-types'}
            onChange={(event, option) => {
              setTicketType(option);
            }}
            value={ticketType}
            TextFieldProps={{
              error: Boolean(errorMessages?.gym_pass_type),
              helperText: errorMessages?.gym_pass_type,
            }}
          />
        </Grid2>
        <Grid2 xs={6}>
          <DatePicker
            slotProps={{ textField: { fullWidth: true } }}
            label="Érvényesség kezdete"
            value={validFrom}
            onChange={(value) => {
              console.log(value);
              setValidFrom(value);
            }}
          />
        </Grid2>
        <Grid2 xs={6}>
          <DatePicker
            slotProps={{ textField: { fullWidth: true } }}
            label="Érvényesség vége"
            value={validTo}
            onChange={(value) => setValidTo(value)}
          />
        </Grid2>
      </Grid2>
      <Button type="submit">Létrehoz</Button>
    </Box>
  );
};

export default AddTicketForm;
