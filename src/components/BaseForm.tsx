import { Add, Edit } from "@mui/icons-material";
import { Button, Stack, TextField } from "@mui/material";
import { Menu } from "@/types";
import Link from "next/link";

interface Props {
  initialValues: Menu;
  onSubmit: (values: FormData) => void;
  onDelete?: (values: FormData) => void;
  type: string;
}

export const BaseForm = ({
  initialValues,
  onSubmit,
  type = "create",
  onDelete,
}: Props): JSX.Element => {
  const icon = type === "create" ? <Add /> : <Edit />;

  return (
    <form>
      <input type="hidden" name="id" value={initialValues.id} />
      <TextField
        fullWidth
        margin="normal"
        name="name"
        label="メニュー名"
        defaultValue={initialValues.name}
        type="text"
        required
      />
      <TextField
        fullWidth
        margin="normal"
        name="url"
        label="レシピURL"
        defaultValue={initialValues.url}
        type="text"
      />
      <Stack>
        <Button type="submit" startIcon={icon} formAction={onSubmit}>
          はい
        </Button>
        <Button>
          <Link href="/">戻る</Link>
        </Button>
        {type === "update" && (
          <>
            <Button type="submit" formAction={onDelete}>
              Delete
            </Button>
          </>
        )}
      </Stack>
    </form>
  );
};
