import React from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';

const CustomAppBar = ({ children, onMenuClick, drawerOpen, title }) => {
  // const { pathname: path } = useLocation();
  // const user = useCurrentUser();
  // const dispatch = useDispatch();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={onMenuClick}>
          {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title ? title : 'Sample Gym'}
        </Typography>
        <>{children}</>
        {/* <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              {...(user.last_name &&
                user.first_name &&
                stringAvatar(user.last_name + " " + user.first_name))}
            />
          </IconButton>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {user.groups.includes("staff") && (
              <MenuItem component={Link} to="/reception">
                <ListItemIcon>
                  <BadgeIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">Recepció</Typography>
              </MenuItem>
            )}
            <MenuItem
              onClick={(e) => dispatch(setReturnTo(path))}
              component={Link}
              to="/settings"
            >
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">Beállítások</Typography>
            </MenuItem>
            <MenuItem onClick={(e) => dispatch(logoutThunk())}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">Kijelentkezés</Typography>
            </MenuItem>
          </Menu> */}
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
