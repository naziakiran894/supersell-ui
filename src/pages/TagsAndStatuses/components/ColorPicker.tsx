import React ,{ useState } from "react";
import { ChromePicker } from "react-color";
import { Button, Input } from "@mui/material";

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker(props: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useState(props.color);

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  const handleColorInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setColor(event.target.value);
  };

  const handleColorPickerButtonClick = () => {
    setShowPicker(!showPicker);
  };

  const handleColorPickerClose = () => {
    setShowPicker(false);
    props.onChange(color); 
    const button = document.getElementById("colorPickerButton");
    if (button) {
      button.style.backgroundColor = color;
    }
  };

  return (
    <div
      style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
    >
      <div>{props.label}:</div>
      <Input
        style={{ width: "60px", marginLeft: "16px", marginRight: "16px" }}
        value={color}
        onChange={handleColorInputChange}
      />
      <Button
        id="colorPickerButton"  
        style={{ height: "36px", width: "100px", backgroundColor: color }}
        variant="contained"
        onClick={handleColorPickerButtonClick}
      >
        {showPicker ? "Close" : "Pick"}
      </Button>
      {showPicker && (
        <ChromePicker
          color={color}
          onChange={handleColorChange}
          onChangeComplete={handleColorPickerClose}
        />
      )}
    </div>
  );
}

 