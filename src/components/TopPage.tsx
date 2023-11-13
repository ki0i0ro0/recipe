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
import { getCookedMenu } from "@/app/actions";

export const TopPage = async () => {
  const data = await getCookedMenu();
  // 名前順にソート
  data.sort((a, b) => {
    const aName = a.menuPhoneticGuides ?? a.menuName;
    const bName = b.menuPhoneticGuides ?? b.menuName;
    return aName.localeCompare(bName, "ja");
  });
  data.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
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
