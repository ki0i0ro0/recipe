import { AutoMode } from "@mui/icons-material";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { BasePage } from "@/components/BasePage";
import type { AppMenu, Menu } from "@/types";
import { handleGetUserMenu, handleAddUserRecipe } from "@/app/actions";
import { ReturnButton } from "@/components/ReturnButton";
import { SubmitButton } from "@/components/SubmitButton";

export default async function Page() {
  let menu: Menu;
  const cookedMenus = await handleGetUserMenu();

  const ShuffleMenu = (cookedMenus: AppMenu[]) => {
    const unCookedMenus = cookedMenus.filter((v) => !v.createdAt);
    if (unCookedMenus.length < 1) return;
    const todaysAppMenu =
      unCookedMenus[Math.floor(Math.random() * unCookedMenus.length)];
    const todaysMenu: Menu = {
      id: todaysAppMenu.menuId,
      name: todaysAppMenu.menuName,
      url: "",
    };
    menu = todaysMenu;
  };

  const unCookedMenus = cookedMenus.filter((v) => !v.createdAt);
  ShuffleMenu(unCookedMenus);

  return (
    <BasePage>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <AutoMode />
      </Avatar>
      <Box>
        <Typography color="text.secondary" gutterBottom>
          本日のおすすめメニュー
        </Typography>
        <Typography variant="h5" component="div" gutterBottom>
          {menu!.name}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          登録しますか？
        </Typography>
        <form>
          <input type="hidden" name="menuId" value={menu!.id} />
          <Stack gap={1}>
            <SubmitButton formAction={handleAddUserRecipe}>はい</SubmitButton>
            <Button href="/recipe/decide" variant="contained" color="secondary">
              やりなおす
            </Button>
            <ReturnButton />
          </Stack>
        </form>
      </Box>
    </BasePage>
  );
}
