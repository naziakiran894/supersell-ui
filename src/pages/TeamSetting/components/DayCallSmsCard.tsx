import { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  FormControl,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { nanoid } from "nanoid";
import Icon from "../../../@core/components/icon";
import { IFollowUpSetting } from "../../../store/types/teamSettings.types";
import { validateYupSchema } from "formik";
import Translations from "../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";

type IProps = {
  values: IFollowUpSetting;
  currentIndex: number;
  setLeadCallDays: React.Dispatch<React.SetStateAction<IFollowUpSetting[]>>;
  leadCallDay: IFollowUpSetting[];
  SelectDaysOption?: any;
};

const DayCallSmsCard = ({
  values,
  currentIndex,
  leadCallDay,
  setLeadCallDays,
  SelectDaysOption,
}: IProps) => {
  const [edit, setEdit] = useState(false);
  const [day, setDayName] = useState(values?.day);
  const handleCall = () => {
    const newArray = JSON.parse(JSON.stringify(leadCallDay));
    const innerArray = newArray[currentIndex].data;
    innerArray.push({
      callType: "regular",
      minOrhour: "min",
      phone: true,
      sms: false,
      smsText: "",
      value: 0,
      type: "call",
      id: nanoid(),
    });
    setLeadCallDays(newArray);
  };

  const handleMessage = (index: number) => {
    const newArray = JSON.parse(JSON.stringify(leadCallDay));
    const innerArray = newArray[currentIndex].data;
    innerArray.push({
      callType: "regular",
      minOrHour: "min",
      phone: true,
      sms: false,
      smsText: "",
      value: 0,
      type: "sms",
      id: nanoid(),
    });
    setLeadCallDays(newArray);
  };
  const { t } = useTranslation();

  const handleSetMessageText = (value: string, index: number) => {
    const newArray = JSON.parse(JSON.stringify(leadCallDay));
    newArray[currentIndex].data[index].smsText = value;
    setLeadCallDays(newArray);
  };

  const handleUpdateSteps = (value: string, index: number) => {
    const newArray = JSON.parse(JSON.stringify(leadCallDay));
    newArray[currentIndex].data[index].value = value;
    setLeadCallDays(newArray);
  };

  const handleUpdateCallType = (value: string, index: number) => {
    const newArray = JSON.parse(JSON.stringify(leadCallDay));
    newArray[currentIndex].data[index].callType = value;
    setLeadCallDays(newArray);
  };

  const handleUpdateHoursMin = (value: string, index: number) => {
    const newArray = JSON.parse(JSON.stringify(leadCallDay));
    newArray[currentIndex].data[index].minOrHour = value;
    setLeadCallDays(newArray);
  };

  const handleUpdateTime = (value: Dayjs | null, index: number) => {
    const newArray = JSON.parse(JSON.stringify(leadCallDay));
    newArray[currentIndex].data[index].time = value;
    setLeadCallDays(newArray);
  };

  const handleDelete = (index: number) => {
    const newArray = JSON.parse(JSON.stringify(leadCallDay));
    const valueArr = JSON.parse(JSON.stringify(newArray[currentIndex].data));
    newArray[currentIndex].data = valueArr.filter(
      (element: IFollowUpSetting, i: number) => i !== index
    );

    if (valueArr.length <= 1) {
      newArray.splice(currentIndex, 1);
    }

    setLeadCallDays(newArray);
  };

  const cancelEdit = () => {
    setEdit(false);
  };

  const handleUpdateTitle = () => {
    const newArray = JSON.parse(JSON.stringify(leadCallDay));
    newArray[currentIndex].day = day;
    setLeadCallDays(newArray);
    setEdit(false);
  };

  return (
    <Grid container>
      <Grid item my={5} display="flex" flexDirection="column" gap={5}>
        <Box display={"flex"} alignItems={"center"} gap={"10px"}>
          {edit ? (
            <Box alignItems="center" display="flex">
              <Box alignItems="center" display="flex" gap={2}>
                <Typography>
                  <Translations text={"Day"} />
                </Typography>
                <FormControl>
                  {SelectDaysOption ?
                    <>
                      <InputLabel id="demo-simple-select-outlined-label">
                        <Translations text={"Select Day"} />
                      </InputLabel>
                      <Select
                        value={day}
                        onChange={(e) => setDayName(e.target.value)}
                        label={t("Select Day")}
                        sx={{ width: "content" }}
                      >
                        {SelectDaysOption}
                      </Select>
                    </>
                    : <TextField placeholder="days" label="Select Day" value={day || 1} onChange={(e) => setDayName(e.target.value)} type="number" />
                  }
                </FormControl>
              </Box>
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
            <>
              <Typography variant="h6" fontWeight="700">
                {!SelectDaysOption && 'Day'} {values.day}
              </Typography>
              <Icon
                icon="mdi:mode-edit"
                onClick={() => {
                  setEdit(true);
                  setDayName(values?.day);
                }}
              />
            </>
          )}
        </Box>

        {values?.data?.length > 0 &&
          values?.data?.map((data, index) => {
            return (
              <Box key={index}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "start",
                    gap: "25px",
                  }}
                >
                  {data?.type === "call" ? (
                    <Icon icon="mdi:telephone" style={{ fontSize: "40px" }} />
                  ) : (
                    <Icon
                      icon="mdi:message-processing-outline"
                      style={{ fontSize: "40px" }}
                    />
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "25px",
                      }}
                    >
                      <Box sx={{ width: "320px" }}>
                        {data.callType === "regular" ? (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              flexWrap: "wrap",
                              gap: "20px",
                            }}
                          >
                            <TextField
                              label={`Step # ${index + 1}`}
                              variant="outlined"
                              sx={{ width: "150px" }}
                              value={data?.value}
                              onChange={(e) =>
                                handleUpdateSteps(e.target.value, index)
                              }
                            />
                            <FormControl>
                              <InputLabel id="demo-simple-select-outlined-label">
                                {data?.minOrHour}
                              </InputLabel>
                              <Select
                                sx={{ width: "150px" }}
                                value={data?.minOrHour}
                                onChange={(e) =>
                                  handleUpdateHoursMin(e.target.value, index)
                                }
                                label={data?.minOrHour}
                                id="demo-simple-select-outlined"
                                labelId="demo-simple-select-outlined-label"
                              >
                                <MenuItem value="min">min</MenuItem>
                                <MenuItem value="hours">hours</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        ) : (
                          <Box sx={{ width: "150px" }}>
                            <TimePicker
                              onChange={(e) => handleUpdateTime(e, index)}
                              value={data?.time ? dayjs(data?.time) : null}
                              ampm={false}
                              format={"HH.MM"}
                              label={`Step # ${index + 1}`}
                            />
                          </Box>
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: "150px",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                          }}
                        >
                          <FormControl>
                            <RadioGroup
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                "& * > ": {
                                  margin: "0 !important",
                                },
                              }}
                              aria-labelledby="demo-radio-buttons-group-label"
                              value={data?.callType}
                              name="radio-buttons-group"
                              onChange={(e) => {
                                handleUpdateCallType(e.target.value, index);
                              }}
                            >
                              <FormControlLabel
                                value="regular"
                                control={
                                  <Radio
                                    sx={{
                                      "& .MuiSvgIcon-root": { display: "none" },
                                    }}
                                  />
                                }
                                label={
                                  <Icon
                                    style={{
                                      fontSize: "24px",
                                      color:
                                        data.callType === "regular"
                                          ? "#0C47B7"
                                          : "",
                                    }}
                                    icon="mdi:alarm-clock"
                                  />
                                }
                              />

                              <FormControlLabel
                                value="schedule"
                                control={
                                  <Radio
                                    sx={{
                                      "& .MuiSvgIcon-root": { display: "none" },
                                    }}
                                  />
                                }
                                label={
                                  <Icon
                                    style={{
                                      fontSize: "24px",
                                      color:
                                        data.callType === "schedule"
                                          ? "0C47B7"
                                          : "",
                                    }}
                                    icon="mdi:schedule"
                                  />
                                }
                              />
                            </RadioGroup>
                          </FormControl>
                        </Box>
                        {data.callType === "regular" ? (
                          <Typography>
                            {index === 0 ? (
                              <Translations text={"After lead comes in"} />
                            ) : (
                              <Translations text={"After last attempt"} />
                            )}{" "}
                          </Typography>
                        ) : (
                          ""
                        )}
                      </Box>
                      <Box
                        sx={{ display: "flex", flexWrap: "wrap", gap: "15px" }}
                      >
                        <Icon
                          onClick={() => handleDelete(index)}
                          icon="mdi:bin-outline"
                          style={{ cursor: "pointer", fontSize: "30px" }}
                        />
                        <Icon
                          icon="mdi:message-processing-outline"
                          onClick={() => handleMessage(index)}
                          style={{ cursor: "pointer", fontSize: "30px" }}
                        />
                        <Icon
                          icon="mdi:telephone"
                          onClick={handleCall}
                          style={{ cursor: "pointer", fontSize: "30px" }}
                        />
                      </Box>
                    </Box>

                    {data.type === "sms" && (
                      <Grid item xs={12} sm={10} md={6} mt={5}>
                        <TextField
                          sx={{ width: "100%" }}
                          id="outlined-multiline-static"
                          label={t("SMS message")}
                          value={data?.smsText}
                          multiline
                          onChange={(e) =>
                            handleSetMessageText(e.target.value, index)
                          }
                          rows={4}
                        />
                      </Grid>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
      </Grid>
    </Grid>
  );
};

export default DayCallSmsCard;
