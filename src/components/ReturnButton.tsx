import { Button } from "@mui/material";
import Link from "next/link";

export const ReturnButton = () => (
  <Link href="/" style={{ width: "100%" }}>
    <Button variant="outlined" sx={{ width: "100%" }}>
      戻る
    </Button>
  </Link>
);
