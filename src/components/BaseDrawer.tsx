import { Button, AppBar, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { Logout } from "./Logout";

export const BaseDrawer = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Recipe App
          </Typography>
          <Button color="inherit">
            <Link href="/recipe/decide">ランダム</Link>
          </Button>
          <Button color="inherit">
            <Link href="/menu/create">メニュー追加</Link>
          </Button>
          <Logout />
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
};
