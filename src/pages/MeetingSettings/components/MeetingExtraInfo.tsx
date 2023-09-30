import {
  Grid,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import Icon from "../../../@core/components/icon";
import { useMemo, useState } from "react";
import { IFieldItem } from "../MeetingSettings";
import { Field } from "../../../store/types/fields.types";
import Translations from "../../../@core/layouts/Translations";

type IProps = {
  extraInformation: IFieldItem;
  setExtraInformation: any;
  dropdownFields: Field[];
};

const MeetingExtraInfo = ({
  extraInformation,
  setExtraInformation,
  dropdownFields,
}: IProps) => {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (event: SelectChangeEvent<string>, index: number) => {
    const newGrids = [...extraInformation.fields];
    const cIndex = dropdownFields.findIndex(
      (e) => e.keyName === event.target.value
    );
    if (cIndex !== -1) {
      newGrids[index] = dropdownFields[cIndex];
      setExtraInformation((pre: any) => ({
        ...pre,
        fields: newGrids,
      }));
    }
  };

  const handleUpdateTitle = () => {
    const newData = { ...extraInformation };
    newData.fieldName = value;
    setExtraInformation(newData);
    setEdit(false);
  };

  const handleAddGrid = () => {
    const newArray = [...extraInformation.fields];
    newArray.push({
      keyName: "",
      type: "",
      value: "",
    });
    setExtraInformation((pre: any) => ({
      ...pre,
      fields: newArray,
    }));
  };

  const cancelEdit = () => {
    setEdit(false);
  };
  const handleDeleteGrid = (index: number) => {
    const newGrids = [...extraInformation.fields];

    if (newGrids.length > 1) {
      newGrids.splice(index, 1);
      setExtraInformation((pre: any) => ({
        ...pre,
        fields: newGrids,
      }));
    }
  };

  const renderDropDownField = useMemo(
    () =>
      dropdownFields?.map((e: any, index: number) => {
        return (
          <MenuItem key={index} value={e.keyName}>
            <Translations text={e.value} />
          </MenuItem>
        );
      }),
    [dropdownFields]
  );

  return (
    <>
      <Box sx={{ pl: 10, pt: 5 }}>
        {edit ? (
          <Box alignItems="center" display="flex" marginBottom={"10px"}>
            <TextField
              value={value}
              onChange={(e) => setValue(e.target.value)}
              variant="standard"
            />
            <Box sx={{ display: "flex", gap: "20px" }}>
              <Icon
                icon="mdi:success"
                onClick={handleUpdateTitle}
                style={{
                  color: "green ",
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
              />
              <Icon
                icon="mdi:remove"
                onClick={cancelEdit}
                style={{ color: "red", cursor: "pointer" }}
              />
            </Box>
          </Box>
        ) : (
          <Typography
            sx={{
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              marginY: "10px",
              display: "flex",
              "&:hover": {
                color: "purple",
                textDecorationLine: "underline",
                textDecorationColor: "purple",
              },
            }}
          >
            {extraInformation?.fieldName}
            <Box sx={{ marginX: "10px" }}>
              <Icon
                onClick={() => {
                  setEdit(true);
                  setValue(extraInformation?.fieldName);
                }}
                style={{ cursor: "pointer" }}
                icon="mdi:pencil-outline"
                color="gray"
              />
            </Box>
          </Typography>
        )}
        <Grid container>
          {extraInformation?.fields?.map((grid, index) => (
            <Grid
              item
              xs={11}
              my={2}
              key={index}
              display="flex"
              alignItems="center"
            >
              <FormControl fullWidth sx={{ maxWidth: "500px" }}>
                <InputLabel id="demo-simple-select-outlined-label">
                  <Translations text="Field" /> {index + 1}
                </InputLabel>
                <Select
                  label={`Field ${index + 1} `}
                  value={grid.keyName}
                  onChange={(e) => handleChange(e, index)}
                  id="demo-simple-select-outlined"
                  labelId="demo-simple-select-outlined-label"
                >
                  {renderDropDownField}
                </Select>
              </FormControl>
              <Grid sx={{ display: "flex", ml: "15px", minWidth: "40px" }}>
                {extraInformation?.fields?.length > 1 && (
                  <Icon
                    icon="ci:remove-minus-circle"
                    onClick={() => handleDeleteGrid(index)}
                  />
                )}
                {extraInformation?.fields?.length - 1 === index && (
                  <Icon
                    icon="material-symbols:add-circle-outline"
                    onClick={handleAddGrid}
                  />
                )}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};
export default MeetingExtraInfo;
function setFields(arg0: (pre: any) => any) {
  throw new Error("Function not implemented.");
}
