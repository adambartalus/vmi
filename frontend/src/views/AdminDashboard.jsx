import { Container, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../fetch/fetchUsers';
import { getAvailablePadlocks } from '../fetch/fetchPadlocks';

const AdminDashboard = () => {
  const { isLoading: usersLoading, data: users, usersError } = useQuery('users', getUsers);
  const { isLoading: padlocksLoading, data: padlocks, padlockError } = useQuery('padlocks', getAvailablePadlocks);
  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        {usersLoading ? <Skeleton /> : `Teremben tartózkodik: ${users.length} fő`}
      </Typography>

      <Typography variant="h6" gutterBottom>
        {padlocksLoading ? <Skeleton /> : `Szabad lakatok: ${padlocks.length}`}
      </Typography>
    </Container>
  );
};

export default AdminDashboard;
