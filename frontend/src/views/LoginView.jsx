import { useRef, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

import { loginThunk, googleLoginThunk } from '../slices/authSlice';

import { GoogleLogin } from '@react-oauth/google';
import { InputAdornment } from '@mui/material';
import { addMessage } from '../slices/snackbarMessagesSlice';
import { LoadingButton } from '@mui/lab';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loading = useSelector((state) => state.auth.loggingIn);

  const next = useRef(localStorage.next);
  localStorage.removeItem('next');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const action = await dispatch(
      loginThunk({
        email,
        password,
      }),
    );
    if (action.meta.requestStatus === 'fulfilled') {
      navigate(next.current || '/');
    } else if (action.meta.requestStatus === 'rejected') {
      if (action.error.name === 'TypeError') {
        dispatch(
          addMessage({
            message: 'Nincs válasz a szervertől',
            severity: 'error',
          }),
        );
      } else {
        dispatch(
          addMessage({
            message: 'Hibás email/jelszó',
            severity: 'error',
          }),
        );
      }
    }
  };

  const onGoogleLoginSuccess = (credentialResponse) => {
    dispatch(
      googleLoginThunk({
        credential: credentialResponse.credential,
      }),
    ).then((e) => {
      if (e.meta.requestStatus === 'fulfilled') {
        navigate(next.current || '/');
      }
    });
  };

  const onGoogleLoginFailure = () => {
    console.log('Login failed');
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        py: 4,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography align="center" variant="h4" marginBottom={3}>
        Sample Gym
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="E-mail cím"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            type="password"
            label="Jelszó"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
          <Link textAlign="end">Elfelejtett jelszó</Link>
          <LoadingButton fullWidth loading={loading} variant="contained" size="large" type="submit">
            Bejelentkezés
          </LoadingButton>
        </Stack>
      </form>
      <Divider sx={{ marginBottom: '1rem', marginTop: '1rem', alignItems: 'start' }}>vagy</Divider>
      <Stack
        gap={1}
        justifyContent="space-between"
        sx={{
          flexGrow: 1,
        }}
      >
        <div
          style={{
            margin: '0 auto',
          }}
        >
          <GoogleLogin
            onSuccess={onGoogleLoginSuccess}
            onError={onGoogleLoginFailure}
            theme="outline"
            locale="hu"
            useOneTap
          />
        </div>
        <Typography align="center" variant="subtitle2">
          Nincs még fiókod?{' '}
          <Link component={RouterLink} to="/register">
            Regisztálj.
          </Link>
        </Typography>
      </Stack>
    </Container>
  );
};

export default LoginView;
