import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AddCircle } from '@mui/icons-material'
import { CircularProgress, IconButton } from '@mui/material'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import DeleteDialog from '../components/DeleteDialog'
import { EnhancedTable } from '../components/EnhancedTable'
import { Recipe } from '../types'
import { getAll, remove, setUserId } from '@/api/recipe'

const App = () => {
  const [editedIds, setEditedId] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selected, setSelected] = useState<readonly string[]>([])
  const [data, setData] = useState<Recipe[]>([])
  const { user } = useUser()
  const userId = (user?.sub ? user?.sub.split('|').pop() : '') || ''
  setUserId(userId)

  useEffect(() => {
    getAll().then((res) => {
      setData(res)
    })
  }, [])

  if (!data) return <CircularProgress />

  const handleCreate = (): void => {
    Router.push({ pathname: `/create` })
  }

  const handleEdit = (id: number): void => {
    Router.push({ pathname: `/update/${id}` })
  }

  const rowDeleteClicked = (ids: string[]): void => {
    setEditedId(ids)
    setIsDeleteDialogOpen(true)
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

      <EnhancedTable
        rawRows={data}
        handleEdit={handleEdit}
        rowDeleteClicked={rowDeleteClicked}
        selected={selected}
        setSelected={setSelected}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDelete}
      />
    </>
  )
}

export default withPageAuthRequired(App, {
  onRedirecting: () => <div>Loading...</div>,
  onError: (error) => <div>{error.message}</div>,
})
