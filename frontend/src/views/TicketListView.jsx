import { useQuery } from '@tanstack/react-query';

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import TicketList from '../components/TicketList';
import { getPasses } from '../fetch/fetchTickets';
import { Typography } from '@mui/material';

const TicketListView = ({ valid }) => {
  const { isLoading, data, error } = useQuery(['passes', { valid }], () => {
    return getPasses(valid);
  });
  if (isLoading)
    return (
      <Stack spacing={1}>
        <Skeleton variant="rectangular" height={70} />
        <Skeleton variant="rectangular" height={70} />
        <Skeleton variant="rectangular" height={70} />
      </Stack>
    );
  if (error) return <h2>Hiba a jegyek betöltése során</h2>;
  if (data.length === 0) return (
    <Typography align='center' padding={2}>
      Nincs {valid ? 'érvényes' : 'lejárt'} jegyed/bérleted
    </Typography>
  )
  return  <TicketList tickets={data} />;
};

export default TicketListView;
