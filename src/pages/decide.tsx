import { ADD_USER_RECIPE } from '@/graphql/add-user-recipe'
import { GET_RECIPE } from '@/graphql/get-recipe'
import type { AppMenu, GetRecipe, Menu, Recipe } from '@/types'
import { useMutation, useQuery } from '@apollo/client'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Button, CircularProgress } from '@mui/material'
import Router from 'next/router'
import { useEffect, useState } from 'react'

const App = () => {
  const { user } = useUser()
  const [addUserRecipe] = useMutation(ADD_USER_RECIPE)
  const [menu, setMenu] = useState<Menu>()
  const { data, loading, error } = useQuery<GetRecipe>(GET_RECIPE, {
    variables: {
      email: user?.email,
    },
  })

  useEffect(() => {
    if (!data) return
    const cookedMenus: AppMenu[] = data?.menus.map((menu) => {
      const cookedMenu = data?.recipe.find((userMenu) => userMenu.menu_id === menu.id)
      return {
        menuId: menu.id ?? 0,
        menuName: menu.name,
        createdAt: cookedMenu?.created_at || '',
        recipeId: cookedMenu?.id,
      }
    })

    const unCookedMenus = cookedMenus.filter((v) => !v.createdAt)
    const todaysAppMenu = unCookedMenus[Math.floor(Math.random() * unCookedMenus.length)]
    const todaysMenu: Menu = { id: todaysAppMenu.menuId, name: todaysAppMenu.menuName }
    setMenu(todaysMenu)
  }, [data])

  if (loading) return <CircularProgress />
  if (error) return <p>エラーが発生しています</p>
  if (!data) return <CircularProgress />

  const handleUpdate = async (id: number) => {
    await addUserRecipe({
      variables: {
        email: user?.email,
        menuId: id,
      },
    })
    Router.push({ pathname: `/` })
  }

  return (
    <>
      <p>{menu?.id}</p>
      <p>{menu?.name}</p>
      <Button
        onClick={() => {
          handleUpdate(menu?.id ? +menu?.id : 0)
        }}
      >
        OK
      </Button>
      <Button href="/">Cancel</Button>
    </>
  )
}

export default withPageAuthRequired(App, {
  onRedirecting: () => <div>Loading...</div>,
  onError: (error) => <div>{error.message}</div>,
})
