import React, { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import {
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Skeleton,
  TableContainer,
  TablePagination,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import Container from '@mui/material/Container'
import Fab from '@mui/material/Fab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'

import AddIcon from '@mui/icons-material/Add'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import dayjs from 'dayjs'

import { getPassTypes } from '../fetch/fetchTickets'

import AddPassTypeDialog from '../components/AddPassTypeDialog'
import { Transition } from '../utils/Transition'

const headers = [
  {
    title: 'Név',
    key: 'name',
    width: '20%',
  },
  {
    title: 'Érvényesség',
    key: 'valid_for',
    align: 'right',
  },
  {
    title: 'Alkalom korlát',
    key: 'visit_limit',
    align: 'right',
  },
  {
    title: 'Vásárolható',
    key: 'purchasable',
    align: 'center',
  },
  {
    title: 'Ár',
    key: 'price',
    align: 'right',
  },
]

const TicketTypesView = () => {
  const theme = useTheme()
  const mdAndUp = useMediaQuery(theme.breakpoints.up('md'))
  const xs = useMediaQuery(theme.breakpoints.down('sm'))

  const [dialogOpen, setDialogOpen] = useState(false)

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [order, setOrder] = useState()
  const [orderBy, setOrderBy] = useState()

  const [openRowId, setOpenRowId] = useState(null)

  const { isLoading, data } = useQuery(
    ['pass-types', { page, pageSize, ...(orderBy && { orderBy, order }) }],
    () =>
      getPassTypes({
        page: page + 1,
        page_size: pageSize,
        ...(orderBy && { sort: `${orderBy},${order}` }),
      })
  )

  const handlePageChange = (event, page) => setPage(page)
  const handlePageSizeChange = (event) => setPageSize(event.target.value)

  const createSortHandler = (newOrderBy) => (event) => {
    handleRequestSort(event, newOrderBy)
  }
  const handleRequestSort = useCallback(
    (event, newOrderBy) => {
      const isAsc = orderBy === newOrderBy && order === 'asc'
      const toggledOrder = isAsc ? 'desc' : 'asc'
      setOrder(toggledOrder)
      setOrderBy(order === 'desc' ? null : newOrderBy)
    },
    [order, orderBy]
  )

  return (
    <Container
      sx={{
        pt: 2,
        ...(!mdAndUp && {
          p: 0,
        }),
        maxHeight: '75vh',
      }}
    >
      {mdAndUp && (
        <Box sx={{ my: 2, display: 'flex', justifyContent: 'end' }}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setDialogOpen(true)}
          >
            Új jegytípus
          </Button>
        </Box>
      )}
      <Paper
        sx={{
          maxHeight: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          ...(!mdAndUp && {
            mb: 6,
          }),
        }}
      >
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell />
                {headers.map((h) => (
                  <TableCell
                    key={h.key}
                    align={h.align}
                    width={h.width}
                    sortDirection={orderBy === h.key ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === h.key}
                      direction={order}
                      onClick={createSortHandler(h.key)}
                    >
                      {h.title}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? new Array(pageSize).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={headers.length + 1}>
                        <Skeleton />
                      </TableCell>
                    </TableRow>
                  ))
                : data.results.map((ticketType) => (
                    <React.Fragment key={ticketType.id}>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => {
                              if (openRowId !== ticketType.id) {
                                setOpenRowId(ticketType.id)
                              } else {
                                setOpenRowId(null)
                              }
                            }}
                          >
                            {openRowId === ticketType.id ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>{ticketType.name}</TableCell>
                        <TableCell align="right">
                          {ticketType.valid_for
                            ? dayjs.duration(ticketType.valid_for).asDays() +
                              ' nap'
                            : 'Korlátlan'}
                        </TableCell>
                        <TableCell align="right">
                          {ticketType.visit_limit || 'Korlátlan'} alkalom
                        </TableCell>
                        <TableCell align="center">
                          {ticketType.purchasable ? 'Igen' : 'Nem'}
                        </TableCell>
                        <TableCell align="right">
                          {ticketType.price} HUF
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={6}
                        >
                          <Collapse
                            in={openRowId === ticketType.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            {ticketType.description ? (
                              <Box sx={{ py: 2 }}>
                                <Typography variant="h5" mb={2}>
                                  Leírás
                                </Typography>
                                <Typography>
                                  {ticketType.description}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography my={2}>
                                Nincs leírás megadva
                              </Typography>
                            )}
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{
            overflow: 'unset',
          }}
          component="div"
          page={page}
          rowsPerPage={pageSize}
          count={data?.count || -1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange}
        />
      </Paper>
      <AddPassTypeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullScreen={xs}
        TransitionComponent={xs ? Transition : undefined}
      />
      {!mdAndUp && (
        <Fab
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          color="primary"
          onClick={() => setDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  )
}

export default TicketTypesView
