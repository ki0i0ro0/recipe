import BasePage from '@/components/BasePage'
import { CREATE_MENU } from '@/graphql/create-menu'
import type { Menu } from '@/types'
import { useMutation } from '@apollo/client'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Add } from '@mui/icons-material'
import { Avatar, Typography } from '@mui/material'
import Router from 'next/router'
import { type Dispatch, type SetStateAction } from 'react'
import MyForm from '../components/BaseForm'

const App = () => {
  const initialValues: Menu = { id: 0, name: '' }
  const [createMenuHook] = useMutation(CREATE_MENU)

  const createMenu = async (value: Menu, setLoading: Dispatch<SetStateAction<boolean>>) => {
    setLoading(true)
    await createMenuHook({
      variables: {
        name: value.name,
      },
    })
    setLoading(false)
    Router.push({ pathname: '/' })
  }

  return (
    <BasePage>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <Add />
      </Avatar>
      <Typography textAlign="center">メニューを追加</Typography>
      <MyForm initialValues={initialValues} onSubmit={createMenu} type="create" />
    </BasePage>
  )
}

export default withPageAuthRequired(App, {
  onRedirecting: () => <div>Loading...</div>,
  onError: (error) => <div>{error.message}</div>,
})
