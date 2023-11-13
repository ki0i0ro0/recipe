import { Add, Edit } from "@mui/icons-material";
import { Button, Stack, TextField } from "@mui/material";
import { Menu } from "@/types";
import Link from "next/link";
import { handleDeleteMenu, handleUpdateMenu } from "@/app/actions";

interface Props {
  initialValues?: Menu;
  type: string;
}

export const BaseForm = ({
  initialValues,
  type = "create",
}: Props): JSX.Element => {
  const icon = type === "create" ? <Add /> : <Edit />;
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
      <Stack>
        <Button type="submit" startIcon={icon} formAction={handleUpdateMenu}>
          はい
        </Button>
        <Button>
          <Link href="/">戻る</Link>
        </Button>
        {type === "update" && (
          <>
            <Button type="submit" formAction={handleDeleteMenu}>
              Delete
            </Button>
          </>
        )}
      </Stack>
    </form>
  );
};
