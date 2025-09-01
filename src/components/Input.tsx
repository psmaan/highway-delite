import TextField from "@mui/material/TextField";

type Props = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({ label, type = "text", value, onChange }: Props) {
  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      fullWidth
      margin="normal"
      variant="outlined"
    />
  );
}
