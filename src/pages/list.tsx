import { EnhancedTable } from '@/components/EnhancedTable'
import type { Recipe } from '@/types'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AddCircle } from '@mui/icons-material'
import { CircularProgress, IconButton } from '@mui/material'
import Router from 'next/router'
import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`

const App = () => {
  const [selected, setSelected] = useState<readonly string[]>([])
  const { user } = useUser()
  const { data, loading, error } = useQuery<Recipe[]>(GET_USERS)

  if (loading) return <CircularProgress />
  if (error) return <p>エラーが発生しています</p>
  if (!data) return <CircularProgress />

  const handleCreate = () => {
    Router.push({ pathname: `/create` })
  }

  const handleEdit = (id: number) => {
    Router.push({ pathname: `/update/${id}` })
  }

  const rowDeleteClicked = (ids: string[]) => {}

  return (
    <>
      <IconButton
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        color="info"
        onClick={handleCreate}
      >
        <AddCircle fontSize="large" />
      </IconButton>

      <EnhancedTable
        rawRows={data}
        handleEdit={handleEdit}
        rowDeleteClicked={rowDeleteClicked}
        selected={selected}
        setSelected={setSelected}
      />
    </>
  )
}

export default withPageAuthRequired(App, {
  onRedirecting: () => <div>Loading...</div>,
  onError: (error) => <div>{error.message}</div>,
})
