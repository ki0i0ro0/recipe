import { Add, Delete } from "@mui/icons-material";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { BasePage } from "@/components/BasePage";
import { handleAddUserRecipe, handleDeleteUserRecipe } from "@/app/actions";
import Link from "next/link";
import { ReturnButton } from "@/components/ReturnButton";
type Props = { searchParams: { [key: string]: string | string[] | undefined } };

export default function Page({ searchParams }: Props) {
  const userMenu = {
    createdAt: searchParams.createdAt,
    menuName: searchParams.menuName,
    menuId: searchParams.menuId,
    recipeId: searchParams.recipeId,
  };
  const isCreateMode = userMenu.createdAt == "";

  return (
    <BasePage>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        {isCreateMode ? <Add /> : <Delete />}
      </Avatar>
      <Typography color="text.secondary">履歴編集</Typography>
      <Box>
        <Typography variant="h5" component="div" mt={2} gutterBottom>
          {userMenu.menuName}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {isCreateMode ? "を作りましたか？" : "を取り消しますか？"}
        </Typography>
        <form
          action={isCreateMode ? handleAddUserRecipe : handleDeleteUserRecipe}
        >
          <input type="hidden" name="menuId" value={userMenu.menuId} />
          <input type="hidden" name="recipeId" value={userMenu.recipeId} />
          <Stack>
            <Button type="submit">はい</Button>
            <Button>
              <Link href={`/menu/update?id=${userMenu.menuId}`}>
                メニューを編集
              </Link>
            </Button>
            <ReturnButton />
          </Stack>
        </form>
      </Box>
    </BasePage>
  );
}
