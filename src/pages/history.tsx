import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AddCircle } from '@mui/icons-material'
import { CircularProgress, IconButton } from '@mui/material'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import DeleteDialog from '../components/DeleteDialog'
import { EnhancedTable } from '../components/EnhancedTable'
import { bookState } from '../stores/book'
import { Recipe } from '../types'
import { getBookAPI, remove, setUserId, update } from '../utils/accessor'
import { storage } from '../utils/storage'

const App = () => {
  const [editedIds, setEditedId] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selected, setSelected] = useState<readonly string[]>([])
  const [data, setData] = useState<Recipe[]>([])
  const setBook = useSetRecoilState(bookState)
  const { user } = useUser()
  const userId = (user?.sub ? user?.sub.split('|').pop() : '') || ''
  setUserId(userId)

  useEffect(() => {
    const books = storage.getBooks()
    if (books) {
      setData(books)
    } else {
      getBookAPI().then((res) => {
        setData(res)
        storage.setBooks(res)
      })
    }
  }, [])

  if (!data) return <CircularProgress />

  const handleIncrement = async (id: number) => {
    const book = data.find((v) => v.id === +id)
    if (book) {
      book.bookNo = +book.bookNo + 1
      const res = await update(book)
    } else {
      alert('error')
    }
  }

  const handleCreate = (): void => {
    Router.push({ pathname: `/create` })
  }

  const handleEdit = (id: number): void => {
    const book = data.find((v) => v.id === +id)
    if (book) {
      setBook(book)
    } else {
      alert('error')
    }
    Router.push({ pathname: `/update/${id}` })
  }

  const rowDeleteClicked = (ids: string[]): void => {
    setEditedId(ids)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    setIsDeleteDialogOpen(false)
    editedIds.forEach(async (editedId) => {
      remove(editedId)
    })
    setData(storage.getBooks() ?? [])
    setSelected([])
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
        handleIncrement={handleIncrement}
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
