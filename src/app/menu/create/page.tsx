import { Add } from "@mui/icons-material";
import { Avatar, Typography, Box } from "@mui/material";
import { BaseForm } from "@/components/BaseForm";
import { BasePage } from "@/components/BasePage";

export default async function Page() {
  return (
    <BasePage>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main", width: 56, height: 56 }}>
        <Add fontSize="large" />
      </Avatar>
      <Box sx={{ textAlign: "center", mt: 2, mb: 2 }}>
        <Typography variant="h5">メニューを追加</Typography>
      </Box>
      <BaseForm type="create" />
    </BasePage>
  );
}
