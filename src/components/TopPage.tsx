import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link as MuiLink,
  Button,
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
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>料理名</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>作成回数</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>作成日</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>レシピ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow key={row.menuId}>
                  <TableCell>
                    <MuiLink
                      component={Link}
                      href={`/recipe/update/${row.menuId}?menuId=${row.menuId}&recipeId=${row.recipeId}`}
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      {row.menuName}
                    </MuiLink>
                  </TableCell>
                  <TableCell>{row.cookedCount}</TableCell>
                  <TableCell>
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleDateString("ja-JP")
                      : null}
                  </TableCell>
                  <TableCell>
                    {row.url && row.url.length > 5 ? (
                      <MuiLink
                        href={row.url}
                        target="_blank"
                        rel="noopener"
                        sx={{ color: "secondary.main", textDecoration: "none" }}
                      >
                        レシピ
                      </MuiLink>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        component={Link}
        href="/menu/create"
      >
        メニューを追加
      </Button>
    </BaseDrawer>
  );
};
