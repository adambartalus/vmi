import { useState } from 'react'
import { useDispatch } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import LoadingButton from '@mui/lab/LoadingButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import GoogleIcon from '@mui/icons-material/Google'
import SaveIcon from '@mui/icons-material/Save'

import ChangePasswordView from './ChangePasswordView'
import SetPasswordView from './SetPasswordView'

import { useCurrentUser } from '../hooks/useCurrentUser'
import { patchUserThunk } from '../slices/authSlice'
import { addMessage } from '../slices/snackbarMessagesSlice'

const Account = () => {
  const user = useCurrentUser()
  const dispatch = useDispatch()

  const googleConnected = user.auth_providers.includes('google')
  const [patchingUser, setPatchingUser] = useState(false)

  const [userData, setUserData] = useState({
    email: user?.email,
    first_name: user?.first_name,
    last_name: user?.last_name,
  })

  const handleSave = async () => {
    setPatchingUser(true)
    const resp = await dispatch(
      patchUserThunk({
        first_name: userData.first_name,
        last_name: userData.last_name,
      })
    )
    if (resp.meta.requestStatus === 'fulfilled') {
      dispatch(
        addMessage({
          message: 'Az adatok sikeresen frissítve',
          severity: 'success',
        })
      )
    } else if (resp.meta.requestStatus === 'rejected') {
      dispatch(
        addMessage({
          message: 'Hiba történt az adatok módosítása során',
          severity: 'error',
        })
      )
    }
    setPatchingUser(false)
  }

  return (
    <Container>
      <Box>
        <Typography variant="h5" my={2}>
          Személyes adatok
        </Typography>
        <Stack gap={3} my={2} maxWidth="sm">
          <Stack direction="row" gap={2}>
            <TextField
              fullWidth
              label="Vezetéknév"
              value={userData.last_name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, last_name: e.target.value }))
              }
            />
            <TextField
              fullWidth
              label="Keresztnév"
              value={userData.first_name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, first_name: e.target.value }))
              }
            />
          </Stack>
          <TextField
            fullWidth
            disabled
            label="E-mail cím"
            value={userData.email}
          />
        </Stack>
        <Stack width="fit-content" gap={1}>
          <LoadingButton
            loading={patchingUser}
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={
              userData.first_name === user.first_name &&
              userData.last_name === user.last_name
            }
          >
            Mentés
          </LoadingButton>
          <Button
            disabled={googleConnected}
            variant="contained"
            color={googleConnected ? 'success' : 'secondary'}
            startIcon={<GoogleIcon />}
            // onClick={() => googleLogin()}
          >
            {googleConnected
              ? 'Google csatlakoztatva'
              : 'Google fiók csatlakoztatása'}
          </Button>
        </Stack>
      </Box>
      <Box mt={2}>
        <Typography variant="h5" mb={1}>
          Jelszókezelés
        </Typography>
        {user.is_password_set ? <ChangePasswordView /> : <SetPasswordView />}
      </Box>
    </Container>
  )
}
export default Account
