import { Box, Container } from "@mui/material";
import { ReactNode } from "react";

export const BasePage = ({ children }: { children: ReactNode }) => {
  return (
    <Container component="main" sx={{ padding: 2 }}>
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 2,
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        {children}
      </Box>
    </Container>
  );
};
