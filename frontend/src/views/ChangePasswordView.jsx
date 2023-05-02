import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { LoadingButton } from '@mui/lab'

import { changePassword } from '../fetch/fetchAuth'
import { useDispatch } from 'react-redux'
import { addMessage } from '../slices/snackbarMessagesSlice'

const ChangePasswordView = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState()

  const dispatch = useDispatch()
  const resetForm = () => {
    setOldPassword('')
    setNewPassword('')
    setNewPasswordConfirmation('')
  }

  const mutation = useMutation(changePassword, {
    onSuccess: () => {
      dispatch(
        addMessage({
          message: 'Jelszó sikeresen megváltoztatva!',
          severity: 'success',
        })
      )
      resetForm()
    },
    onError: async (error) => {
      const data = await error.json()
      setErrors(data.errors)
    },
  })

  const handleSubmit = async (event) => {
    setErrors()
    event.preventDefault()
    mutation.mutate({
      old_password: oldPassword,
      new_password: newPassword,
      confirm_new_password: newPasswordConfirmation,
    })
  }

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Typography variant="h6" mb={2}>
        Jelszó megváltoztatása
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack gap={2} mb={1}>
          <TextField
            label="Jelenlegi jelszó"
            type="password"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
            error={Boolean(errors?.old_password)}
            helperText={errors?.old_password}
            sx={{
              maxWidth: 'sm'
            }}
          />
          <TextField
            label="Új jelszó"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            error={
              Boolean(errors?.new_password) || Boolean(errors?.non_field_errors)
            }
            helperText={errors?.new_password}
            sx={{
              maxWidth: 'sm'
            }}
          />
          <TextField
            label="Új jelszó megerősítése"
            type="password"
            value={newPasswordConfirmation}
            onChange={(event) => setNewPasswordConfirmation(event.target.value)}
            error={
              Boolean(errors?.confirm_new_password) ||
              Boolean(errors?.non_field_errors)
            }
            helperText={
              errors?.confirm_new_password || errors?.non_field_errors
            }
            sx={{
              maxWidth: 'sm'
            }}
          />
        </Stack>
        <LoadingButton
          type="submit"
          variant="outlined"
          loading={mutation.isLoading}
        >
          Megváltoztat
        </LoadingButton>
      </form>
    </Box>
  )
}

export default ChangePasswordView
