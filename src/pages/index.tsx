import type { Menu, Recipe } from '@/types'
import { gql, useQuery } from '@apollo/client'
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

const GET_RECIPE = gql`
  query getRecipe($email: String!) {
    menus {
      id
      name
    }
    recipe(email: $email) {
      id
      data
    }
  }
`

interface GetRecipe {
  menus: Menu[]
  recipe: Recipe
}

interface Rows {
  name: string
  date: Date | undefined
}

const App = () => {
  const { user } = useUser()
  const [rows, setRows] = useState<Rows[]>([])
  const { data, loading, error } = useQuery<GetRecipe>(GET_RECIPE, {
    variables: {
      email: user?.email,
    },
  })

  useEffect(() => {
    if (data) {
      const userMenus: [{ menuId: number; date: Date }] = JSON.parse(data?.recipe.data)
      const cookedMenus = data?.menus.map((menu) => {
        const cookedMenu = userMenus.find((userMenu) => userMenu.menuId === menu.id)
        return { name: menu.name, date: cookedMenu?.date } as Rows
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
      <IconButton
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        color="info"
        onClick={handleCreate}
      >
        <AddCircle fontSize="large" />
      </IconButton>

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
