import { SetStateAction, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  TextField,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  SelectChangeEvent,
} from "@mui/material";
import { FormikProps } from "formik";
import CustomizedSelect from "../../../@core/components/CustomVariableSelect";
import Icon from "../../../@core/components/icon";
import { IFieldItem, IFormickValue, ISubtitle } from "../MeetingSettings";
import { Field } from "../../../store/types/fields.types";
import { IMeetingSettingsApiData } from "../../../store/types/meetingSettings.types";
import { useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";

type IProps = {
  props: FormikProps<IFormickValue>;
  subTitle: ISubtitle;
  setSubTitle: React.Dispatch<React.SetStateAction<ISubtitle>>;
  fields: IFieldItem;
  setTag: React.Dispatch<SetStateAction<ISubtitle>>;
  tag: ISubtitle;
  setValue: React.Dispatch<SetStateAction<string>>;
  value: string;
  setAskFields: React.Dispatch<SetStateAction<boolean>>;
  askFields: boolean;
  setFields: React.Dispatch<SetStateAction<IFieldItem>>;
  dropdownFields: Field[];
};

const MeetingInfo = ({
  props,
  subTitle,
  setSubTitle,
  fields,
  setFields,
  tag,
  setTag,
  value,
  setValue,
  askFields,
  setAskFields,
  dropdownFields,
}: IProps) => {
  const { values, touched, errors, setFieldValue } = props;
  const [isEdit, setIsEdit] = useState(false);

  const handleChangeDropDown = (
    event: SelectChangeEvent<string>,
    index: number
  ) => {
    const newGrids = [...fields.fields];

    const cIndex = dropdownFields.findIndex(
      (e) => e.keyName === event.target.value
    );
    if (cIndex !== -1) {
      newGrids[index] = dropdownFields[cIndex];
      setFields((pre: any) => ({
        ...pre,
        fields: newGrids,
      }));
    }
  };

  const options = dropdownFields?.map((e: any, i) => `{{${e?.keyName}}}`);

  const handleUpdateTitle = () => {
    const newData = { ...fields };
    newData.fieldName = value;
    setFields(newData);
    setIsEdit(false);
  };
  const { t } = useTranslation();
  const handleAddGrid = () => {
    const newArray = [...fields.fields];

    newArray.push({
      keyName: "",
      type: "",
      value: "",
    });

    setFields((pre: any) => ({
      ...pre,
      fields: newArray,
    }));
  };

  const cancelEdit = () => {
    setIsEdit(false);
  };
  const handleDeleteGrid = (index: number) => {
    const newGrids = [...fields.fields];

    if (newGrids.length > 1) {
      newGrids.splice(index, 1);
      setFields((pre: any) => ({
        ...pre,
        fields: newGrids,
      }));
    }
  };

  return (
    <>
      <Box sx={{ pt: 10, pl: 10 }}>
        <Grid
          container
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Grid item sm={10} xs={11} my={2} display="flex">
            <CustomizedSelect
              label={t("Meeting Title")}
              value={values.meetingTitle}
              options={options}
              //@ts-ignore
              sx={{ maxWidth: "500px" }}
              error={touched.meetingTitle && Boolean(errors.meetingTitle)}
              helperText={
                touched.meetingTitle && (errors.meetingTitle as string)
              }
              setValue={(value: string) => setFieldValue("meetingTitle", value)}
            />
          </Grid>
          <Grid item sm={10} xs={11} my={2} display="flex" marginTop="20px">
            <CustomizedSelect
              options={options}
              value={subTitle.value}
              setValue={(e: string) => setSubTitle({ ...subTitle, value: e })}
              //@ts-ignore
              sx={{ maxWidth: "500px" }}
              label={t("Meeting Subtitle")}
            />
            <IconButton
              size="small"
              onClick={() =>
                setSubTitle({ ...subTitle, visible: !subTitle.visible })
              }
              sx={{ ml: 3 }}
            >
              <Icon
                icon={
                  subTitle.visible ? "mdi:eye-outline" : "mdi:eye-off-outline"
                }
                color="black"
              />
            </IconButton>
          </Grid>

          <Grid item sm={10} xs={11} display="flex" marginTop="20px">
            <CustomizedSelect
              options={options}
              value={tag.value}
              setValue={(e: string) => setTag({ ...tag, value: e })}
              //@ts-ignore

              sx={{ maxWidth: "500px" }}
              label={t("Automatic Tag")}
            />
            <IconButton
              size="small"
              onClick={() => setTag({ ...tag, visible: !tag.visible })}
              sx={{ ml: 3 }}
            >
              <Icon
                icon={tag.visible ? "mdi:eye-outline" : "mdi:eye-off-outline"}
                color="black"
              />
            </IconButton>
          </Grid>
        </Grid>

        <Box my={5}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={askFields}
                  onChange={(e) => setAskFields(e.target.checked)}
                />
              }
              label={t("Ask fields")}
            />
          </FormGroup>
        </Box>
        {askFields && (
          <Box sx={{ fontSize: "16px", fontWeight: "600" }}>
            {isEdit ? (
              <Box alignItems="center" display="flex" marginBottom={"10px"}>
                <TextField
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  variant="standard"
                />

                <Box sx={{ display: "flex", gap: "5px" }}>
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
              <>
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
                  {fields?.fieldName}
                  <Box sx={{ marginX: "10px" }}>
                    <Icon
                      onClick={() => {
                        setIsEdit(true);
                        setValue(fields.fieldName);
                      }}
                      style={{ cursor: "pointer" }}
                      icon="mdi:pencil-outline"
                      color="gray"
                    />
                  </Box>
                </Typography>
              </>
            )}

            <Grid container>
              {fields?.fields?.map((grid, index: number) => (
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
                      value={grid?.keyName}
                      onChange={(e) => handleChangeDropDown(e, index)}
                      id="demo-simple-select-outlined"
                      labelId="demo-simple-select-outlined-label"
                    >
                      {dropdownFields.map((e?: any) => {
                        return <MenuItem value={e.keyName}>{e.value}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                  <Grid sx={{ display: "flex", ml: "15px", minWidth: "40px" }}>
                    {fields?.fields?.length > 1 && (
                      <Icon
                        icon="ci:remove-minus-circle"
                        onClick={() => handleDeleteGrid(index)}
                      />
                    )}
                    {fields.fields.length - 1 === index && (
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
        )}
      </Box>
    </>
  );
};
export default MeetingInfo;
