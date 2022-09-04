import { useMutation, useQuery } from '@apollo/client'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AutoMode } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Avatar, Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BaseLoading } from '@/components/BaseLoading'
import { BasePage } from '@/components/BasePage'
import { ADD_USER_RECIPE } from '@/graphql/recipe/add'
import { GET_RECIPE } from '@/graphql/recipe/get'
import type { AppMenu, GetRecipe, Menu } from '@/types'

const App = () => {
  const router = useRouter()
  const { user } = useUser()
  const [addUserRecipe] = useMutation(ADD_USER_RECIPE)
  const [menu, setMenu] = useState<Menu>()
  const [unCookedMenus, setUnCookedMenus] = useState<AppMenu[]>([])
  const { data, loading, error } = useQuery<GetRecipe>(GET_RECIPE, {
    variables: {
      email: user?.email,
    },
  })

  const ShuffleMenu = (unCookedMenus: AppMenu[]) => {
    if (unCookedMenus.length < 1) return
    const todaysAppMenu = unCookedMenus[Math.floor(Math.random() * unCookedMenus.length)]
    const todaysMenu: Menu = { id: todaysAppMenu.menuId, name: todaysAppMenu.menuName, url: '' }
    setMenu(todaysMenu)
  }

  useEffect(() => {
    if (!data) return
    const cookedMenus: AppMenu[] = data?.menus.map((menu) => {
      const cookedMenu = data?.recipe.find((userMenu) => userMenu.menuId === menu.id)
      return {
        menuId: menu.id ?? 0,
        menuName: menu.name,
        createdAt: cookedMenu?.createdAt || '',
        recipeId: cookedMenu?.id ?? 0,
      }
    })

    const unCookedMenus = cookedMenus.filter((v) => !v.createdAt)
    setUnCookedMenus(unCookedMenus)
    ShuffleMenu(unCookedMenus)
  }, [data])

  if (loading) return <BaseLoading />
  if (error) return <p>エラーが発生しています</p>
  if (!data) return <BaseLoading />

  const handleUpdate = async (id: number) => {
    await addUserRecipe({
      variables: {
        email: user?.email,
        menuId: id,
      },
    })
    router.push({ pathname: `/` })
  }

  return (
    <BasePage>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <AutoMode />
      </Avatar>
      <Box>
        <Typography color="text.secondary" gutterBottom>
          本日のおすすめメニューは
        </Typography>
        <Typography variant="h5" component="div" gutterBottom>
          {menu?.name}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          登録しますか？
        </Typography>
        <LoadingButton
          onClick={() => {
            handleUpdate(menu?.id ? +menu?.id : 0)
          }}
        >
          OK
        </LoadingButton>
        <Button href="/">Cancel</Button>
        <Button onClick={() => ShuffleMenu(unCookedMenus)}>Retry</Button>
      </Box>
    </BasePage>
  )
}

export default withPageAuthRequired(App, {
  onRedirecting: () => <BaseLoading />,
  onError: (error) => <Box>{error.message}</Box>,
})
