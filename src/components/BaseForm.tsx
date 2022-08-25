import { Add, Edit } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Stack, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { Dispatch, SetStateAction, useState } from 'react'
import * as Yup from 'yup'
import { Menu } from '@/types'

const FORM_SCHEMA = Yup.object({
  name: Yup.string().required(),
})

interface Props {
  initialValues: Menu
  onSubmit: (values: Menu, setLoading: Dispatch<SetStateAction<boolean>>) => void
  type: string
}

export const BaseForm = (props: Props): JSX.Element => {
  const { initialValues, onSubmit, type = 'create' } = props
  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: FORM_SCHEMA,
    onSubmit: (values: Menu) => {
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
        label="メニュー名"
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
