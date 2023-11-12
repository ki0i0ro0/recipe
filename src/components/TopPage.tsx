"use client";
import { AutoMode, MenuBook } from "@mui/icons-material";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BaseDrawer } from "@/components/BaseDrawer";
import { BaseLoading } from "@/components/BaseLoading";
import { userMenuState } from "@/stores/userMenu";
import type { AppMenu, GetRecipe } from "@/types";

export const TopPage = ({ data }: { data: GetRecipe }) => {
  const router = useRouter();
  const [rows, setRows] = useState<AppMenu[]>([]);

  useEffect(() => {
    if (data) {
      const cookedMenus: AppMenu[] = data?.menus.map((menu) => {
        const cookedMenu = data?.recipe.find(
          (userMenu) => +userMenu.menuId === +menu.id,
        );
        return {
          menuId: menu.id,
          menuName: menu.name,
          url: menu.url,
          createdAt: cookedMenu?.createdAt || "",
          recipeId: cookedMenu?.id ?? 0,
        };
      });
      cookedMenus.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
      setRows(cookedMenus || []);
    }
  }, [data]);

  if (!data) return <BaseLoading />;

  const handleUpdate = (row: AppMenu) => {
    userMenuState(row);
    router.push("/recipe/update");
  };

  const handleRecipeURL = (url?: string) => {
    if (url && url.length > 5) {
      window.open(url);
    }
  };

  return (
    <BaseDrawer>
      {/* Menu add Button */}
      <IconButton
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        color="info"
        onClick={() => {
          router.push("/recipe/decide");
        }}
      >
        <AutoMode fontSize="large" />
      </IconButton>

      {/* Menu List */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>料理名</TableCell>
              <TableCell>作成日</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow
                  onClick={(event) => console.log(event)}
                  key={row.menuId}
                >
                  <TableCell onClick={() => handleUpdate(row)}>
                    {row.menuName}
                  </TableCell>
                  <TableCell>
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleDateString()
                      : null}
                  </TableCell>
                  <TableCell onClick={() => handleRecipeURL(row.url)}>
                    {row.url && row.url.length > 5 ? <MenuBook /> : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </BaseDrawer>
  );
};
