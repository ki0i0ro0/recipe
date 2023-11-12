import { Add } from "@mui/icons-material";
import { Avatar, Typography } from "@mui/material";
import { BaseForm } from "@/components/BaseForm";
import { BasePage } from "@/components/BasePage";
import type { Menu } from "@/types";
import { handleCreateMenu } from "@/app/actions";

const App = () => {
  const initialValues: Menu = { id: 0, name: "", url: "" };

  return (
    <BasePage>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <Add />
      </Avatar>
      <Typography textAlign="center">メニューを追加</Typography>
      <BaseForm
        initialValues={initialValues}
        onSubmit={handleCreateMenu}
        type="create"
      />
    </BasePage>
  );
};

export default App;
