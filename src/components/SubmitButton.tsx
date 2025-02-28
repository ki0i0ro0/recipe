import { Button } from "@mui/material";

interface Props {
  formAction: (data: FormData) => void;
  children: React.ReactNode;
  color?: "inherit" | "primary" | "secondary" | "error" | undefined;
}

export const SubmitButton = ({
  formAction,
  children,
  color = "primary",
}: Props) => {
  return (
    <Button
      type="submit"
      formAction={formAction}
      color={color}
      variant="contained"
    >
      {children}
    </Button>
  );
};
