import { useState } from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';

import DrawerMenu from '../components/DrawerMenu';
import { Outlet } from 'react-router-dom';

const receptionMenuItems = [
  { label: 'Irányítópult', icon: <DashboardIcon />, to: '/admin' },
  { label: 'Felhaszálók', icon: <PeopleIcon />, to: '/admin/users' },
  { label: 'Csoportok', icon: <GroupsIcon /> , to: '/admin/groups' },
];

function AdminLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleDrawerToggle}
          >
            {isDrawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin
          </Typography>
        </Toolbar>
      </AppBar>

      <Box display="flex">
        <DrawerMenu menuItems={receptionMenuItems} open={isDrawerOpen} setOpen={setIsDrawerOpen} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            maxWidth: '100vw',
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

export default AdminLayout;
