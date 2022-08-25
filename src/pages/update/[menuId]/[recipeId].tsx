import { useMutation, useQuery } from '@apollo/client'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Delete, Edit } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Avatar, Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BaseLoading } from '@/components/BaseLoading'
import { BasePage } from '@/components/BasePage'
import { ADD_USER_RECIPE } from '@/graphql/add-user-recipe'
import { GET_MENU } from '@/graphql/get-menu'
import { REMOVE_USER_RECIPE } from '@/graphql/remove-user-recipe'
import type { Menu } from '@/types'

const App = () => {
  const { user } = useUser()
  const router = useRouter()
  const [addUserRecipe] = useMutation(ADD_USER_RECIPE)
  const [removeUserRecipe] = useMutation(REMOVE_USER_RECIPE)
  const [processing, setProcessing] = useState(false)

  const { menuId, recipeId } = router.query

  const { loading, error, data } = useQuery<Menu>(GET_MENU, { variables: { id: menuId } })

  // レシピ作成
  const handleAddUserRecipe = async (menuId: number) => {
    setProcessing(true)
    await addUserRecipe({
      variables: {
        email: user?.email,
        menu_id: menuId,
      },
    })
    setProcessing(false)
    router.push({ pathname: '/' })
  }

  // レシピ削除
  const handleRemoveUserRecipe = async (recipeId: number) => {
    setProcessing(true)
    await removeUserRecipe({
      variables: {
        id: recipeId,
      },
    })
    setProcessing(false)
    router.push({ pathname: '/' })
  }

  if (loading) return <BaseLoading />
  if (error) return <p>Error</p>
  if (!data) return <BaseLoading />

  return (
    <BasePage>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <Edit />
      </Avatar>
      <Typography textAlign="center">レシピを編集</Typography>
      <p>{data.name}</p>
      {recipeId === '0' ? (
        <LoadingButton
          onClick={() => handleAddUserRecipe(data.id)}
          variant="contained"
          startIcon={<Edit />}
          type="submit"
          loading={processing}
        >
          追加
        </LoadingButton>
      ) : (
        <LoadingButton
          onClick={() => handleRemoveUserRecipe(typeof recipeId === 'string' ? +recipeId : 0)}
          variant="contained"
          startIcon={<Delete />}
          type="submit"
          loading={processing}
        >
          取消
        </LoadingButton>
      )}
    </BasePage>
  )
}

export default withPageAuthRequired(App, {
  onRedirecting: () => <BaseLoading />,
  onError: (error) => <Box>{error.message}</Box>,
})
