import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@mui/material'
import { deletePadlock } from '../fetch/fetchPadlocks'
import { useMutation } from '@tanstack/react-query'

const DeletePadlockDialog = ({ padlock, onSuccess, open, onClose, ...props }) => {
  const mutation = useMutation(deletePadlock, {
    onSuccess,
  })

  const handleSubmit = () => {
    mutation.mutate(padlock.id)
  }

  return (
    <Dialog open={open} onClose={onClose} {...props}>
      <DialogTitle>Törli a #{padlock?.padlock_id} lakatot?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>Mégsem</Button>
        <Button onClick={handleSubmit}>Törlés</Button>
      </DialogActions>
      <Backdrop sx={{ color: '#fff' }} open={mutation.isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  )
}

export default DeletePadlockDialog
