import { PlaylistRemove } from "@mui/icons-material";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { handleDeleteUserRecipes } from "@/app/actions";
import { BasePage } from "@/components/BasePage";
import { ReturnButton } from "@/components/ReturnButton";
import { SubmitButton } from "@/components/SubmitButton";

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
        <form>
          <Stack gap={1}>
            <SubmitButton formAction={handleDeleteUserRecipes}>
              はい
            </SubmitButton>
            <ReturnButton />
          </Stack>
        </form>
      </Box>
    </BasePage>
  );
}
