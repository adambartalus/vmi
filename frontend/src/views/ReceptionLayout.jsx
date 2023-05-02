import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import LockIcon from '@mui/icons-material/Lock';
import PeopleIcon from '@mui/icons-material/People';

import DrawerMenu from '../components/DrawerMenu';
import { Outlet } from 'react-router-dom';
import { LocalActivity } from '@mui/icons-material';
import DefaultAppBar from '../components/DefaultAppBar';

const receptionMenuItems = [
  { label: 'Irányítópult', icon: <DashboardIcon />, to: '/reception' },
  { label: 'Lakatok', icon: <LockIcon />, to: '/reception/padlocks' },
  { label: 'Tagok', icon: <PeopleIcon />, to: '/reception/members' },
  {
    label: 'Jegytípusok',
    icon: <LocalActivity />,
    to: '/reception/ticket-types',
  },
];

function ReceptionLayout({ renderChildren = false, children, AppBarProps }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  return (
    <>
      <DefaultAppBar onMenuClick={handleDrawerToggle} drawerOpen={isDrawerOpen} title="Recepció" {...AppBarProps} />
      <Box display="flex" sx={{ maxWidth: '100vw', }}>
        <DrawerMenu menuItems={receptionMenuItems} open={isDrawerOpen} setOpen={setIsDrawerOpen} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
          }}
        >
          <Toolbar />
          {renderChildren ? <>{children}</> : <Outlet />}
        </Box>
      </Box>
    </>
  );
}

export default ReceptionLayout;
