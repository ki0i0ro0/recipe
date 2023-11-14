"use client";
import { Button } from "@mui/material";
import { useFormStatus } from "react-dom";

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
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      type="submit"
      formAction={formAction}
      color={color}
      variant="contained"
    >
      {children}
    </Button>
  );
};
