import { getAll, setUserId } from '@/api/recipe'
import { EnhancedTable } from '@/components/EnhancedTable'
import type { Recipe } from '@/types'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AddCircle } from '@mui/icons-material'
import { CircularProgress, IconButton } from '@mui/material'
import Router from 'next/router'
import { useEffect, useState } from 'react'

const App = () => {
  const [selected, setSelected] = useState<readonly string[]>([])
  const [data, setData] = useState<Recipe[]>([])
  const { user } = useUser()

  useEffect(() => {
    getAll().then((res) => {
      setData(res)
    })
    const userId = (user?.sub ? user?.sub.split('|').pop() : '') || ''
    setUserId(userId)
  }, [])

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
