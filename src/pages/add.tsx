import { create } from '@/api/recipe'
import type { Recipe } from '@/types'
import { createValues } from '@/utils/create-values'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Add } from '@mui/icons-material'
import { Avatar, Typography } from '@mui/material'
import Router from 'next/router'
import type { Dispatch, SetStateAction } from 'react'
import MyForm from '../components/BaseForm'

const App = () => {
  const initValue = createValues()

  const createRecipe = async (value: Recipe, setLoading: Dispatch<SetStateAction<boolean>>) => {
    setLoading(true)
    await create(value)
    setLoading(false)
    Router.push({ pathname: '/' })
  }

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <Add />
      </Avatar>
      <Typography textAlign="center">レシピを追加</Typography>
      <MyForm initialValues={initValue} onSubmit={createRecipe} type="create" />
    </>
  )
}

export default withPageAuthRequired(App, {
  onRedirecting: () => <div>Loading...</div>,
  onError: (error) => <div>{error.message}</div>,
})
