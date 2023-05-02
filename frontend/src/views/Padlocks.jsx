import {
  Box,
  Button,
  Fab,
  IconButton,
  Pagination,
  Skeleton,
  Stack,
  useMediaQuery,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import AddPadlockDialog from '../components/AddPadlockDialog'

import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import FilterListIcon from '@mui/icons-material/FilterList'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'

import ResponsiveGridContainer from '../components/ResponsiveGridContainer'
import PadlockCard from '../components/PadlockCard'
import Typography from '@mui/material/Typography'
import { useTheme } from '@emotion/react'
import { getPadlocks } from '../fetch/fetchPadlocks'
import DeletePadlockDialog from '../components/DeletePadlockDialog'
import EditPadlockDialog from '../components/EditPadlockDialog'
import { useDispatch } from 'react-redux'
import { addMessage } from '../slices/snackbarMessagesSlice'
import ReceptionLayout from './ReceptionLayout'
import PadlockFilterDrawer from '../components/PadlockFilterDrawer'

const Padlocks = () => {
  const [addPadlockDialogOpen, setAddPadlockDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [padlockToEdit, setPadlockToEdit] = useState()
  const [padlockToDelete, setPadlockToDelete] = useState()
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [filters, setFilters] = useState({ page: 1 })

  const queryClient = useQueryClient()
  const theme = useTheme()
  const dispatch = useDispatch()
  const mdAndUp = useMediaQuery(theme.breakpoints.up('md'))
  const xs = useMediaQuery(theme.breakpoints.down('sm'))
  const lgAndUp = useMediaQuery(theme.breakpoints.up('lg'))

  const [page, setPage] = useState(1)

  const handlePageChange = (event, page) => {
    setPage(page)
    window.scrollTo({
      top: 0,
    })
  }
  const handleAddSuccess = () => {
    dispatch(
      addMessage({ message: 'Lakat sikeresen hozzáadva', severity: 'success' })
    )
    setAddPadlockDialogOpen(false)
    queryClient.invalidateQueries(['padlocks', filters])
  }

  const handleDeleteSuccess = () => {
    dispatch(
      addMessage({ message: 'Lakat sikeresen törölve', severity: 'success' })
    )
    setDeleteDialogOpen(false)
    queryClient.invalidateQueries(['padlocks', filters])
  }
  const handleEditSuccess = () => {
    setEditDialogOpen(false)
    dispatch(
      addMessage({ message: 'Lakat sikeresen módosítva', severity: 'success' })
    )
    queryClient.invalidateQueries(['padlocks', filters])
  }
  const applyFilters = (filters) => {
    setFilters(
      Object.fromEntries(
        Object.entries(filters).filter(
          (v) => v[1] !== null && v[1] !== undefined && v[1] !== ''
        )
      )
    )
  }

  const { isLoading, data, refetch } = useQuery(['padlocks', filters], () =>
    getPadlocks(filters)
  )

  useEffect(() => {
    if (padlockToEdit) setEditDialogOpen(true)
  }, [padlockToEdit])
  useEffect(() => {
    if (padlockToDelete) setDeleteDialogOpen(true)
  }, [padlockToDelete])

  return (
    <ReceptionLayout
      renderChildren
      AppBarProps={{
        title: 'Lakatok',
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
            maxWidth: '100vw',
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
          {mdAndUp && (
            <Stack direction="row" justifyContent="end" m={3} px={3}>
              <Button
                variant="contained"
                onClick={() => setAddPadlockDialogOpen(true)}
              >
                Lakat hozzáadása
              </Button>
            </Stack>
          )}
          <ResponsiveGridContainer>
            {isLoading
              ? new Array(12).fill(0).map((v, index) => (
                  <Grid key={index} xs={4} sm={4} md={4} lg={3}>
                    <Skeleton variant="rectangular" height={100} />
                  </Grid>
                ))
              : data.results.map((l) => (
                  <Grid key={l.id} xs={4} sm={4} md={6} lg={3}>
                    <PadlockCard
                      padlock={l}
                      onEditClick={() => setPadlockToEdit(l)}
                      onDeleteClick={() => setPadlockToDelete(l)}
                    />
                  </Grid>
                ))}
          </ResponsiveGridContainer>
          {data &&
            (data.results.length > 0 ? (
              <Box display="flex" justifyContent="center" pt={1} pb={3}>
                <Pagination
                  color="primary"
                  size={mdAndUp ? 'large' : 'medium'}
                  page={page}
                  onChange={handlePageChange}
                  count={Math.ceil(data.count / 12)}
                />
              </Box>
            ) : (
              <Typography align="center">Nincs találat</Typography>
            ))}
        </Box>
        <PadlockFilterDrawer
          filters={filters}
          setFilters={applyFilters}
          open={filterDrawerOpen}
          setOpen={setFilterDrawerOpen}
        />
        <AddPadlockDialog
          fullScreen={xs}
          open={addPadlockDialogOpen}
          onClose={() => setAddPadlockDialogOpen(false)}
          onSuccess={handleAddSuccess}
        />
        <EditPadlockDialog
          fullScreen={xs}
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          padlock={padlockToEdit}
          onSuccess={handleEditSuccess}
          TransitionProps={{
            onExited: () => setPadlockToEdit(null),
          }}
        />
        <DeletePadlockDialog
          fullScreen={xs}
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          padlock={padlockToDelete}
          onSuccess={handleDeleteSuccess}
          TransitionProps={{
            onExited: () => setPadlockToDelete(),
          }}
        />
        {!mdAndUp && (
          <Fab
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
            color="primary"
            onClick={() => setAddPadlockDialogOpen(true)}
          >
            <AddIcon />
          </Fab>
        )}
      </Box>
    </ReceptionLayout>
  )
}

export default Padlocks
