import { Button } from "@mui/material";
import React, { useState, useRef } from "react";
import Translations from "../../../@core/layouts/Translations";

function ImageUpload() {
  const [image, setImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(URL.createObjectURL(e.target.files![0]));
  };

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        sx={{ height: "55px" }}
        onClick={handleClick}
      >
        <Translations text={"Upload File"} />
      </Button>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </>
  );
}

export default ImageUpload;
