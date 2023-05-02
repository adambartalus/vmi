import { DataGrid, useGridApiContext } from '@mui/x-data-grid'
import React, { useCallback, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { getUsers, putUser } from '../fetch/fetchUsers'
import { getGroups } from '../fetch/fetchGroups'
import { addMessage } from '../slices/snackbarMessagesSlice'
import { useDispatch } from 'react-redux'

const GroupSelect = ({ params }) => {
  const groups = useQuery(['groups'], () => getGroups())
  const { id, value, field } = params
  const apiRef = useGridApiContext()
  const handleChange = (e) => {
    console.log(value);
    console.log(e.target.value);
    apiRef.current.setEditCellValue({ id, field, value: groups.data.filter(g => e.target.value.includes(g.id))})
  }

  if (groups.isLoading) return <span>Loading...</span>
  return (
    <FormControl>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        fullWidth
        value={value.map(g => g.id)}
        onChange={handleChange}
        renderValue={(value) => groups.data.filter(g => value.includes(g.id)).map((g) => g.name).join(', ')}
      >
        {groups.data.map((group) => (
          <MenuItem
            key={group.id}
            value={group.id}
            onClick={(e) => console.log(e.target.value)}
          >
            <Checkbox
              checked={value.map(g => g.id).includes(group.id)}
            />
            <ListItemText primary={group.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const columns = [
  { field: 'email', headerName: 'E-mail cím', width: 300, editable: true },
  { field: 'last_name', headerName: 'Vezetéknév', flex: 1, editable: true },
  { field: 'first_name', headerName: 'Keresztnév', flex: 1, editable: true },
  {
    field: 'groups',
    headerName: 'Csoportok',
    flex: 1,
    editable: true,
    valueFormatter: (params) => params.value.map((g) => g.name),
    renderEditCell: (params) => <GroupSelect params={params} />,
  },
  {
    field: 'last_login',
    headerName: 'Utolsó bejelentkezés',
    width: 180,
    valueFormatter: (params) => new Date(params.value).toLocaleString(),
  },
  {
    field: 'date_joined',
    headerName: 'Csatlakozás ideje',
    width: 180,
    valueFormatter: (params) => new Date(params.value).toLocaleString(),
  },
]

const UsersView = () => {
  const dispatch = useDispatch()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(25)
  const { isLoading, data } = useQuery(
    ['users', { page: page + 1, pageSize }],
    () => {
      return getUsers({ page: page + 1, page_size: pageSize })
    }
  )
  const [rowCount, setRowCount] = useState(data?.count || 0)
  const mutation = useMutation(putUser, {
    onSuccess: () =>
      dispatch(addMessage({ message: 'Felhasználó adatai módosítva' })),
  })
  const [promiseArguments, setPromiseArguments] = useState(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  useEffect(() => {
    setRowCount((prevRowCount) =>
      data?.count !== undefined ? data?.count : prevRowCount
    )
  }, [data?.count, setRowCount])

  const handlePaginationModelChange = (model) => {
    setPage(model.page)
    setPageSize(model.pageSize)
  }
  const handleCancel = () => {
    const { oldRow, resolve } = promiseArguments
    resolve(oldRow)
    setPromiseArguments(null)
  }
  const handleConfirm = async () => {
    const { newRow, reject, resolve } = promiseArguments
    try {
      const user = await mutation.mutateAsync({
        userId: newRow.id,
        data: newRow,
      })
      setPromiseArguments(null)
      setConfirmDialogOpen(false)
      resolve(user)
    } catch (error) {
      setConfirmDialogOpen(false)
      reject(error)
    }
  }
  const computeMutation = (newRow, oldRow) => {
    const changes = {}
    if (newRow.email !== oldRow.email)
      changes.email = { from: oldRow.email, to: newRow.email }
    if (newRow.first_name !== oldRow.first_name)
      changes.first_name = { from: oldRow.first_name, to: newRow.first_name }
    if (newRow.last_name !== oldRow.last_name)
      changes.last_name = { from: oldRow.last_name, to: newRow.last_name }
    if (newRow.groups !== oldRow.groups)
      changes.groups = {
        from: oldRow.groups.map((g) => g.name).join(', '),
        to: newRow.groups.map((g) => g.name).join(', '),
      }

    return changes
  }
  const handleRowUpdate = useCallback((newRow, oldRow) => {
    setConfirmDialogOpen(true)
    return new Promise((resolve, reject) => {
      const changes = computeMutation(newRow, oldRow)
      if (Object.keys(changes).length !== 0) {
        newRow.groups = newRow.groups.map((g) => g.id)
        setPromiseArguments({ resolve, reject, newRow, oldRow, changes })
      } else {
        resolve(oldRow)
      }
    })
  }, [])
  const handleRowUpdateError = useCallback(
    async (error) => {
      dispatch(
        addMessage({
          message: 'Hiba az adatok módosítása során',
          severity: 'error',
        })
      )
    },
    [dispatch]
  )

  const renderConfirmDialog = () => {
    if (!promiseArguments) return null
    const { changes } = promiseArguments

    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: () => {} }}
        open={confirmDialogOpen}
      >
        <DialogTitle>Változtatások elmentése</DialogTitle>
        <DialogContent dividers>
          <Typography>
            A következő módosítások fognak érvénybe lépni:
          </Typography>
          {Object.keys(changes).map((c) => (
            <Typography key={c}>
              {c}: {changes[c].from} -&gt; {changes[c].to}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Elvetés</Button>
          <Button onClick={handleConfirm}>Mentés</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Container>
      {renderConfirmDialog()}
      <DataGrid
        columns={columns}
        rows={data?.results || []}
        loading={isLoading}
        paginationMode="server"
        paginationModel={{ page, pageSize }}
        rowCount={rowCount}
        onPaginationModelChange={handlePaginationModelChange}
        editMode="row"
        processRowUpdate={handleRowUpdate}
        onProcessRowUpdateError={handleRowUpdateError}
        sx={{
          height: 500,
          mt: 2,
          '& .MuiDataGrid-main': { width: 0, minWidth: '100%' },
        }}
      />
    </Container>
  )
}

export default UsersView
