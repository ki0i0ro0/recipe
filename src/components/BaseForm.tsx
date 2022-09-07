import { Add, Edit } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import * as Yup from 'yup'
import { Menu } from '@/types'

const FORM_SCHEMA = Yup.object({
  name: Yup.string().required(),
  url: Yup.string(),
})

interface Props {
  initialValues: Menu
  onSubmit: (values: Menu, setLoading: Dispatch<SetStateAction<boolean>>) => void
  onDelete?: (values: Menu, setLoading: Dispatch<SetStateAction<boolean>>) => void
  type: string
}

export const BaseForm = (props: Props): JSX.Element => {
  const router = useRouter()
  const { initialValues, onSubmit, type = 'create', onDelete } = props
  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: FORM_SCHEMA,
    onSubmit: (values: Menu) => {
      onSubmit(values, setLoading)
    },
  })

  const handleDelete = () => {
    if (onDelete) {
      onDelete(initialValues, setLoading)
    }
  }

  const icon = type === 'create' ? <Add /> : <Edit />

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        name="name"
        label="メニュー名"
        value={formik.values.name}
        onChange={formik.handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        name="url"
        label="レシピURL"
        value={formik.values.url}
        onChange={formik.handleChange}
      />
      <Stack>
        <LoadingButton type="submit" startIcon={icon} loading={loading}>
          OK
        </LoadingButton>
        <Button
          type="reset"
          onClick={() => {
            router.push('/')
          }}
        >
          Cancel
        </Button>
        {type === 'update' && (
          <>
            <Button type="button" onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
      </Stack>
    </form>
  )
}
