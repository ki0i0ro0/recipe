import { Box, Container } from '@mui/material'
import { ReactNode } from 'react'

export const BasePage = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <Container component="main">
      <Box
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {children}
      </Box>
    </Container>
  )
}
