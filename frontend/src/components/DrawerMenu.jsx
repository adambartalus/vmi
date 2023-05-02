import { Link, useLocation } from 'react-router-dom'

import { styled } from '@mui/material/styles'

import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import { SwipeableDrawer, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Logout } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { logoutThunk } from '../slices/authSlice'
import { useCurrentUser } from '../hooks/useCurrentUser'

const drawerWidth = 250

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  // padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const Drawer = styled(SwipeableDrawer, { shouldForwardProp: (prop) => prop })(
  ({ theme, open, variant }) => ({
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': { width: drawerWidth },
    ...(open &&
      variant === 'permanent' && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
    ...(!open &&
      variant === 'permanent' && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    ...(variant === 'temporary' && {
      zIndex: theme.zIndex.drawer + 2,
    }),
  })
)

export default function MiniDrawer({ menuItems, open, setOpen, ...props }) {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { pathname: path } = useLocation()

  const user = useCurrentUser()

  const md = useMediaQuery(theme.breakpoints.up('md'))
  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <Drawer
      variant={md ? 'permanent' : 'temporary'}
      anchor="left"
      open={open}
      {...props}
      onClose={() => setOpen(false)}
      onClick={(event) => {
        if (md) return
        if (
          event.type === 'keydown' &&
          (event.key === 'Tab' || event.key === 'Shift')
        ) {
          return
        }
        setOpen(false)
      }}
      onOpen={() => setOpen(true)}
    >
      <DrawerHeader
        sx={{
          borderBottom: '1px solid grey',
          boxSizing: 'border-box',
        }}
      >
        {md && (
          <IconButton
            onClick={handleDrawerClose}
            sx={{
              ...(!open && { display: 'none' }),
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </DrawerHeader>
      <List
        sx={{
          mx: 'auto',
          width: '100%',
          p: 0,
        }}
      >
        {menuItems.map(({ to, label, icon }) => (
          <ListItem key={to} dense disablePadding>
            <ListItemButton
              to={to}
              component={Link}
              selected={path === to}
              sx={{
                py: 2,
                m: 0.8,
                borderRadius: '10px',
                ...(md &&
                  !open && {
                    justifyContent: 'center',
                  }),
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open || !md ? 3 : 0,
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                sx={{
                  ...(!(open || !md) && { opacity: 0 }),
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <ListItem
        disablePadding
        divider
        sx={{
          ...(!user && { display: 'none' }),
          position: 'absolute',
          bottom: 0,
        }}
      >
        <ListItemButton
          sx={{
            py: 2,
          }}
          onClick={() => dispatch(logoutThunk())}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open || !md ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary={'Kijelentkezés'}
            sx={{
              opacity: open || !md ? 1 : 0,
            }}
            primaryTypographyProps={{
              noWrap: true,
            }}
          />
        </ListItemButton>
      </ListItem>
    </Drawer>
  )
}
