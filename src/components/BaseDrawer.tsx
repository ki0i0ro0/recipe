import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import Link from "next/link";
import { Logout } from "./Logout";
import { Shuffle, AddBox, PlaylistRemove } from "@mui/icons-material";

export const BaseDrawer = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "primary.main" }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            レシピ帳
          </Typography>
          <IconButton color="inherit">
            <Link href="/recipe/decide">
              <Shuffle sx={{ color: "secondary.main" }} />
            </Link>
          </IconButton>
          <IconButton color="inherit">
            <Link href="/recipe/reset">
              <PlaylistRemove sx={{ color: "secondary.main" }} />
            </Link>
          </IconButton>
          <IconButton color="inherit">
            <Link href="/menu/create">
              <AddBox sx={{ color: "secondary.main" }} />
            </Link>
          </IconButton>
          <Logout />
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
};
