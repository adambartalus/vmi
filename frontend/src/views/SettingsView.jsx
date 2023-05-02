import { ArrowBack } from '@mui/icons-material'
import {
  AppBar,
  Button,
  IconButton,
  List,
  ListItem,
  ListSubheader,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setColorMode } from '../slices/settingSlice'

import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import ComputerIcon from '@mui/icons-material/Computer'

const SettingsView = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const returnTo = useSelector((state) => state.settings.returnTo)
  const installEvent = useSelector((state) => state.settings.installEvent)

  const mode = useSelector((state) => state.settings.mode)


  const handleInstall = () => {
    if(!installEvent) return;
    installEvent.prompt();
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => navigate(returnTo || '/')}
            sx={{ mr: 1 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">Beállítások</Typography>
        </Toolbar>
      </AppBar>
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        subheader={<ListSubheader>Megjelenés</ListSubheader>}
      >
        <ListItem>
          <ToggleButtonGroup
            exclusive
            value={mode}
            onChange={(event, newValue) => dispatch(setColorMode(newValue))}
          >
            <ToggleButton value="light" sx={{ flexDirection: 'column' }}>
              <LightModeIcon />
              <Typography variant="caption">Világos</Typography>
            </ToggleButton>
            <ToggleButton value="dark" sx={{ flexDirection: 'column' }}>
              <DarkModeIcon />
              <Typography variant="caption">Sötét</Typography>
            </ToggleButton>
            <ToggleButton value="system" sx={{ flexDirection: 'column' }}>
              <ComputerIcon />
              <Typography variant="caption">Rendszer</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </ListItem>
        <ListItem>
          {
            installEvent && 
            <Button onClick={handleInstall}>
              App telepítése
            </Button>
          }
        </ListItem>
      </List>
    </>
  )
}

export default SettingsView
