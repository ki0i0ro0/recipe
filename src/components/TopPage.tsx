import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { BaseDrawer } from "@/components/BaseDrawer";
import Link from "next/link";
import type { AppMenu, GetRecipe } from "@/types";

export const TopPage = ({ data }: { data: GetRecipe }) => {
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
  const rows = cookedMenus || [];

  return (
    <BaseDrawer>
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
                <TableRow key={row.menuId}>
                  <TableCell>
                    <Link
                      href={`/recipe/update?menuId=${row.menuId}&recipeId=${row.recipeId}&createdAt=${row.createdAt}&menuName=${row.menuName}`}
                    >
                      {row.menuName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleDateString()
                      : null}
                  </TableCell>
                  <TableCell>
                    {row.url && row.url.length > 5 ? (
                      <a href={row.url} target="_blank" title="レシピリンク">
                        レシピ
                      </a>
                    ) : null}
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
