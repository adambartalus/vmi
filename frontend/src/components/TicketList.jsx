import { List } from '@mui/material';
import React from 'react';
import TicketListItem from './TicketListItem';

const TicketList = ({ tickets }) => {
  return (
    <List disablePadding>
      {tickets.map((ticket) => (
        <TicketListItem key={ticket.id} ticket={ticket} />
      ))}
    </List>
  );
};

export default TicketList;
