import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import Link from "next/link";
import { Logout } from "./Logout";
import { Shuffle, AddBox, PlaylistRemove } from "@mui/icons-material";
export const BaseDrawer = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Recipe App
          </Typography>
          <IconButton color="inherit">
            <Link href="/recipe/decide">
              <Shuffle />
            </Link>
          </IconButton>
          <IconButton color="inherit">
            <Link href="/recipe/reset">
              <PlaylistRemove />
            </Link>
          </IconButton>
          <IconButton color="inherit">
            <Link href="/menu/create">
              <AddBox />
            </Link>
          </IconButton>
          <Logout />
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
};
