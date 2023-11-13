import { Add } from "@mui/icons-material";
import { Avatar, Typography } from "@mui/material";
import { BaseForm } from "@/components/BaseForm";
import { BasePage } from "@/components/BasePage";

export default async function Page() {
  return (
    <BasePage>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <Add />
      </Avatar>
      <Typography textAlign="center">メニューを追加</Typography>
      <BaseForm type="create" />
    </BasePage>
  );
}
