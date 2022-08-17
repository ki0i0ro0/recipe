import { gql, useQuery } from '@apollo/client'
import { withPageAuthRequired, useUser } from '@auth0/nextjs-auth0'
import { AddCircle } from '@mui/icons-material'
import {
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import Router from 'next/router'

const GET_RECIPE = gql`
  query getRecipe($email: String!) {
    recipe(email: $email) {
      id
      data
    }
  }
`

const App = () => {
  const { user } = useUser()
  const { data, loading, error } = useQuery<any>(GET_RECIPE, {
    variables: {
      email: user?.email,
    },
  })

  if (loading) return <CircularProgress />
  if (error) return <p>エラーが発生しています</p>
  if (!data) return <CircularProgress />

  const rows: any[] = JSON.parse(data.recipe.data)
  const handleCreate = () => {
    Router.push({ pathname: `/create` })
  }

  return (
    <>
      <IconButton
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        color="info"
        onClick={handleCreate}
      >
        <AddCircle fontSize="large" />
      </IconButton>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>料理名</TableCell>
              <TableCell>作成日</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow onClick={(event) => console.log(event)} key={row.name}>
                  <TableCell>{row.name || 'N/A'}</TableCell>
                  <TableCell>{new Date(row.updatedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default withPageAuthRequired(App, {
  onRedirecting: () => <div>Loading...</div>,
  onError: (error) => <div>{error.message}</div>,
})
