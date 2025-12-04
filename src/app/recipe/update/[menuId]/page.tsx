import { Add, Delete } from "@mui/icons-material";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import {
  handleAddUserRecipe,
  handleDeleteUserRecipe,
  handleGetMenu,
  handleGetRecipe,
} from "@/app/actions";
import { BasePage } from "@/components/BasePage";
import { ReturnButton } from "@/components/ReturnButton";
import { SubmitButton } from "@/components/SubmitButton";
import type { Recipe } from "@/types";

type Props = {
  searchParams: Promise<{ recipeId: string }>;
  params: Promise<{ menuId: string }>;
};

export default async function Page({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const data = new FormData();
  data.set("id", resolvedParams.menuId);
  data.set("recipeId", String(resolvedSearchParams.recipeId));
  let recipe: Recipe | undefined;
  const menu = await handleGetMenu(data);
  if (resolvedSearchParams.recipeId) {
    recipe = await handleGetRecipe(data);
  }
  const userMenu = {
    createdAt: recipe?.createdAt || "",
    menuName: menu.name,
    menuId: menu.id,
    recipeId: recipe?.id || "",
  };
  const isCreateMode = userMenu.createdAt === "";

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
        <form>
          <input type="hidden" name="menuId" value={userMenu.menuId} />
          <input type="hidden" name="recipeId" value={userMenu.recipeId} />
          <Stack gap={1}>
            <SubmitButton
              formAction={
                isCreateMode ? handleAddUserRecipe : handleDeleteUserRecipe
              }
            >
              はい
            </SubmitButton>
            <Button variant="contained" color="secondary">
              <Link href={`/menu/update/${userMenu.menuId}`}>
                メニューを編集する
              </Link>
            </Button>
            <ReturnButton />
          </Stack>
        </form>
      </Box>
    </BasePage>
  );
}
