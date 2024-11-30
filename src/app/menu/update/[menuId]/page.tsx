import { Add } from "@mui/icons-material";
import { Avatar, Typography } from "@mui/material";
import { BaseForm } from "@/components/BaseForm";
import { BasePage } from "@/components/BasePage";
import { redirect } from "next/navigation";
import { handleGetMenu } from "@/app/actions";

type Props = { params: Promise<{ menuId: string }> };

export default async function Page(props: Props) {
  const params = await props.params;
  const data = new FormData();
  data.set("id", String(params.menuId));
  const menu = await handleGetMenu(data);

  if (!menu) {
    redirect("/");
  }

  return (
    <BasePage>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <Add />
      </Avatar>
      <Typography textAlign="center">メニューを編集</Typography>
      <BaseForm initialValues={{ ...menu }} type="update" />
    </BasePage>
  );
}
