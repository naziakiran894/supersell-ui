import {
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
} from "@mui/material";
import Icon from "../../../@core/components/icon";
import { useMemo } from "react";
import { IFieldItem, IMeetingReminder } from "../MeetingSettings";
import CustomizedSelect from "../../../@core/components/CustomVariableSelect";
import Translations from "../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";
import { nanoid } from "nanoid";

type IProps = {
  reminders: IMeetingReminder[];
  setReminders: React.Dispatch<React.SetStateAction<IMeetingReminder[]>>;
  dropdownFields: IFieldItem[];
};

const MeetingReminders = ({
  reminders,
  setReminders,
  dropdownFields,
}: IProps) => {
  const options = useMemo(() => {
    return dropdownFields?.map((e: any, i) => `{{${e?.keyName}}}`);
  }, [dropdownFields]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newGrids = [...reminders];

    newGrids[index] = {
      ...newGrids[index],
      values: event.target.value,
    };

    setReminders(newGrids);
  };

  const handleUpDateMeeting = (
    event: SelectChangeEvent<string>,
    index: number
  ) => {
    setReminders((prevReminders) => {
      const newReminders = [...prevReminders];
      newReminders[index] = {
        ...newReminders[index],
        beforeMeeting: event.target.value,
      };
      return newReminders;
    });
  };

  const handleUpDateSms = (value: string, index: number) => {
    setReminders((prevReminders) => {
      const newReminders = [...prevReminders];
      newReminders[index] = { ...newReminders[index], sms: value };
      return newReminders;
    });
  };

  const handleAddGrid = () => {
    const newArray = [...reminders];
    newArray.push({
      values: "",
      beforeMeeting: "",
      sms: "",
      id: nanoid(),
    });

    setReminders(newArray);
  };
  const { t } = useTranslation();

  const handleDeleteGrid = (index: number) => {
    const newGrids = [...reminders];

    if (newGrids.length > 1) {
      newGrids.splice(index, 1);
      setReminders(newGrids);
    }
  };

  return (
    <>
      <Box sx={{ pt: 10, pl: 10 }}>
        <Grid container>
          <Box>
            <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>
              <Translations text="MEETING REMINDERS" />
            </Typography>
            <Typography>
              <Translations text="Send meeting reminders with SMS before the meeting" />
            </Typography>
          </Box>
          {reminders?.map((data, index) => (
            <Grid container key={index} my={5}>
              <Grid item lg={12} md={12} sm={12} xs={12} my={5}>
                <Typography sx={{ fontWeight: "600" }}>
                  <Translations text="Reminder #" /> {1 + index}
                </Typography>
              </Grid>

              <Grid
                item
                md={11}
                sm={11}
                xs={11}
                display="flex"
                justifyContent="space-between"
                gap="10px"
              >
                <TextField
                  label={t("Value")}
                  variant="outlined"
                  sx={{ width: "15rem" }}
                  value={data.values}
                  onChange={(e) => handleChange(e, index)}
                />
                <FormControl sx={{ width: "25rem" }}>
                  <InputLabel id="demo-simple-select-outlined-label">
                    <Translations text="Before the meeting" />
                  </InputLabel>
                  <Select
                    label={t("Before the meeting")}
                    value={data.beforeMeeting}
                    onChange={(e) => handleUpDateMeeting(e, index)}
                    id="demo-simple-select-outlined"
                    labelId="demo-simple-select-outlined-label"
                  >
                    <MenuItem value="days">
                      <Translations text="Days" />
                    </MenuItem>
                    <MenuItem value="hours">
                      {" "}
                      <Translations text="Hours" />
                    </MenuItem>
                  </Select>
                </FormControl>

                <CustomizedSelect
                  label={t("SMS")}
                  value={data.sms}
                  options={options}
                  setValue={(value: string) => handleUpDateSms(value, index)}
                  rows={4}
                />

                <Grid sx={{ display: "flex", ml: "15px" }}>
                  {reminders.length > 1 && (
                    <Icon
                      icon="ci:remove-minus-circle"
                      onClick={() => handleDeleteGrid(index)}
                    />
                  )}

                  {reminders.length - 1 === index && (
                    <Icon
                      icon="material-symbols:add-circle-outline"
                      onClick={handleAddGrid}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};
export default MeetingReminders;
