import { useMutation } from "@apollo/client";
import { Add } from "@mui/icons-material";
import { Avatar, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import type { Dispatch, SetStateAction } from "react";
import { BaseForm } from "@/components/BaseForm";
import { BasePage } from "@/components/BasePage";
import { CREATE_MENU } from "@/graphql/menu/create";
import type { Menu } from "@/types";

const App = () => {
  const router = useRouter();
  const initialValues: Menu = { id: 0, name: "", url: "" };
  const [createMenuHook] = useMutation(CREATE_MENU);

  const createMenu = async (
    value: Menu,
    setLoading: Dispatch<SetStateAction<boolean>>,
  ) => {
    setLoading(true);
    await createMenuHook({
      variables: { ...value },
    });
    setLoading(false);
    router.push({ pathname: "/" });
  };

  return (
    <BasePage>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <Add />
      </Avatar>
      <Typography textAlign="center">メニューを追加</Typography>
      <BaseForm
        initialValues={initialValues}
        onSubmit={createMenu}
        type="create"
      />
    </BasePage>
  );
};

export default App;
