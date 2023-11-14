import { Button, Stack, TextField } from "@mui/material";
import { Menu } from "@/types";
import { handleDeleteMenu, handleUpdateMenu } from "@/app/actions";
import { ReturnButton } from "./ReturnButton";
import { SubmitButton } from "./SubmitButton";

interface Props {
  initialValues?: Menu;
  type: string;
}

export const BaseForm = ({
  initialValues,
  type = "create",
}: Props): JSX.Element => {
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
      />
      <TextField
        fullWidth
        margin="normal"
        name="phoneticGuides"
        label="よみがな"
        defaultValue={defaultValues.phoneticGuides}
        type="text"
      />
      <TextField
        fullWidth
        margin="normal"
        name="url"
        label="レシピURL"
        defaultValue={defaultValues.url}
        type="text"
      />
      <Stack gap={1}>
        <SubmitButton formAction={handleUpdateMenu}>保存する</SubmitButton>
        {type === "update" && (
          <SubmitButton color="error" formAction={handleDeleteMenu}>
            削除する
          </SubmitButton>
        )}
        <ReturnButton />
      </Stack>
    </form>
  );
};
