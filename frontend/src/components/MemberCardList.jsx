import MemberCard from './MemberCard'
import ResponsiveGridContainer from './ResponsiveGridContainer'
import Grid from '@mui/material/Unstable_Grid2'

const MemberCardList = ({ users, onCheckout }) => {
  return (
    <ResponsiveGridContainer>
      {users.map((user) => (
        <Grid key={user.id} xs={4} sm={8} md={6} lg={4}>
          <MemberCard user={user} key={user.id} onCheckout={onCheckout} />
        </Grid>
      ))}
    </ResponsiveGridContainer>
  )
}

export default MemberCardList
