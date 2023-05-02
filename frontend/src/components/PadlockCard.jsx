import React, { useState } from 'react'
import {
  Badge,
  Card,
  CardHeader,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Delete, Edit } from '@mui/icons-material'

const PadlockCard = ({ padlock, onEditClick, onDeleteClick, ...props }) => {
  const [isStatusOverflowing, setIsStatusOverflowing] = useState(false)
  const [isMottoOverflowing, setIsMottoOverflowing] = useState(false)

  const [anchorElPadlock, setAnchorElPadlock] = useState(null)

  const handleOpenPadlockMenu = (event) => {
    setAnchorElPadlock(event.currentTarget)
  }
  const handleClosePadlockMenu = () => {
    setAnchorElPadlock(null)
  }

  return (
    <Card {...props} sx={{ position: 'relative' }}>
      <CardHeader
        disableTypography
        sx={{
          '& .MuiCardHeader-content': { width: '100%' },
        }}
        title={
          <Stack direction="row" alignItems="center" gap={1}>
            <span>{`#${padlock.padlock_id}`}</span>
            <Tooltip open={isMottoOverflowing} title={padlock.text}>
              <Typography
                variant="h5"
                noWrap
                sx={{
                  fontStyle: 'italic',
                  flexGrow: 1,
                }}
                onMouseOver={(e) => {
                  setIsMottoOverflowing(
                    e.target.offsetWidth < e.target.scrollWidth
                  )
                }}
                onMouseOut={() => setIsMottoOverflowing(false)}
              >
                {padlock.text}
              </Typography>
            </Tooltip>
            <IconButton onClick={handleOpenPadlockMenu}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-padlock"
              anchorEl={anchorElPadlock}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElPadlock)}
              onClose={handleClosePadlockMenu}
            >
              <MenuItem
                onClick={() => {
                  onEditClick()
                  handleClosePadlockMenu()
                }}
              >
                <ListItemIcon>
                  <Edit />
                </ListItemIcon>
                Szerkesztés
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDeleteClick()
                  handleClosePadlockMenu()
                }}
              >
                <ListItemIcon>
                  <Delete />
                </ListItemIcon>
                Törlés
              </MenuItem>
            </Menu>
          </Stack>
        }
        subheader={
          <Stack direction="row" alignItems="center" gap={1} pl={1}>
            <Badge
              color={padlock.used_by ? 'error' : 'success'}
              variant="dot"
              sx={{
                display: 'inline-block',
                zIndex: 0,
              }}
            />
            <Tooltip
              open={isStatusOverflowing}
              title={
                padlock.used_by ? `Használatban - ${padlock.used_by}` : 'Szabad'
              }
              onMouseOver={(e) => {
                setIsStatusOverflowing(
                  e.target.offsetWidth < e.target.scrollWidth
                )
              }}
              onMouseOut={() => setIsStatusOverflowing(false)}
            >
              <Typography noWrap>
                {padlock.used_by
                  ? `Használatban - ${padlock.used_by}`
                  : 'Szabad'}
              </Typography>
            </Tooltip>
          </Stack>
        }
      />
    </Card>
  )
}

export default PadlockCard
