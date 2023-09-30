import React, { useState } from "react";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Icon from "../../../@core/components/icon";
import { IGridItem } from "../index";
import { useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";

type IProps = {
  customFields: IGridItem[];
  setCustomFields: React.Dispatch<React.SetStateAction<IGridItem[]>>;
};

const CustomField = ({ customFields, setCustomFields }: IProps) => {
  const handleAddFieldName = (value: string, index: number) => {
    let convertedString = value.toLowerCase().replace(/\s+/g, "_");
    const newArray = [...customFields];
    const updatedObject = {
      ...newArray[index],
      keyName: convertedString,
      value: value,
    };
    newArray[index] = updatedObject;
    setCustomFields(newArray);
  };
  const { t } = useTranslation();

  const handleAddFieldType = (value: string, index: number) => {
    const newArray = [...customFields];
    const updatedObject = { ...newArray[index], type: value };
    newArray[index] = updatedObject;
    setCustomFields(newArray);
  };

  const handleAddGrid = () => {
    let test = [
      ...customFields,
      { keyName: "", value: "", type: "", visible: true },
    ];
    setCustomFields([...test]);
  };

  const handleDeleteGrid = (index: number) => {
    const newGrids = [...customFields];
    newGrids.splice(index, 1);
    setCustomFields(newGrids);
  };

  const handleToggleVisibility = (index: number) => {
    const newArray = [...customFields];
    const updatedObject = {
      ...newArray[index],
      visible: !customFields[index].visible,
    };
    newArray[index] = updatedObject;
    setCustomFields([...newArray]);
  };

  return (
    <>
      <Box m={4}>
        <Typography fontSize="16px" fontWeight="600">
          <Translations text="CUSTOM FIELDS" />
        </Typography>
        <Typography
          sx={{ fontWeight: "400", fontSize: "14px", color: "#3A354199" }}
        >
          <Translations text="If all these fields are hidden also the module will be hidden from Lead view" />
        </Typography>
      </Box>
      <Grid
        container
        display="flex"
        flexDirection="column"
        spacing={4}
        sx={{ m: 4 }}
      >
        {customFields?.length > 0 &&
          customFields?.map((grid, index) => (
            <Grid
              key={index}
              item
              xs={12}
              display="flex"
              alignItems="center"
              gap="10px"
            >
              <TextField
                label={t("Added Field Name")}
                variant="outlined"
                value={grid.value}
                onChange={(e) => handleAddFieldName(e.target.value, index)}
              />
              <FormControl sx={{ width: "400px" }}>
                <InputLabel id="demo-simple-select-outlined-label">
                  <Translations text="Custom Field Type" />
                </InputLabel>
                <Select
                  label={t("Custom Field Type")}
                  defaultValue=""
                  id="demo-simple-select-outlined"
                  labelId="demo-simple-select-outlined-label"
                  value={grid.type}
                  onChange={(e) => handleAddFieldType(e.target.value, index)}
                >
                  <MenuItem value="text">
                    {" "}
                    <Translations text="Text" />
                  </MenuItem>
                  <MenuItem value="largeText">
                    {" "}
                    <Translations text="Large Text Box (5 rows)" />
                  </MenuItem>
                  <MenuItem value="number">
                    {" "}
                    <Translations text="Number" />
                  </MenuItem>
                  <MenuItem value="date">
                    {" "}
                    <Translations text="Date" />
                  </MenuItem>
                  <MenuItem value="dateAndTime">
                    {" "}
                    <Translations text="Date and Time" />
                  </MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ cursor: "pointer" }} display="flex" gap="5px">
                {customFields.length - 1 === index ? (
                  <>
                    {customFields.length > 1 && (
                      <Icon
                        icon="ci:remove-minus-circle"
                        onClick={() => handleDeleteGrid(index)}
                      />
                    )}

                    <Icon
                      icon="mdi:plus-circle-outline"
                      onClick={() => handleAddGrid()}
                    />
                  </>
                ) : (
                  <Icon
                    icon="ci:remove-minus-circle"
                    onClick={() => handleDeleteGrid(index)}
                  />
                )}

                <Icon
                  onClick={() => handleToggleVisibility(index)}
                  icon={
                    grid.visible ? "mdi:eye-outline" : "mdi:eye-off-outline"
                  }
                />
              </Box>
            </Grid>
          ))}
      </Grid>
    </>
  );
};

export default CustomField;
