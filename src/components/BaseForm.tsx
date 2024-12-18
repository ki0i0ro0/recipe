import { Stack, TextField } from "@mui/material";
import { Menu } from "@/types";
import { handleDeleteMenu, handleUpdateMenu } from "@/app/actions";
import { ReturnButton } from "./ReturnButton";
import { SubmitButton } from "./SubmitButton";

interface Props {
  initialValues?: Menu;
  type: string;
}

export const BaseForm = ({ initialValues, type = "create" }: Props) => {
  const defaultValues = initialValues ?? {
    name: "",
    url: "",
    phoneticGuides: "",
  };

  return (
    <form>
      <input type="hidden" name="id" value={initialValues?.id} />
      <TextField
        fullWidth
        margin="normal"
        name="name"
        label="メニュー名"
        defaultValue={defaultValues.name}
        type="text"
        required
        sx={{ backgroundColor: "background.paper", borderRadius: 1 }}
      />
      <TextField
        fullWidth
        margin="normal"
        name="phoneticGuides"
        label="よみがな"
        defaultValue={defaultValues.phoneticGuides}
        type="text"
        sx={{ backgroundColor: "background.paper", borderRadius: 1 }}
      />
      <TextField
        fullWidth
        margin="normal"
        name="url"
        label="レシピURL"
        defaultValue={defaultValues.url}
        type="text"
        sx={{ backgroundColor: "background.paper", borderRadius: 1 }}
      />
      <Stack gap={2} sx={{ mt: 2 }}>
        <SubmitButton formAction={handleUpdateMenu} sx={{ backgroundColor: "primary.main", color: "primary.contrastText" }}>
          保存する
        </SubmitButton>
        {type === "update" && (
          <SubmitButton color="error" formAction={handleDeleteMenu} sx={{ backgroundColor: "error.main", color: "error.contrastText" }}>
            削除する
          </SubmitButton>
        )}
        <ReturnButton />
      </Stack>
    </form>
  );
};
