import { GET_RECIPE } from '@/graphql/get-recipe'
import type { AppMenu, GetRecipe, RecipeData } from '@/types'
import { useQuery } from '@apollo/client'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AddCircle } from '@mui/icons-material'
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
      const userMenus: RecipeData[] = JSON.parse(data?.recipe.data)
      const cookedMenus: AppMenu[] = data?.menus.map((menu) => {
        const cookedMenu = userMenus.find((userMenu) => +userMenu.menuId === menu.id)
        return { id: menu.id ?? 0, name: menu.name, date: cookedMenu?.date || '' }
      })
      setRows(cookedMenus || [])
    }
  }, [data])

  if (loading) return <CircularProgress />
  if (error) return <p>エラーが発生しています</p>
  if (!data) return <CircularProgress />

  const handleCreate = () => {
    Router.push({ pathname: `/create` })
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
                <TableRow onClick={(event) => console.log(event)} key={row.name}>
                  <TableCell>{row.name || 'N/A'}</TableCell>
                  <TableCell>{row.date ? new Date(row.date).toLocaleDateString() : null}</TableCell>
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
