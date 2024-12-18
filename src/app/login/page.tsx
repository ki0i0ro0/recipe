"use client";
import { signIn } from "next-auth/react";
import { Box, Button, Container, Typography } from "@mui/material";

export default function Page() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
}
