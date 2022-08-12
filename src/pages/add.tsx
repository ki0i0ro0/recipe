import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Add } from '@mui/icons-material'
import { Avatar, Typography } from '@mui/material'
import Router from 'next/router'
import type { Dispatch, SetStateAction } from 'react'
import MyForm from '../components/BaseForm'
import { Recipe } from '../types'
import { create } from '../util/book-util'
import { createValues } from '../util/create-values'

const App = () => {
  const values = createValues()

  const createBook = async (values: Recipe, setLoading: Dispatch<SetStateAction<boolean>>) => {
    setLoading(true)
    await create(values)
    setLoading(false)
    Router.push({ pathname: '/' })
  }

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <Add />
      </Avatar>
      <Typography textAlign="center">レシピを追加</Typography>
      <MyForm initialValues={values} onSubmit={createBook} type="create" />
    </>
  )
}

export default withPageAuthRequired(App, {
  onRedirecting: () => <div>Loading...</div>,
  onError: (error) => <div>{error.message}</div>,
})
