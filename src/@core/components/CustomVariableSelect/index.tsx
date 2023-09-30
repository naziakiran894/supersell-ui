import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Icon from "../icon";
import { FormHelperText } from "@mui/material";

const ITEM_HEIGHT = 48;

interface IProps {
  label: string;
  value: string;
  setValue: any;
  options?: string[];
  rows?: number;
  error?: boolean;
  helperText?: string | boolean;
}

export default function InputAdornments({
  label,
  value,
  setValue,
  rows,
  options,
  error,
  helperText,
  ...props
}: IProps) {
  const [anchorEl, setAnchorEl] = React.useState<
    (EventTarget & Element) | null
  >(null);
  const open = Boolean(anchorEl);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
  };

  const handleOptionSelect = (option: string) => {
    setValue(value + " " + option);
    handleClose();
  };

  return (
    <FormControl error={error} fullWidth {...props} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
      <OutlinedInput
        label={label}
        {...props}
        multiline
        minRows={rows || 1}
        id="outlined-adornment-password"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onMouseDown={handleMouseDownPassword}
              edge="end"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={(e) => handleClick(e)}
            >
              <Icon icon="mdi:code-braces" />
            </IconButton>
          </InputAdornment>
        }
      />
      <Menu
        // id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 7,
            width: "20ch",
          },
        }}
      >
        {options?.map((option: string) => (
          <MenuItem key={option} onClick={() => handleOptionSelect(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}
