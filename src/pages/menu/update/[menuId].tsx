import { useMutation, useQuery } from '@apollo/client'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Add } from '@mui/icons-material'
import { Avatar, Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import type { Dispatch, SetStateAction } from 'react'
import { BaseForm } from '@/components/BaseForm'
import { BaseLoading } from '@/components/BaseLoading'
import { BasePage } from '@/components/BasePage'
import { type DataMenu, GET_MENU } from '@/graphql/menu/get'
import { UPDATE_MENU } from '@/graphql/menu/update'
import type { Menu } from '@/types'

const App = () => {
  const router = useRouter()
  const { menuId } = router.query

  const { loading, error, data } = useQuery<DataMenu>(GET_MENU, {
    variables: { id: Number(menuId) },
  })

  const [updateMenuHook] = useMutation(UPDATE_MENU)

  const updateMenu = async (value: Menu, setLoading: Dispatch<SetStateAction<boolean>>) => {
    setLoading(true)
    await updateMenuHook({
      variables: { ...value },
    })
    setLoading(false)
    router.push({ pathname: '/' })
  }

  if (loading) return <BaseLoading />
  if (error) return <p>Error</p>
  if (!data) return <BaseLoading />

  return (
    <BasePage>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <Add />
      </Avatar>
      <Typography textAlign="center">メニューを編集</Typography>
      <BaseForm initialValues={{ ...data.menu }} onSubmit={updateMenu} type="update" />
    </BasePage>
  )
}

export default withPageAuthRequired(App, {
  onRedirecting: () => <BaseLoading />,
  onError: (error) => <Box>{error.message}</Box>,
})
