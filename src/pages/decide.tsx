import { GET_RECIPE } from '@/graphql/get-recipe'
import { UPDATE_RECIPE } from '@/graphql/update-recipe'
import type { AppMenu, DecodedRecipe, GetRecipe, Menu, Recipe, RecipeData } from '@/types'
import { useMutation, useQuery } from '@apollo/client'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Button, CircularProgress } from '@mui/material'
import Router from 'next/router'
import { useEffect, useState } from 'react'

const App = () => {
  const { user } = useUser()
  const [updateRecipe] = useMutation(UPDATE_RECIPE)
  const [recipe, setRecipe] = useState<DecodedRecipe>()
  const [menu, setMenu] = useState<Menu>()
  const { data, loading, error } = useQuery<GetRecipe>(GET_RECIPE, {
    variables: {
      email: user?.email,
    },
  })

  useEffect(() => {
    if (!data) return
    const recipeDataArray = JSON.parse(data?.recipe.data) as RecipeData[]
    const decodedRecipe: DecodedRecipe = {
      id: data?.recipe.id ?? 0,
      data: recipeDataArray,
    }
    setRecipe(decodedRecipe)
    const cookedMenus = data?.menus.map((menu) => {
      const cookedMenu = recipeDataArray.find((recipeData) => +recipeData.menuId === menu.id)
      return { id: menu.id, name: menu.name, date: cookedMenu?.date } as AppMenu
    })
    const unCookedMenus = cookedMenus.filter((v) => !v.date)
    const todaysAppMenu = unCookedMenus[Math.floor(Math.random() * unCookedMenus.length)]
    const todaysMenu: Menu = { id: todaysAppMenu.id, name: todaysAppMenu.name }
    setMenu(todaysMenu)
  }, [data])

  if (loading) return <CircularProgress />
  if (error) return <p>エラーが発生しています</p>
  if (!data) return <CircularProgress />

  const handleUpdate = (id: number) => {
    if (!recipe) return
    if (recipe.data.length < 1) {
      recipe.data = []
    }
    recipe.data.push({ menuId: id.toString(), date: new Date().toLocaleDateString() })
    updateRecipe({
      variables: {
        id: +recipe.id,
        data: JSON.stringify(recipe.data),
      },
    })
    Router.push({ pathname: `/` })
  }

  const handleCancel = () => {}

  return (
    <>
      <p>{menu?.id}</p>
      <p>{menu?.name}</p>
      <Button
        onClick={() => {
          handleUpdate(menu?.id ?? 0)
        }}
      >
        OK
      </Button>
      <Button onClick={handleCancel}>Cancel</Button>
    </>
  )
}

export default withPageAuthRequired(App, {
  onRedirecting: () => <div>Loading...</div>,
  onError: (error) => <div>{error.message}</div>,
})
