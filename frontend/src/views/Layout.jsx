import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';

import HomeIcon from '@mui/icons-material/Home';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';

import DrawerMenu from '../components/DrawerMenu';
import DefaultAppBar from '../components/DefaultAppBar';

const bottomNavigationActions = [
  { label: 'Kezdőlap', icon: <HomeIcon />, to: '/' },
  { label: 'Jegyeim', icon: <ConfirmationNumberIcon />, to: '/tickets' },
  { label: 'Naptár', icon: <CalendarIcon />, to: '/calendar' },
  { label: 'Fiókom', icon: <ManageAccountsIcon />, to: '/account' },
];
const menuItems = [
  { label: 'Kezdőlap', icon: <HomeIcon />, to: '/' },
  { label: 'Jegyeim', icon: <ConfirmationNumberIcon />, to: '/tickets' },
  { label: 'Fiókom', icon: <ManageAccountsIcon />, to: '/account' },
  { label: 'Naptár', icon: <CalendarIcon />, to: '/calendar' },
];

const Layout = ({ renderChildren = false, children, customAppBar }) => {
  const { pathname: path } = useLocation();
  const value = bottomNavigationActions.map((a) => a.to).indexOf(path);

  const theme = useTheme();
  const smAndUp = useMediaQuery(theme.breakpoints.up('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box
      sx={{
        pb: 7,
        display: 'flex',
      }}
    >
      {customAppBar ? (
        { customAppBar }
      ) : (
        <DefaultAppBar onMenuClick={() => setDrawerOpen(!drawerOpen)} drawerOpen={drawerOpen} />
      )}
      <DrawerMenu menuItems={menuItems} open={drawerOpen} setOpen={setDrawerOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />
        {renderChildren ? { children } : <Outlet />}
      </Box>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          ...(smAndUp && { display: 'none' }),
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
        >
          {bottomNavigationActions.map((action) => (
            <BottomNavigationAction
              label={action.label}
              icon={action.icon}
              component={Link}
              to={action.to}
              key={action.to}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Layout;
