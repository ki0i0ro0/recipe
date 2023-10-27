import { useMutation } from '@apollo/client'
import { Add } from '@mui/icons-material'
import { Avatar, Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import type { Dispatch, SetStateAction } from 'react'
import { BaseForm } from '@/components/BaseForm'
import { BaseLoading } from '@/components/BaseLoading'
import { BasePage } from '@/components/BasePage'
import { DELETE_MENU } from '@/graphql/menu/delete'
import { UPDATE_MENU } from '@/graphql/menu/update'
import { userMenuState } from '@/stores/userMenu'
import type { Menu } from '@/types'

const App = () => {
  const router = useRouter()
  const userMenu = userMenuState()
  const [updateMenuHook] = useMutation(UPDATE_MENU)
  const [deleteMenuHook] = useMutation(DELETE_MENU)

  const updateMenu = async (value: Menu, setLoading: Dispatch<SetStateAction<boolean>>) => {
    setLoading(true)
    await updateMenuHook({
      variables: { ...value },
    })
    setLoading(false)
    router.push({ pathname: '/' })
  }

  const deleteMenu = async (value: Menu, setLoading: Dispatch<SetStateAction<boolean>>) => {
    setLoading(true)
    await deleteMenuHook({
      variables: { id: value.id },
    })
    setLoading(false)
    router.push({ pathname: '/' })
  }

  const menu: Menu = {
    id: userMenu.menuId,
    name: userMenu.menuName,
    url: userMenu.url || '',
  }

  return (
    <BasePage>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <Add />
      </Avatar>
      <Typography textAlign="center">メニューを編集</Typography>
      <BaseForm
        initialValues={{ ...menu }}
        onSubmit={updateMenu}
        type="update"
        onDelete={deleteMenu}
      />
    </BasePage>
  )
}

export default App
