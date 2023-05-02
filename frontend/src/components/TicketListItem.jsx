import { Link } from 'react-router-dom';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const TicketListItem = ({ ticket }) => {
  return (
    <ListItem divider disablePadding>
      <ListItemButton
        component={Link}
        to={{
          pathname: `${ticket.id}`,
        }}
      >
        <ListItemText
          primary={ticket.gym_pass_type.name}
          secondary={
            new Date(ticket.valid_from).toLocaleDateString('hu') +
            ' - ' +
            new Date(ticket.valid_to).toLocaleDateString('hu')
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default TicketListItem;
