import React, { useEffect, useMemo } from 'react'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { initializeUser } from './slices/authSlice'
import { setInstallEvent } from './slices/settingSlice'
import {
  Backdrop,
  CircularProgress,
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { huHU } from '@mui/x-data-grid'
import { huHU as hu } from '@mui/material/locale'

import { useCurrentUser } from './hooks/useCurrentUser'

import Layout from './views/Layout'
import LoginView from './views/LoginView'
import MembersView from './views/MembersView'
import Account from './views/Account'
import Padlocks from './views/Padlocks'
import TicketView from './views/TicketView'
import TicketsView from './views/TicketsView'
import HomeView from './views/HomeView'
import ChangePasswordView from './views/ChangePasswordView'
import WelcomeView from './views/WelcomeView'
import RegisterView from './views/RegisterView'
import CalendarView from './views/CalendarView'
import SettingsView from './views/SettingsView'

import './App.css'
import 'dayjs/locale/hu'
import UsersView from './views/UsersView'
import ReceptionLayout from './views/ReceptionLayout'
import Dashboard from './views/Dashboard'
import TicketTypesView from './views/TicketTypesView'
import AdminLayout from './views/AdminLayout'
import AdminDashboard from './views/AdminDashboard'
import SnackbarNotification from './components/SnackbarNotification'
import GroupsView from './views/GroupsView'

function AuthenticatedRoute({ children, allow }) {
  const currentUser = useCurrentUser()
  const fetchingUserData = useSelector((state) => state.auth.fetchingUserData)
  const loggingOut = useSelector((state) => state.auth.loggingOut)
  if (fetchingUserData || loggingOut) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }
  if (!allow(currentUser)) {
    // Redirect to the login page if the user is not authenticated
    return <Navigate to="/welcome" />
  }
  // Render the component if the user is authenticated
  return <>{children}</>
}
function AdminRoute({ children }) {
  return (
    <AuthenticatedRoute
      allow={(user) => user && user.groups.map((g) => g.name).includes('admin')}
    >
      {children}
    </AuthenticatedRoute>
  )
}
function ReceptionRoute({ children }) {
  return (
    <AuthenticatedRoute
      allow={(user) => user && user.groups.map((g) => g.name).includes('staff')}
    >
      {children}
    </AuthenticatedRoute>
  )
}

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  useEffect(() => {
    window.addEventListener('beforeinstallprompt',  (beforeInstallPromptEvent) => {
      beforeInstallPromptEvent.preventDefault();
      dispatch(setInstallEvent(beforeInstallPromptEvent));
    });
  }, [dispatch])

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const mode = useSelector((state) => state.settings.mode)
  const theme = useMemo(
    () =>
      createTheme(
        {
          palette: {
            mode:
              mode === 'system' ? (prefersDarkMode ? 'dark' : 'light') : mode,
          },
          components: {
            MuiButton: {
              styleOverrides: {
                root: {
                  textTransform: 'none',
                },
              },
            },
          },
        },
        hu,
        huHU
      ),
    [mode, prefersDarkMode]
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="hu">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <AuthenticatedRoute allow={(user) => Boolean(user)}>
                  <Layout />
                </AuthenticatedRoute>
              }
            >
              <Route index element={<HomeView />} />
              <Route path="account" element={<Account />} />
              <Route path="tickets" element={<TicketsView />} />
              <Route path="change-password" element={<ChangePasswordView />} />
              <Route path="calendar" element={<CalendarView />} />
              <Route path="users" element={<UsersView />} />
            </Route>
            <Route path="tickets/:id" element={<TicketView />} />
            <Route
              path="/reception"
              element={
                <ReceptionRoute>
                  <ReceptionLayout />
                </ReceptionRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="ticket-types" element={<TicketTypesView />} />
            </Route>
            <Route
              path="/reception/members"
              element={
                <ReceptionRoute>
                  <MembersView />
                </ReceptionRoute>
              }
            />
            <Route
              path="/reception/padlocks"
              element={
                <ReceptionRoute>
                  <Padlocks />
                </ReceptionRoute>
              } />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UsersView />} />
              <Route path="groups" element={<GroupsView />} />
            </Route>
            <Route path="welcome" element={<WelcomeView />} />
            <Route path="login" element={<LoginView />} />
            <Route path="register" element={<RegisterView />} />
            <Route path="settings" element={<SettingsView />} />
          </Routes>
        </BrowserRouter>
        <SnackbarNotification />
      </ThemeProvider>
    </LocalizationProvider>
  )
}

export default App
