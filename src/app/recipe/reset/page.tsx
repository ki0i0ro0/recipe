import { PlaylistRemove } from "@mui/icons-material";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { BasePage } from "@/components/BasePage";
import { handleDeleteUserRecipes } from "@/app/actions";
import { ReturnButton } from "@/components/ReturnButton";
import { SubmitButton } from "@/components/SubmitButton";

export default function Page() {
  return (
    <BasePage>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main", width: 56, height: 56 }}>
        <PlaylistRemove fontSize="large" />
      </Avatar>
      <Box sx={{ textAlign: "center", mt: 2, mb: 2 }}>
        <Typography color="text.secondary" gutterBottom>
          レシピリセット
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          レシピの作成履歴をリセットしますか？
        </Typography>
        <form>
          <Stack gap={2} sx={{ mt: 2 }}>
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
