import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import LockIcon from '@mui/icons-material/Lock';

import { signup } from '../fetch/fetchAuth';
import { Box, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const RegisterView = () => {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [feedback, setFeedback] = useState();

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setInputs((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await signup(inputs.email, inputs.password, inputs.confirm_password);
      navigate('/login', {
        state: {
          feedback: 'You have successfully signed up. You can log in now.',
          severity: 'success',
        },
      });
    } catch (error) {
      if (!error.status) {
        setFeedback({
          text: 'Nincs válasz a szervertől',
          severity: 'error',
        });
        return;
      }
      if (409 === error.status) {
        setFeedback({
          text: 'Az e-mail cím foglalt',
          severity: 'error',
        });
        setErrors({});
        return;
      }
      const errorData = await error.json();
      setLoading(false);
      setErrors(errorData);
    }
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
      {feedback && (
        <Alert id="alert" severity={feedback.severity} variant="filled" onClose={() => setFeedback(null)}>
          {feedback.text}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="E-mail cím"
            name="email"
            value={inputs.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
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
            value={inputs.password}
            onChange={handleInputChange}
            error={!!errors.password || !!errors.non_field_errors}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            type="password"
            label="Jelszó megerősítése"
            name="confirm_password"
            value={inputs.confirm_password}
            onChange={handleInputChange}
            error={Boolean(errors.confirm_password) || Boolean(errors.non_field_errors)}
            helperText={errors.confirm_password || errors.non_field_errors}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon />
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            fullWidth
            loading={loading}
            variant="contained"
            size="large"
            type="submit"
            sx={{
              textTransform: 'none',
            }}
          >
            Regisztrálok
          </LoadingButton>
        </Stack>
      </form>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'end',
          flexGrow: 1,
        }}
      >
        <Typography align="center" variant="subtitle2">
          Már van fiókod?{' '}
          <Link component={RouterLink} to="/login">
            Jelentkezz be.
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterView;
