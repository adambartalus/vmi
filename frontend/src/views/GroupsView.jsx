import { useQuery } from '@tanstack/react-query'
import { Container } from '@mui/material'
import { getGroups } from '../fetch/fetchGroups'

const GroupsView = () => {
  const { isLoading, data } = useQuery(['groups'], () => getGroups())
  return (
    <Container>
      <div>GroupsView</div>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        data.map((g) => <li key={g.id}>{g.name}</li>)
      )}
    </Container>
  )
}

export default GroupsView
