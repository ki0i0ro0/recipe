import { Add, Edit } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Stack, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { Dispatch, SetStateAction, useState } from 'react'
import { Recipe } from '../types'
import { BookFormSchema } from '../utils/accessor'

const BookForm = ({
  initialValues,
  onSubmit,
  type = 'create',
}: {
  initialValues: Recipe
  onSubmit: (values: Recipe, setLoading: Dispatch<SetStateAction<boolean>>) => void
  type: string
}): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: BookFormSchema,
    onSubmit: (values: Recipe) => {
      onSubmit(values, setLoading)
    },
  })
  const buttonSetting =
    type === 'create' ? { icon: <Add />, title: '登録する' } : { icon: <Edit />, title: '更新する' }

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        name="name"
        label="Book Name"
        value={formik.values.name}
        onChange={formik.handleChange}
        required
      />
      <Stack>
        <LoadingButton
          variant="contained"
          startIcon={buttonSetting.icon}
          type="submit"
          loading={loading}
        >
          {buttonSetting.title}
        </LoadingButton>
      </Stack>
    </form>
  )
}

export default BookForm
