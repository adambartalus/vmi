import { ArrowBack } from '@mui/icons-material'
import {
  AppBar,
  Backdrop,
  Box,
  Container,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material'
import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getPass } from '../fetch/fetchTickets'

const TicketView = () => {
  const theme = useTheme()
  const { id } = useParams()
  const { state } = useLocation()

  const navigate = useNavigate()
  const [QRFullscreen, setQRFullscreen] = useState(false)
  const [validFrom, setValidFrom] = useState(null)
  const [validTo, setValidTo] = useState(null)

  useEffect(() => {
    if (!/\d+/.test(id)) {
      navigate(-1)
    }
  }, [id, navigate])

  const { isLoading, data, error } = useQuery(['ticket', id], () => getPass(id))

  useEffect(() => {
    if (data) {
      setValidFrom(new Date(data.valid_from).toLocaleDateString())
      setValidTo(new Date(data.valid_to).toLocaleDateString())
    }
  }, [data])

  const handleQRCodeClick = () => {
    setQRFullscreen(!QRFullscreen)
  }
  if (error) return <h1>Error</h1>
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() =>
              navigate(
                `/tickets${
                  state?.activeTab ? `?${state.activeTab}=state.activeTab` : ''
                } `
              )
            }
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
            }}
            marginLeft={theme.spacing(2)}
          >
            Jegyinformáció
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" width='100vw'>
        <Toolbar />
        <Container maxWidth="xs">
          <Box
            onClick={handleQRCodeClick}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              my: theme.spacing(2),
              width: '100%',
            }}
          >
            {isLoading ? (
              <Skeleton variant="rectangular" width={200} height={200} />
            ) : (
              <Paper sx={{ padding: 2, bgcolor: 'white' }}>
                <QRCode value={data.token} size={200} onClick={handleQRCodeClick} />
              </Paper>
            )}
          </Box>
          <Typography
            variant="h6"
            textAlign="center"
            marginBottom={theme.spacing(1)}
          >
            {isLoading ? <Skeleton /> : data.gym_pass_type.name}
          </Typography>
          <Divider />
          <Typography fontWeight="bold" marginTop={theme.spacing(1)}>
            {isLoading ? (
              <Skeleton />
            ) : (
              data.owner.last_name + ' ' + data.owner.first_name
            )}
          </Typography>
          <Typography fontWeight="bold">
            {isLoading ? <Skeleton /> : data.owner.email}
          </Typography>
          <Typography variant="body1" marginTop={2}>
            {isLoading ? <Skeleton /> : `Érvényes: ${validFrom} - ${validTo}`}
          </Typography>
          <Typography variant="body1">
            {isLoading ? (
              <Skeleton />
            ) : (
              <>
                Hátralevő alkalmak:{' '}
                {data.uses_left === -1 ? 'Korlátlan' : data.uses_left}{' '}
              </>
            )}
          </Typography>
          <Typography variant="body1">
            {isLoading ? <Skeleton /> : `Ára: ${data.gym_pass_type.price} HUF`}
          </Typography>
          {QRFullscreen && (
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open
              onClick={handleQRCodeClick}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  margin: '0 auto',
                  maxWidth: '80%',
                  maxHeight: '70%',
                }}
              >
                <QRCode
                  value={data.token}
                  size={400}
                  viewBox="0 0 256 256"
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                />
              </Box>
            </Backdrop>
          )}
        </Container>
      </Box>
    </>
  )
}

export default TicketView
