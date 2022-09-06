import { useMutation, useQuery } from '@apollo/client'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Add, Delete } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Avatar, Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BaseLoading } from '@/components/BaseLoading'
import { BasePage } from '@/components/BasePage'
import { ADD_USER_RECIPE } from '@/graphql/recipe/add'
import { REMOVE_USER_RECIPE } from '@/graphql/recipe/remove'
import { userMenuState } from '@/stores/userMenu'

const App = () => {
  const { user } = useUser()
  const router = useRouter()
  const userMenu = userMenuState()
  const [addUserRecipe] = useMutation(ADD_USER_RECIPE)
  const [removeUserRecipe] = useMutation(REMOVE_USER_RECIPE)
  const [processing, setProcessing] = useState(false)

  // レシピ作成
  const handleAddUserRecipe = async (menuId: number) => {
    setProcessing(true)
    await addUserRecipe({
      variables: {
        email: user?.email,
        menuId: menuId,
      },
    })
    setProcessing(false)
    router.push('/')
  }

  // レシピ削除
  const handleRemoveUserRecipe = async (recipeId: number) => {
    setProcessing(true)
    await removeUserRecipe({
      variables: {
        email: user?.email,
        recipeId: recipeId,
      },
    })
    setProcessing(false)
    router.push('/')
  }

  const isCreateMode = userMenu.createdAt == ''

  return (
    <BasePage>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        {isCreateMode ? <Add /> : <Delete />}
      </Avatar>
      <Typography color="text.secondary">履歴編集</Typography>
      <Box>
        <Typography variant="h5" component="div" mt={2} gutterBottom>
          {userMenu.menuName}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {isCreateMode ? 'を作りましたか？' : 'を取り消しますか？'}
        </Typography>
        <LoadingButton
          onClick={() => {
            if (isCreateMode) {
              handleAddUserRecipe(userMenu.menuId)
            } else {
              handleRemoveUserRecipe(userMenu.recipeId)
            }
          }}
          loading={processing}
        >
          OK
        </LoadingButton>
        <Button
          disabled={processing}
          onClick={() => {
            router.push('/')
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={processing}
          onClick={() => {
            router.push('/menu/update')
          }}
        >
          Edit
        </Button>
      </Box>
    </BasePage>
  )
}

export default withPageAuthRequired(App, {
  onRedirecting: () => <BaseLoading />,
  onError: (error) => <Box>{error.message}</Box>,
})
