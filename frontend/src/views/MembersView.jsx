import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getUsers } from '../fetch/fetchUsers'

import FilterDrawer from '../components/FilterDrawer'

import {
  AppBar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
  Skeleton,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

import CloseIcon from '@mui/icons-material/Close'
import FilterListIcon from '@mui/icons-material/FilterList'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'

import MemberCardList from '../components/MemberCardList'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useTheme } from '@emotion/react'
import dayjs from 'dayjs'
import { DateTimePicker } from '@mui/x-date-pickers'
import { patchVisit } from '../fetch/fetchVisits'
import ReceptionLayout from './ReceptionLayout'
import ResponsiveGridContainer from '../components/ResponsiveGridContainer'
import { useDispatch } from 'react-redux'
import { addMessage } from '../slices/snackbarMessagesSlice'

function UsersView() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const lgAndUp = useMediaQuery(theme.breakpoints.up('lg'))
  const xs = useMediaQuery(theme.breakpoints.down('sm'))

  const [filters, setFilters] = useState({ page: 1 })
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [endVisitDialogOpen, setEndVisitDialogOpen] = useState(false)
  const [visit, setVisit] = useState(null)
  const [checkOutTime, setCheckOutTime] = useState(dayjs())

  const [endVisitErrors, setEndVisitErrors] = useState()
  const { data, isLoading, refetch } = useQuery(['users', filters], () =>
    getUsers(filters)
  )
  const queryClient = useQueryClient()
  const mutation = useMutation(patchVisit, {
    onError: async (error) => {
      try {
        const data = await error.json()
        setEndVisitErrors(data)
      } catch (e) {
        /* empty */
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users', filters])
      setEndVisitDialogOpen(false)
      dispatch(
        addMessage({ message: 'Tag sikeresen kiléptetve', severity: 'success' })
      )
    },
  })
  const applyFilters = (filters) => {
    setFilters(
      Object.fromEntries(
        Object.entries(filters).filter(
          (v) => v[1] !== null && v[1] !== undefined && v[1] !== ''
        )
      )
    )
  }
  const handleCheckout = (visit) => {
    setEndVisitDialogOpen(true)
    setVisit(visit)
  }
  const handleSubmit = () => {
    mutation.mutate({
      visitId: visit.id,
      data: { check_out_time: checkOutTime.toISOString() },
    })
  }
  const handlePageChange = (event, page) => {
    setFilters((f) => ({ ...f, page }))
    window.scrollTo({
      top: 0,
    })
  }

  return (
    <ReceptionLayout
      renderChildren
      AppBarProps={{
        title: 'Tagok',
        children: (
          <>
            <IconButton color="inherit" onClick={refetch}>
              <RefreshIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            >
              {filterDrawerOpen ? <FilterListOffIcon /> : <FilterListIcon />}
            </IconButton>
          </>
        ),
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            flexGrow: 1,
            ...(lgAndUp && { marginRight: '-300px' }),
            transition: (theme) =>
              theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            ...(filterDrawerOpen && {
              transition: (theme) =>
                theme.transitions.create('margin', {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              marginRight: 0,
            }),
          }}
        >
          {isLoading ? (
            <ResponsiveGridContainer>
              {new Array(12).fill(0).map((v, i) => (
                <Grid key={i} xs={4} sm={8} md={6} lg={4}>
                  <Skeleton variant="rounded" height={200} />
                </Grid>
              ))}
            </ResponsiveGridContainer>
          ) : (
            <MemberCardList users={data.results} onCheckout={handleCheckout} />
          )}
          {data &&
            (data.results.length > 0 ? (
              <Box display="flex" justifyContent="center" pt={1} pb={3}>
                <Pagination
                  showFirstButton
                  showLastButton
                  color="primary"
                  size="large"
                  page={filters.page}
                  onChange={handlePageChange}
                  count={Math.ceil(data.count / 12)}
                />
              </Box>
            ) : (
              <Typography align="center">Nincs találat</Typography>
            ))}
        </Box>
        <FilterDrawer
          filters={filters}
          setFilters={applyFilters}
          open={filterDrawerOpen}
          setOpen={setFilterDrawerOpen}
        />
        {visit && (
          <Dialog
            open={endVisitDialogOpen}
            onClose={() => setEndVisitDialogOpen(false)}
            fullScreen={xs}
            TransitionProps={{
              onExited: () => setEndVisitErrors(),
            }}
          >
            {xs ? (
              <AppBar
                color="inherit"
                position="relative"
                enableColorOnDark
                elevation={0}
              >
                <Toolbar disableGutters>
                  <IconButton
                    color="inherit"
                    onClick={() => setEndVisitDialogOpen(false)}
                    aria-label="close"
                    sx={{
                      p: 0,
                      ml: 2,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography
                    sx={{ ml: 2, flex: 1 }}
                    variant="h6"
                    component="div"
                  >
                    Tag kiléptetése
                  </Typography>
                  <Button
                    autoFocus
                    color="inherit"
                    onClick={handleSubmit}
                    sx={{
                      mr: 1,
                    }}
                  >
                    Kiléptet
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
                Tag kijelentkeztetése
              </DialogTitle>
            )}
            <DialogContent>
              <Typography>Tag adatai</Typography>
              {visit.user.last_name && visit.user.first_name && (
                <Typography fontWeight="bold" m={1}>
                  Név: {visit.user.last_name + ' ' + visit.user.first_name}
                </Typography>
              )}
              <Typography fontWeight="bold" m={1}>
                E-mail cím: {visit.user.email}
              </Typography>
              <Typography my={1}>
                Használt lakat: #{visit.padlock.padlock_id} -
                {visit.padlock.text}
              </Typography>
              <Typography my={1}>
                Belépés ideje:{' '}
                {dayjs(visit.check_in_time).toDate().toLocaleString()}
              </Typography>
              <DateTimePicker
                label="Távozás ideje"
                value={checkOutTime}
                onChange={(value) => setCheckOutTime(value)}
                slotProps={{
                  textField: {
                    error: Boolean(endVisitErrors),
                    helperText: endVisitErrors?.non_field_errors,
                    fullWidth: xs,
                  },
                }}
                sx={{
                  mt: 2,
                }}
              />
            </DialogContent>
            {!xs && (
              <DialogActions>
                <Button onClick={handleSubmit}>Kijelentkeztet</Button>
              </DialogActions>
            )}
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={mutation.isLoading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </Dialog>
        )}
      </Box>
    </ReceptionLayout>
  )
}

export default UsersView
