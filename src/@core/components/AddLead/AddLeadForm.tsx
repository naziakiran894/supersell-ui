import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Autocomplete,
  FormControl,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { FormikProps } from "formik";
import {
  useGetAllTeamsQuery,
  useGetTeamUserListQuery,
} from "../../../store/services";
import dayjs from "dayjs";

import { Field, IField } from "../../../store/types/fields.types";
import { RootState } from "../../../store";
import { ILead } from "../../../store/types/lead.types";
import { IUserList } from "../../../store/types/user.types";
import { defaultTimeFormat } from "../../../store/types/globalTypes";
import { useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";

interface IFormProps {
  props: FormikProps<any>;
  leadDetails: ILead;
  fields: Field[];
  fieldSettings: IField | null;
  title?: string;
  teamName: string;
  setTeamName: React.Dispatch<React.SetStateAction<string>>;
}

const AddLeadForm = ({
  props,
  teamName,
  setTeamName,
  leadDetails,
  fields,
  fieldSettings,
  title,
}: IFormProps) => {
  const {
    errors,
    touched,
    values: formikValues,
    handleChange,
    setFieldValue,
  } = props;

  const { t } = useTranslation();
  const [selectedTeam, setSelectedTeam] = useState("");
  const { data: teamData } = useGetAllTeamsQuery("");
  //@ts-ignore
  const teams: ITeamList[] = teamData?.data;

  const { data, isLoading } = useGetTeamUserListQuery(selectedTeam, {
    skip: !selectedTeam,
  });

  const timeZoneList = useSelector(
    (state: RootState) => state.timeZones.timezone
  );

  const clientTimeSetting = useSelector(
    (state: RootState) => state.clientSetting.ClientSetting
  );

  //@ts-ignore
  const usersList: IUserList[] = data?.data?.list;
  useEffect(() => {
    if (leadDetails?._id) {
      if (leadDetails?.teamId) {
        setFieldValue("teamId", leadDetails.teamId);
        setSelectedTeam(leadDetails.teamId);
      }
      if (leadDetails?.leadOwnerId) {
        setFieldValue("leadOwnerId", leadDetails.leadOwnerId);
      }
      fields.map((e: Field) => {
        //@ts-ignore
        setFieldValue(e.keyName, leadDetails[e.keyName]);
      });
      leadDetails?.leadExtraFields?.length &&
        leadDetails?.leadExtraFields?.forEach((obj) => {
          for (let key in obj) {
            setFieldValue(key, obj[key]);
          }
        });
    }
  }, [leadDetails]);

  const handleKeyPress = (event: any) => {
    // Allow only numeric characters (0-9) and some control keys (e.g., Backspace, Arrow keys)
    const allowedKeys = /[0-9]|ArrowLeft|ArrowRight|Backspace|Delete|Home|End/;

    if (!allowedKeys.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <>
      {fieldSettings !== null &&
        Object.entries(fieldSettings).map(([key, values]) => {
          if (
            key !== "offersAndDeals" &&
            (title === undefined || title === key) &&
            typeof values === "object" &&
            values?.filter((field: Field) => field.visible)?.length > 0
          ) {
            return (
              <div id={key}>
                <Grid container alignItems="flex-start" spacing={5}>
                  {typeof values === "object" && values !== null && (
                    <Grid mt={5} item xs={12}>
                      <Typography
                        sx={{ textTransform: "capitalize" }}
                        variant="h6"
                      >
                        <Translations
                          text={key}
                        />
                      </Typography>
                    </Grid>
                  )}

                  {typeof values === "object" &&
                    //@ts-ignore
                    values
                      ?.filter((field: Field) => field.visible)
                      ?.map((e: Field, index: number) => {
                        if (e.type === "text" && e.keyName === "timezone") {
                          return (
                            <Grid key={index} item sm={6} xs={12}>
                              <FormControl
                                error={
                                  touched.timeZone && Boolean(errors.timeZone)
                                }
                                fullWidth
                              >
                                <Autocomplete
                                  value={
                                    timeZoneList?.find(
                                      (timezone) =>
                                        timezone.timezone ===
                                        formikValues[e.keyName]
                                    ) || null
                                  }
                                  onChange={(_event, data) =>
                                    setFieldValue(e.keyName, data?.timezone)
                                  }
                                  options={timeZoneList || []}
                                  getOptionLabel={(option) => {
                                    return ` ${option.countryName}-${option.timezone}`;
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} label={e.value} />
                                  )}
                                />
                              </FormControl>
                            </Grid>
                          );
                        }

                        if (e.keyName === "zipCode") {
                          return (
                            <Grid item sm={6} xs={12}>
                              <TextField
                                fullWidth
                                type="text"
                                label={t(e.value)}
                                name={e.keyName}
                                multiline={e.type === "largeText"}
                                rows={e.type === "largeText" ? 5 : 1}
                                onKeyPress={handleKeyPress}
                                onChange={handleChange}
                                value={formikValues[e.keyName]}
                                error={
                                  touched[e.keyName] &&
                                  Boolean(errors[e.keyName])
                                }
                                helperText={
                                  (touched[e.keyName] as boolean) &&
                                  (errors[e.keyName] as string)
                                }
                              />
                            </Grid>
                          );
                        }

                        if (
                          e.type === "text" ||
                          e.type === "number" ||
                          e.type === "largeText"
                        ) {
                          return (
                            <Grid item sm={6} xs={12}>
                              <TextField
                                fullWidth
                                type={e.type}
                                label={t(e.value)}
                                name={e.keyName}
                                multiline={e.type === "largeText"}
                                rows={e.type === "largeText" ? 5 : 1}
                                onChange={handleChange}
                                value={formikValues[e.keyName]}
                                error={
                                  touched[e.keyName] &&
                                  Boolean(errors[e.keyName])
                                }
                                helperText={
                                  (touched[e.keyName] as boolean) &&
                                  (errors[e.keyName] as string)
                                }
                              />
                            </Grid>
                          );
                        }

                        if (e.type === "date") {
                          return (
                            <Grid item sm={6} xs={12}>
                              <FormControl fullWidth>
                                <DatePicker
                                  label={t(e.value)}
                                  slotProps={{
                                    textField: {
                                      error:
                                        touched[e.keyName] &&
                                        Boolean(errors[e.keyName]),
                                      helperText:
                                        (touched[e.keyName] as boolean) &&
                                        (errors[e.keyName] as string),
                                    },
                                  }}
                                  // format="DD/MM/YYYY"
                                  format={
                                    clientTimeSetting?.defaultDateTimeFormat ||
                                    "DD.MM.YYYY hh.mm"
                                  }
                                  value={
                                    formikValues[e.keyName]
                                      ? dayjs(formikValues[e.keyName])
                                      : null
                                  }
                                  onChange={(date) => {
                                    setFieldValue(e.keyName, date);
                                  }}
                                />
                              </FormControl>
                            </Grid>
                          );
                        }

                        if (e.type === "dateAndTime") {
                          return (
                            <Grid item sm={6} xs={12}>
                              <FormControl fullWidth>
                                <DateTimePicker
                                  ampm={
                                    clientTimeSetting?.defaultDateTimeFormat ===
                                    defaultTimeFormat["12h"]
                                  }
                                  label={t(e.value)}
                                  slotProps={{
                                    textField: {
                                      error:
                                        touched[e.keyName] &&
                                        Boolean(errors[e.keyName]),
                                      helperText:
                                        (touched[e.keyName] as boolean) &&
                                        (errors[e.keyName] as string),
                                    },
                                  }}
                                  format={
                                    clientTimeSetting?.defaultDateTimeFormat ||
                                    "DD.MM.YYYY hh.mm"
                                  }
                                  value={
                                    formikValues[e.keyName]
                                      ? dayjs(formikValues[e.keyName])
                                      : null
                                  }
                                  onChange={(date) => {
                                    setFieldValue(e.keyName, date);
                                  }}
                                />
                              </FormControl>
                            </Grid>
                          );
                        }
                      })}

                  {(title === "about" || key === "about") && (
                    <Grid item sm={6} xs={12}>
                      <FormControl
                        error={touched.teamId && Boolean(errors.teamId)}
                        fullWidth
                      >
                        <Autocomplete
                          value={
                            teams?.find(
                              (item) => item?._id === formikValues["teamId"]
                            ) || null
                          }
                          onChange={(e, data) => {
                            setFieldValue("teamId", data?._id);
                            setSelectedTeam(data?._id);
                            setFieldValue("leadOwnerId", undefined);
                          }}
                          options={teams || []}
                          getOptionLabel={(option) => option?.teamName}
                          renderInput={(params) => (
                            <TextField
                              error={touched.teamId && Boolean(errors.teamId)}
                              helperText={
                                touched.teamId && (errors.teamId as string)
                              }
                              name="teamId"
                              {...params}
                              label={t("Team")}
                            />
                          )}
                        />
                        {/* {touched.teamId && (
                          <FormHelperText>{errors.teamId}</FormHelperText>
                        )} */}
                      </FormControl>
                    </Grid>
                  )}

                  {(title === "about" || key === "about") && (
                    <Grid item sm={6} xs={12}>
                      <FormControl
                        error={
                          touched.leadOwnerId && Boolean(errors.leadOwnerId)
                        }
                        fullWidth
                      >
                        <Autocomplete
                          value={
                            usersList?.find(
                              (user) =>
                                user?.userId === formikValues["leadOwnerId"]
                            ) || null
                          }
                          onChange={(_event, data) =>
                            setFieldValue("leadOwnerId", data?.userId)
                          }
                          options={usersList || []}
                          getOptionLabel={(option) => {
                            {
                              isLoading && (
                                <CircularProgress
                                  size={10}
                                  sx={{ color: "blue" }}
                                />
                              );
                            }
                            if (option.firstName) {
                              return ` ${option?.firstName} ${option?.lastName}`;
                            } else return "No user found";
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label={t("Lead Owner")} />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
              </div>
            );
          }
        })}
    </>
  );
};

export default AddLeadForm;
