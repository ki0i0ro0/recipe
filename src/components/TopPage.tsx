import { useQuery } from "@apollo/client";
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
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BaseDrawer } from "@/components/BaseDrawer";
import { BaseLoading } from "@/components/BaseLoading";
import { GET_RECIPE } from "@/graphql/recipe/get";
import { userMenuState } from "@/stores/userMenu";
import type { AppMenu, GetRecipe } from "@/types";

export const TopPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [rows, setRows] = useState<AppMenu[]>([]);
  const { data, loading, error } = useQuery<GetRecipe>(GET_RECIPE, {
    variables: {
      email: session?.user?.email,
    },
    fetchPolicy: "network-only",
  });

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

  if (loading) return <BaseLoading />;
  if (error) return <p>エラーが発生しています</p>;
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
