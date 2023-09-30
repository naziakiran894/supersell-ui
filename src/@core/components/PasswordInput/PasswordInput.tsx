import React, { useState } from "react";
import {
  OutlinedInput,
  InputAdornment,
  InputLabel,
  IconButton,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Icon from "../icon";

interface IPassInputProps {
  value: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  label: string;
  name: string;
  error?: boolean;
  helperText?: string | boolean;
  autoFocus?: boolean;
}

const PasswordInput = ({
  value,
  onChange,
  label,
  name,
  error,
  helperText,
  autoFocus,
}: IPassInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormControl error={error} sx={{ display: "flex", mb: 4 }}>
      <InputLabel htmlFor={label}>{label}</InputLabel>
      <OutlinedInput
        autoFocus={autoFocus}
        name={name}
        label={label}
        value={value}
        id={label}
        onChange={onChange}
        type={showPassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              edge="end"
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={(e) => e.preventDefault()}
              aria-label="toggle password visibility"
            >
              <Icon
                icon={showPassword ? "mdi:eye-outline" : "mdi:eye-off-outline"}
              />
            </IconButton>
          </InputAdornment>
        }
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default PasswordInput;
