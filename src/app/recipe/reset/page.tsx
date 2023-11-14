import { PlaylistRemove } from "@mui/icons-material";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { BasePage } from "@/components/BasePage";
import { handleDeleteUserRecipes } from "@/app/actions";
import { ReturnButton } from "@/components/ReturnButton";

export default function Page() {
  return (
    <BasePage>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <PlaylistRemove />
      </Avatar>
      <Typography color="text.secondary">レシピリセット</Typography>
      <Box sx={{ paddingTop: "1em" }}>
        <Typography color="text.secondary" gutterBottom paddingBottom={2}>
          レシピの作成履歴をリセットしますか？
        </Typography>
        <form action={handleDeleteUserRecipes}>
          <Stack gap={1}>
            <Button type="submit" variant="contained">
              はい
            </Button>
            <ReturnButton />
          </Stack>
        </form>
      </Box>
    </BasePage>
  );
}
