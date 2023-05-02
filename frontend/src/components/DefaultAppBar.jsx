import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import {
  Avatar,
  AppBar,
  Toolbar,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import BadgeIcon from '@mui/icons-material/Badge'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'

import { setReturnTo } from '../slices/settingSlice'
import { logoutThunk } from '../slices/authSlice'
import { Home, Logout } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { useCurrentUser } from '../hooks/useCurrentUser'

function stringToColor(string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  }
}

const DefaultAppBar = ({ onMenuClick, drawerOpen, title, children }) => {
  const { pathname: path } = useLocation()
  const user = useCurrentUser()
  const dispatch = useDispatch()

  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={onMenuClick}
        >
          {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title || 'Sample Gym'}
        </Typography>
        <>{children}</>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
          <Avatar
            {...(user.last_name &&
              user.first_name &&
              stringAvatar(user.last_name + ' ' + user.first_name))}
          />
        </IconButton>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem component={Link} to="/" onClick={handleCloseUserMenu}>
            <ListItemIcon>
              <Home fontSize="small" />
            </ListItemIcon>
            <Typography textAlign="center">Kezdőlap</Typography>
          </MenuItem>
          {user.groups.map((g) => g.name).includes('admin') && (
            <MenuItem component={Link} to="/admin">
              <ListItemIcon>
                <AdminPanelSettingsIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">Admin</Typography>
            </MenuItem>
          )}
          {user.groups.map((g) => g.name).includes('staff') && (
            <MenuItem component={Link} to="/reception">
              <ListItemIcon>
                <BadgeIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">Recepció</Typography>
            </MenuItem>
          )}
          <MenuItem
            onClick={() => dispatch(setReturnTo(path))}
            component={Link}
            to="/settings"
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <Typography textAlign="center">Beállítások</Typography>
          </MenuItem>
          <MenuItem onClick={() => dispatch(logoutThunk())}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <Typography textAlign="center">Kijelentkezés</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default DefaultAppBar
