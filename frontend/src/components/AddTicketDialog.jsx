import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import AsynchronousAutocomplete from '../components/AsyncAutocomplete'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { useMutation } from '@tanstack/react-query'
import CloseIcon from '@mui/icons-material/Close'
import { getPassTypes, postTicket } from '../fetch/fetchTickets'
import { getUsers } from '../fetch/fetchUsers'

const AddTicketDialog = ({
  open,
  onClose,
  fullScreen,
  onSuccess,
  ...props
}) => {
  const [ticketType, setTicketType] = useState(null)
  const [user, setUser] = useState(null)
  const [validFrom, setValidFrom] = useState(dayjs())
  const [validTo, setValidTo] = useState(null)

  const [confirmCloseDialogOpen, setConfirmCloseDialogOpen] = useState(false)
  const [errorMessages, setErrorMessages] = useState(null)

  const resetState = () => {
    setTicketType(null)
    setUser(null)
    setValidFrom(dayjs())
    setValidTo(null)
    setErrorMessages(null)
  }

  const stateChanged = () => {
    return ticketType || user || validTo
  }

  const mutation = useMutation(postTicket, {
    onSuccess,
    onError: async (error) => {
      try {
        const data = await error.json()
        setErrorMessages(data)
      } catch (error) {
        /* empty */
      }
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    mutation.mutate({
      userId: user?.id,
      ticketTypeId: ticketType?.id,
      validFrom: validFrom.format('YYYY-MM-DD'),
    })
  }

  useEffect(() => {
    if (ticketType) {
      const validFor = dayjs.duration(ticketType.valid_for)
      setValidTo(dayjs().add(validFor).endOf('day'))
    }
  }, [ticketType])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      TransitionProps={{
        onExited: resetState,
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
                ml: 1,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Jegy létrehozása
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={handleSubmit}
              sx={{ mr: 1, textTransform: 'unset' }}
            >
              Mentés
            </Button>
          </Toolbar>
        </AppBar>
      ) : (
        <DialogTitle
          sx={{
            pb: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Jegy létrehozása
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
              <AsynchronousAutocomplete
                fetchOptions={getUsers}
                queryKey={['users']}
                getOptionLabel={(o) => o.email}
                label="Felhasználó"
                value={user}
                onChange={(event, option) => setUser(option)}
                TextFieldProps={{
                  error: Boolean(errorMessages?.owner),
                  helperText: errorMessages?.owner,
                }}
              />
            </Grid2>
            <Grid2 xs={12} mb={3}>
              <AsynchronousAutocomplete
                label="Jegytípus"
                getOptionLabel={(o) => `${o.name} - ${o.price} HUF`}
                fetchOptions={getPassTypes}
                queryKey={['ticket-types']}
                onChange={(event, option) => {
                  setTicketType(option)
                }}
                value={ticketType}
                TextFieldProps={{
                  error: Boolean(errorMessages?.gym_pass_type),
                  helperText: errorMessages?.gym_pass_type,
                }}
              />
            </Grid2>
            <Grid2 xs={12} sm={6}>
              <DatePicker
                slotProps={{ textField: { fullWidth: true } }}
                label="Érvényesség kezdete"
                value={validFrom}
                onChange={(value) => setValidFrom(value)}
              />
            </Grid2>
            <Grid2 xs={12} sm={6}>
              <DatePicker
                slotProps={{ textField: { fullWidth: true } }}
                label="Érvényesség vége"
                value={validTo}
                onChange={(value) => setValidTo(value)}
              />
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
          >
            Mégse
          </Button>
          <Button onClick={handleSubmit}>Létrehoz</Button>
        </DialogActions>
      )}
      <Dialog open={confirmCloseDialogOpen}>
        <DialogTitle>Kilépés</DialogTitle>
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
    </Dialog>
  )
}

export default AddTicketDialog
