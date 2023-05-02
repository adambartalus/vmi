import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Stack, Typography } from '@mui/material';
const { PUBLIC_URL } = process.env;

const WelcomeView = () => {
  return (
    <Container maxWidth="sm">
      <Stack height="100vh" gap={2} p={3} justifyContent="center" alignItems="center">
        <img src={`${PUBLIC_URL}/logo.jpg`} width="30%" alt="" />
        <Typography variant="h4" textAlign="center" marginBottom={5}>
          Sample Gym
        </Typography>
        <Button
          fullWidth
          component={Link}
          to="/login"
          variant="contained"
          sx={{
            textTransform: 'none',
          }}
        >
          Bejelentkezés
        </Button>
        <Button
          fullWidth
          variant="outlined"
          sx={{
            textTransform: 'none',
          }}
          component={Link}
          to="/register"
        >
          Fiók létrehozása
        </Button>
      </Stack>
    </Container>
  );
};

export default WelcomeView;
