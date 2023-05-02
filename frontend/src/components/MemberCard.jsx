import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import { Button } from '@mui/material'

const MemberCard = ({ user, onCheckout }) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: red[500] }}
            alt={user.last_name}
            src=""
          ></Avatar>
        }
        title={user.first_name + ' ' + user.last_name}
        subheader={user.email}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {user.active_visit ? 'A teremben tartózkodik' : 'Nincs a teremben'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          disabled={!user.active_visit}
          onClick={() => onCheckout(user.active_visit)}
        >
          Kijelentkeztet
        </Button>
      </CardActions>
    </Card>
  )
}

export default MemberCard
