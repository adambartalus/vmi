import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import dayjs from 'dayjs'

import { postTicketType } from '../fetch/fetchTickets'
import { Backdrop, CircularProgress, DialogActions } from '@mui/material'
import { useDispatch } from 'react-redux'
import { addMessage } from '../slices/snackbarMessagesSlice'

const AddPassTypeDialog = ({ open, onClose, fullScreen, ...props }) => {
  const [confirmCloseDialogOpen, setConfirmCloseDialogOpen] = useState(false)
  const [name, setName] = useState(null)
  const [validFor, setValidFor] = useState(null)
  const [unit, setUnit] = useState({ value: 'days', label: 'nap' })
  const [price, setPrice] = useState(null)
  const [visitLimit, setVisitLimit] = useState(null)
  const [purchasable, setPurchasable] = useState(true)
  const [unitAnchor, setUnitAnchor] = useState(null)
  const [description, setDescription] = useState(null)
  const [descriptionArea, setDescriptionArea] = useState(false)
  const [errorMessages, setErrorMessages] = useState(null)

  const dispatch = useDispatch()
  const mutation = useMutation(postTicketType, {
    onError: async (error) => {
      try {
        const data = await error.json()
        setErrorMessages(data)
      } catch (error) {
        /* empty */
      }
    },
    onSuccess: () => {
      onClose()
      dispatch(
        addMessage({
          message: 'Jegytípus sikeresen létrehozva',
          severity: 'success',
        })
      )
    },
  })
  const stateChanged = () =>
    name || validFor || price || visitLimit || description
  const resetState = () => {
    setName(null)
    setValidFor(null)
    setPrice(null)
    setVisitLimit(null)
    setPurchasable(true)
    setDescription(null)
    setUnit({ value: 'days', label: 'nap' })
    setErrorMessages(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const duration = validFor !== null && validFor !== '' ? dayjs.duration(validFor, unit.value) : null
    mutation.mutate({
      name,
      validFor: duration ? `P${duration.asDays()}D` : null,
      price,
      purchasable,
      visitLimit: visitLimit.trim() === '' ? null : visitLimit,
    })
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      TransitionProps={{
        onExited: () => resetState(),
      }}
      {...props}
    >
      {fullScreen ? (
        <AppBar
          color="inherit"
          position="relative"
          enableColorOnDark
          elevation={0}
        >
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              onClick={() => {
                if (stateChanged()) setConfirmCloseDialogOpen(true)
                else onClose()
              }}
              aria-label="close"
              sx={{
                p: 0,
                ml: 2,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Új jegytípus
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={handleSubmit}
              sx={{
                mr: 1,
              }}
            >
              Mentés
            </Button>
          </Toolbar>
        </AppBar>
      ) : (
        <DialogTitle
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          sx={{
            pb: 0,
          }}
        >
          <span>Új jegytípus</span>
          <IconButton
            color="inherit"
            onClick={() => {
              if (stateChanged()) setConfirmCloseDialogOpen(true)
              else onClose()
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid2 spacing={{ xs: 2, md: 3 }} container>
            <Grid2 xs={12}>
              <TextField
                fullWidth
                label="Név"
                value={name || ''}
                onChange={(e) => setName(e.target.value)}
                error={Boolean(errorMessages?.name)}
                helperText={errorMessages?.name}
              />
            </Grid2>
            <Grid2 xs={12}>
              <TextField
                fullWidth
                label="Ár"
                error={Boolean(errorMessages?.price)}
                helperText={errorMessages?.price}
                value={price || ''}
                onChange={(e) => {
                  setPrice(e.target.value)
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">HUF</InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 xs={12} sm={6}>
              <TextField
                fullWidth
                label="Érvényesség"
                error={Boolean(errorMessages?.valid_for)}
                helperText={errorMessages?.valid_for}
                value={validFor || ''}
                onChange={(e) => setValidFor(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Box>
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => setUnitAnchor(e.currentTarget)}
                      >
                        {unit.label}
                      </span>
                      <Menu
                        anchorEl={unitAnchor}
                        open={Boolean(unitAnchor)}
                        onClose={() => setUnitAnchor(null)}
                      >
                        <MenuItem
                          onClick={() => {
                            setUnit({ value: 'days', label: 'nap' })
                            setUnitAnchor(null)
                          }}
                        >
                          nap
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setUnit({ value: 'weeks', label: 'hét' })
                            setUnitAnchor(null)
                          }}
                        >
                          hét
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setUnit({ value: 'months', label: 'hónap' })
                            setUnitAnchor(null)
                          }}
                        >
                          hónap
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setUnit({ value: 'years', label: 'év' })
                            setUnitAnchor(null)
                          }}
                        >
                          év
                        </MenuItem>
                      </Menu>
                    </Box>
                  ),
                }}
              />
            </Grid2>
            <Grid2 xs={12} sm={6}>
              <TextField
                fullWidth
                label="Alkalom korlát"
                error={Boolean(errorMessages?.visit_limit)}
                helperText={errorMessages?.visit_limit}
                value={visitLimit || ''}
                onChange={(e) => {
                  setVisitLimit(e.target.value)
                }}
              />
            </Grid2>
            <Grid2 xs={6}>
              <FormControlLabel
                label="Vásárolható"
                control={
                  <Checkbox
                    label="Vásárolható"
                    checked={Boolean(purchasable)}
                    onChange={(e) => setPurchasable(e.target.checked)}
                  />
                }
              />
            </Grid2>
            <Grid2 xs={6} display="flex" justifyContent="end">
              <Button
                startIcon={<AddIcon />}
                onClick={() => setDescriptionArea(!descriptionArea)}
              >
                Leírás megadása
              </Button>
            </Grid2>
            <Grid2 xs={12}>
              <Collapse in={descriptionArea}>
                <TextField
                  multiline
                  fullWidth
                  label="Leírás"
                  value={description || ''}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{ mb: 1 }}
                />
              </Collapse>
            </Grid2>
          </Grid2>
        </Box>
      </DialogContent>
      {!fullScreen && (
        <DialogActions>
          <Button
            onClick={() => {
              if (stateChanged()) setConfirmCloseDialogOpen(true)
              else onClose()
            }}
            variant='outlined'
          >
            Mégse
          </Button>
          <Button variant='contained' onClick={handleSubmit}>Mentés</Button>
        </DialogActions>
      )}
      <Dialog open={confirmCloseDialogOpen}>
        <DialogTitle>Megszakítás</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmCloseDialogOpen(false)}>
            Mégse
          </Button>
          <Button
            onClick={() => {
              setConfirmCloseDialogOpen(false)
              onClose()
            }}
          >
            Megszakít
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={mutation.isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  )
}

export default AddPassTypeDialog
