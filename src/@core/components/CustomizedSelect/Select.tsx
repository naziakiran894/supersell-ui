import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Box } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Icon from "../icon";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "{{First Name}}",
  "{{Last Name}}",
  "{{Email}}",
  "{{Phone}}",
  "{{Status}}",
  "{{Carlos Abbott}}",
  "{{Miriam Wagner}}",
  "{{Bradley Wilkerson}}",
  "{{Virginia Andrews}}",
  "{{Kelly Snyder}}",
];

interface IProps {
  label: string;
}

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect({ label }: IProps) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const ref = React.useRef();

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <FormControl fullWidth sx={{ maxWidth: "500px" }}>
      <InputLabel id="demo-multiple-name-label">{label}</InputLabel>
      <Select
        sx={{
          pr: 4,
          "& .MuiSelect-select": {
            whiteSpace: "unset !important",
          },
        }}
        fullWidth
        labelId="demo-multiple-name-label"
        id="demo-multiple-name"
        multiple
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        value={personName}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        MenuProps={MenuProps}
        renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 1.4, rowGap:0.5 }}>
              {selected.map((value) => (
                <span>{value}</span>
              ))}
            </Box>
          )}
        IconComponent={(props) => (
          <Icon
            {...props}
            style={{ cursor: "pointer" }}
            icon="mdi:code-braces"
          />
        )}
      >
        {names.map((name) => (
          <MenuItem
            key={name}
            value={name}
            style={getStyles(name, personName, theme)}
          >
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
