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
import { handleGetUserMenu } from "@/app/actions";

export const TopPage = async () => {
  const data = await handleGetUserMenu();
  // 名前順にソート
  data.sort((a, b) => {
    const aName = a.menuPhoneticGuides ?? a.menuName;
    const bName = b.menuPhoneticGuides ?? b.menuName;
    return aName.localeCompare(bName, "ja");
  });
  // 作成日順にソート
  data.sort((a, b) => {
    const aCreatedAt = a.createdAt ? +new Date(a.createdAt) : 0;
    const bCreatedAt = b.createdAt ? +new Date(b.createdAt) : 0;
    return aCreatedAt < bCreatedAt ? -1 : 1;
  });
  const rows = data || [];

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
                      href={`/recipe/update?menuId=${row.menuId}&recipeId=${row.recipeId}`}
                    >
                      {row.menuName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleDateString("ja-JP")
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
