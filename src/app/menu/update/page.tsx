import { Add } from "@mui/icons-material";
import { Avatar, Typography } from "@mui/material";
import { BaseForm } from "@/components/BaseForm";
import { BasePage } from "@/components/BasePage";
import { redirect } from "next/navigation";
import { handleGetMenu } from "@/app/actions";

type Props = { searchParams: { [key: string]: string | string[] | undefined } };

export default async function Page({ searchParams }: Props) {
  const data = new FormData();
  data.set("id", String(searchParams.id));
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
