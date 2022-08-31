import { useQuery } from '@apollo/client'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AddCircle, AutoMode } from '@mui/icons-material'
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BaseDrawer } from '@/components/BaseDrawer'
import { BaseLoading } from '@/components/BaseLoading'
import { GET_RECIPE } from '@/graphql/recipe/get'
import type { AppMenu, GetRecipe } from '@/types'

const App = () => {
  const { user } = useUser()
  const router = useRouter()
  const [rows, setRows] = useState<AppMenu[]>([])
  const { data, loading, error } = useQuery<GetRecipe>(GET_RECIPE, {
    variables: {
      email: user?.email,
    },
  })

  useEffect(() => {
    if (data) {
      const cookedMenus: AppMenu[] = data?.menus.map((menu) => {
        const cookedMenu = data?.recipe.find((userMenu) => +userMenu.menu_id === +menu.id)
        return {
          menuId: menu.id ?? 0,
          menuName: menu.name,
          createdAt: cookedMenu?.created_at || '',
          recipeId: cookedMenu?.id ?? 0,
        }
      })
      cookedMenus.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
      setRows(cookedMenus || [])
    }
  }, [data])

  if (loading) return <BaseLoading />
  if (error) return <p>エラーが発生しています</p>
  if (!data) return <BaseLoading />

  return (
    <BaseDrawer>
      {/* Menu add Button */}
      <IconButton
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        color="info"
        href="./recipe/decide"
      >
        <AutoMode fontSize="large" />
      </IconButton>

      {/* Menu List */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>料理名</TableCell>
              <TableCell>作成日</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow onClick={(event) => console.log(event)} key={row.menuId}>
                  <TableCell>
                    <a href={`/recipe/update/${row.menuId}/${row.recipeId}`}>{row.menuName}</a>
                  </TableCell>
                  <TableCell>
                    {row.createdAt ? new Date(+row.createdAt).toLocaleDateString() : null}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </BaseDrawer>
  )
}

export default withPageAuthRequired(App, {
  onRedirecting: () => <BaseLoading />,
  onError: (error) => <Box>{error.message}</Box>,
})
