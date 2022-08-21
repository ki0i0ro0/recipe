import { GET_RECIPE } from '@/graphql/get-recipe'
import type { AppMenu, GetRecipe } from '@/types'
import { useQuery } from '@apollo/client'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AddCircle, AutoMode } from '@mui/icons-material'
import {
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import Router from 'next/router'
import { useEffect, useState } from 'react'

const App = () => {
  const { user } = useUser()
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
          recipeId: cookedMenu?.id,
        }
      })
      setRows(cookedMenus || [])
    }
  }, [data])

  if (loading) return <CircularProgress />
  if (error) return <p>エラーが発生しています</p>
  if (!data) return <CircularProgress />

  const handleCreate = () => {
    Router.push({ pathname: `/add` })
  }

  return (
    <>
      {/* Menu add Button */}
      <IconButton
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        color="info"
        onClick={handleCreate}
      >
        <AddCircle fontSize="large" />
      </IconButton>
      <IconButton sx={{ position: 'absolute', bottom: 16, left: 16 }} color="info" href="./decide">
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
                  <TableCell>{row.menuName || 'N/A'}</TableCell>
                  <TableCell>
                    {row.createdAt ? new Date(+row.createdAt).toLocaleDateString() : null}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default withPageAuthRequired(App, {
  onRedirecting: () => <div>Loading...</div>,
  onError: (error) => <div>{error.message}</div>,
})
