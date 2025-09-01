import { Button as MuiButton } from "@mui/material";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function Button({ children, onClick, type = "button" }: Props) {
  return (
    <MuiButton
      variant="contained"
      color="primary"
      fullWidth
      sx={{ mt: 2 }}
      type={type}
      onClick={onClick}
    >
      {children}
    </MuiButton>
  );
}
