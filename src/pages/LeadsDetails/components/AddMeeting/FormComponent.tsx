import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { FormikProps } from "formik";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers";
import {
  FormHelperText,
  Grid,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { IAddMeetings } from "../../../Meetings/components/EditMeetingDialog";
import { RootState } from "../../../../store";

import {
  useGetLeadDetailsByIdQuery,
  useGetUsersListQuery,
} from "../../../../store/services";

import { Field } from "../../../../store/types/fields.types";
import {
  IMeetingSettingRes,
  IMeetingSettingsApiData,
} from "../../../../store/types/meetingSettings.types";
import { ITimezone } from "../../../../store/types/timezone.types";
import { ILead } from "../../../../store/types/lead.types";
import { handleReplaceDynVar } from "../../../../lib/dynamicVariableReplacer";
import { IMeeting } from "../../../../store/types/meeting.types";
import { defaultTimeFormat } from "../../../../store/types/globalTypes";
import { Translation, useTranslation } from "react-i18next";
import Translations from "../../../../@core/layouts/Translations";
interface IFormProps {
  props: FormikProps<IAddMeetings>;
  meetingSettings: IMeetingSettingRes;
  meetingData: IMeetingSettingsApiData | null;
  setMeetingData: any;
  leadDetails: any;
  meetingDetails?: IMeeting | null;
}

const FormComponent = ({
  props,
  meetingSettings,
  meetingData,
  setMeetingData,
  leadDetails,
  meetingDetails,
}: IFormProps) => {
  const {
    errors,
    touched,
    values: formikValues,
    handleChange,
    setFieldValue,
  } = props;

  const [selectedMeeting, setSelectedMeeting] = useState("");

  const timeZoneList = useSelector(
    (state: RootState) => state.timeZones.timezone
  );
  const timeFormat = useSelector(
    (state: RootState) =>
      state.clientSetting?.ClientSetting?.defaultDateTimeFormat
  );

  const { t } = useTranslation();

  const clientTimeSetting = useSelector(
    (state: RootState) => state.clientSetting.ClientSetting
  );

  const handleSelectMeeting = (e: string) => {
    setSelectedMeeting(e);
  };
  const { data: userList } = useGetUsersListQuery("");
  //@ts-ignore'
  const users = userList?.data;

  useEffect(() => {
    if (leadDetails?._id) {
      setFieldValue("leadEmail", leadDetails?.email);
      setFieldValue("leadId", leadDetails?._id);
    }

    if (meetingDetails) {
      Object.entries(meetingDetails).map(([key, value]) => {
        if (typeof value !== "object") {
          //@ts-ignore
          setFieldValue(key, meetingDetails[key]);
        }
        if (key === "meetingParticipant") {
          //@ts-ignore
          setFieldValue("meetingParticipant", value?._id);
        }
        if (key === "meetingId") {
          //@ts-ignore
          setFieldValue("meetingId", value?._id);
          //@ts-ignore
          handleSelectMeeting(value?._id);
        }
        if (key === "extraFields") {
          //@ts-ignore
          value?.forEach((item) => {
            Object.entries(item).forEach(([itemKey, itemValue]) => {
              setFieldValue(itemKey, itemValue);
            });
          });
        }
      });
    }
  }, [leadDetails, meetingDetails]);

  useEffect(() => {
    setMeetingData(
      meetingSettings?.meetings.find(
        (meeting) => meeting._id === selectedMeeting
      )
    );
  }, [selectedMeeting, meetingSettings?.meetings]);

  const renderTimeZones = useMemo(() => {
    return timeZoneList?.map((e: ITimezone, index: number) => {
      return (
        <MenuItem key={index} value={e.timezone}>
          {e.countryName}-{e.timezone}
        </MenuItem>
      );
    });
  }, [timeZoneList]);
  return (
    <>
      {meetingSettings?.meetings != null && (
        <Grid container spacing={6} sx={{ mt: 12, px: 6 }}>
          <Grid item xs={12} sx={{ alignItems: "center" }}>
            <FormControl
              fullWidth
              error={touched.meetingId && Boolean(errors.meetingId)}
            >
              <InputLabel id="meetingId">{t("Select Meeting")}</InputLabel>
              <Select
                name="meetingId"
                label={t("Select Meeting")}
                id="meetingId"
                labelId="meetingId"
                //@ts-ignore
                value={formikValues.meetingId}
                onChange={(e: SelectChangeEvent<string>) => {
                  handleChange(e);
                  handleSelectMeeting(e.target.value);
                }}
              >
                {meetingSettings?.meetings?.map(
                  (meeting: IMeetingSettingsApiData, index: number) => {
                    return (
                      <MenuItem key={index} value={meeting._id}>
                        {leadDetails &&
                          handleReplaceDynVar(
                            leadDetails,
                            meeting?.meetingBasicInfo?.meetingTitle
                          )}
                      </MenuItem>
                    );
                  }
                )}
              </Select>
              <FormHelperText>
                {touched.meetingId && (errors.meetingId as String)}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            lg={7}
            sx={{ textAlign: "center", alignItems: "center" }}
          >
            <FormControl
              fullWidth
              error={touched.meetingDate && Boolean(errors.meetingDate)}
            >
              <DateTimePicker
                label={t("DATE & TIME")}
                ampm={
                  clientTimeSetting?.defaultDateTimeFormat ===
                  defaultTimeFormat["12h"]
                }
                format={
                  clientTimeSetting?.defaultDateTimeFormat || "DD.MM.YYYY hh.mm"
                }
                value={
                  formikValues?.meetingDate
                    ? dayjs(formikValues.meetingDate)
                    : null
                }
                onChange={(newValue) => setFieldValue("meetingDate", newValue)}
                slotProps={{
                  textField: {
                    error: touched.meetingDate && Boolean(errors.meetingDate),
                  },
                }}
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            lg={5}
            sx={{ textAlign: "center", alignItems: "center" }}
          >
            <FormControl fullWidth>
              <InputLabel id="meetingDuration">{t("Duration")}</InputLabel>
              <Select
                id="meetingDuration"
                value={formikValues.meetingDuration || 2}
                label={t("Duration")}
                name="meetingDuration"
                onChange={handleChange}
              >
                <MenuItem value={1}>30 min</MenuItem>
                <MenuItem value={2}>1 hour</MenuItem>
                <MenuItem value={3}>2 hours</MenuItem>
                <MenuItem value={4}>3 hours</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" fontWeight={500}>
              {t("PARTICIPANTS")}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ alignItems: "center" }}>
            <FormControl
              fullWidth
              error={
                touched.meetingParticipant && Boolean(errors.meetingParticipant)
              }
            >
              <InputLabel id="meetingParticipant" sx={{ weight: 500 }}>
                {t("User")}
              </InputLabel>
              <Select
                name="meetingParticipant"
                label={t("User")}
                id="meetingParticipant"
                labelId="meetingParticipant"
                value={formikValues.meetingParticipant}
                onChange={handleChange}
              >
                {users?.map((e: any, index: number) => {
                  return (
                    <MenuItem key={index} value={e._id}>
                      {e.firstName} {e.lastName}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>
                {touched.meetingParticipant &&
                  (errors.meetingParticipant as string)}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center", alignItems: "center" }}>
            <TextField
              name="leadEmail"
              value={formikValues.leadEmail}
              onChange={handleChange}
              error={touched.leadEmail && Boolean(errors.leadEmail)}
              helperText={touched.leadEmail && (errors.leadEmail as string)}
              fullWidth
              label={t("Lead")}
            />
          </Grid>
          {meetingData?.showExtraFields &&
            Object.entries(meetingData?.fields).map(([key, values], index) => {
              return (
                <Grid key={index} item xs={12}>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{ mb: "1.7rem" }}
                  >
                    {key.toUpperCase()}
                  </Typography>
                  {values?.map((e: Field, innerIndex: number) => {
                    if (e.type === "text" && e.keyName === "timeZone") {
                      return (
                        <Grid
                          item
                          xs={12}
                          sx={{ mb: "1.7rem" }}
                          key={innerIndex}
                        >
                          <FormControl fullWidth>
                            <InputLabel id="TimeZone">{e.value}</InputLabel>
                            <Select
                              fullWidth
                              label={e.value}
                              name={e.keyName}
                              onChange={handleChange}
                              defaultValue={leadDetails[e.keyName]}
                              value={formikValues[e.keyName]}
                            >
                              {renderTimeZones}
                            </Select>
                          </FormControl>
                        </Grid>
                      );
                    }

                    if (
                      e.type === "text" ||
                      e.type === "number" ||
                      e.type === "largeText"
                    ) {
                      return (
                        <Grid
                          key={innerIndex}
                          item
                          xs={12}
                          sx={{ mb: "1.7rem" }}
                        >
                          <TextField
                            fullWidth
                            type={e.type}
                            label={e.value}
                            name={e.keyName}
                            defaultValue={leadDetails[e.keyName]}
                            multiline={e.type === "largeText"}
                            rows={e.type === "largeText" ? 5 : 1}
                            onChange={handleChange}
                            value={formikValues[e.keyName]}
                          />
                        </Grid>
                      );
                    }

                    if (e.type === "date") {
                      return (
                        <Grid
                          key={innerIndex}
                          item
                          xs={12}
                          sx={{ mb: "1.7rem" }}
                        >
                          <FormControl fullWidth>
                            <DatePicker
                              label={e.value}
                              defaultValue={
                                leadDetails[e.keyName]
                                  ? dayjs(leadDetails[e.keyName])
                                  : null
                              }
                              value={
                                formikValues[e.keyName]
                                  ? dayjs(formikValues[e.keyName])
                                  : null
                              }
                              onChange={(date: any) => {
                                setFieldValue(e.keyName, date);
                              }}
                              format={
                                clientTimeSetting?.defaultDateTimeFormat ||
                                "DD.MM.YYYY hh.mm"
                              }
                            />
                          </FormControl>
                        </Grid>
                      );
                    }

                    if (e.type === "dateAndTime") {
                      return (
                        <Grid
                          key={innerIndex}
                          item
                          xs={12}
                          sx={{ mb: "1.7rem" }}
                        >
                          <FormControl fullWidth>
                            <DateTimePicker
                              ampm={
                                clientTimeSetting?.defaultDateTimeFormat ===
                                defaultTimeFormat["12h"]
                              }
                              label={e.value}
                              defaultValue={
                                leadDetails[e.keyName]
                                  ? dayjs(leadDetails[e.keyName])
                                  : null
                              }
                              value={
                                formikValues[e.keyName]
                                  ? dayjs(formikValues[e.keyName])
                                  : null
                              }
                              onChange={(date: any) => {
                                setFieldValue(e.keyName, date);
                              }}
                              format={
                                clientTimeSetting?.defaultDateTimeFormat ||
                                "DD.MM.YYYY hh.mm"
                              }
                            />
                          </FormControl>
                        </Grid>
                      );
                    }
                  })}
                </Grid>
              );
            })}
        </Grid>
      )}
    </>
  );
};

export default FormComponent;
