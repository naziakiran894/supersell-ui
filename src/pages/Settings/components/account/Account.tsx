import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  Box,
  Grid,
  Card,
  Button,
  Switch,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Select,
  FormHelperText,
  CircularProgress,
} from "@mui/material";

import { Formik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

import {
  useGetUserDetailByIdQuery,
  useUpdateDoNotDisturbStatusMutation,
  useUpdateUserMutation,
} from "../../../../store/services";
import { RootState } from "../../../../store/index";
import { useSelector } from "react-redux";
import { userTypes } from "../../../../store/types/globalTypes";
import APP_ROUTES from "../../../../Routes/routes";
import { IUser } from "../../../../store/types/user.types";
import PageLoader from "../../../../@core/components/loader/PageLoader";
import { ITimezone } from "../../../../store/types/timezone.types";
import { Translation, useTranslation } from "react-i18next";
import Translations from "../../../../@core/layouts/Translations";
// import { error } from "console";

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return "";
  }
};

const schema = Yup.object().shape({
  language: Yup.string().required(),
  phone: Yup.string()
    .matches(/^\+?[0-9]{10,13}$/, "Phone number is not valid")
    .required("Phone number is required"),
  timezone: Yup.string()
    .min(3, (obj) => showErrors("TimeZone", obj.value.length, obj.min))
    .required(),
  firstName: Yup.string().required("Please enter your First name "),
  lastName: Yup.string(),
});

const Account = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [handleUpdateUser, { isLoading, isSuccess, error }] =
    useUpdateUserMutation();

  const currentUserStore: any = useSelector((state: RootState) => state.auth);
  const timezoneList: any = useSelector(
    (state: RootState) => state.timeZones?.timezone
  );

  const userId = currentUserStore?.user?.id;
  const {
    data,
    isLoading: isLoadingInfo,
    refetch,
  } = useGetUserDetailByIdQuery(userId ? userId : "");

  const [apiData, setApiData] = useState<IUser>();

  const { enqueueSnackbar } = useSnackbar();

  const [handleUpdateStatus, { isSuccess: isUpdated }] =
    useUpdateDoNotDisturbStatusMutation();

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isUpdated) {
      enqueueSnackbar(
        <Translations text="Do not disturb status update successfully." />,
        {
          variant: "success",
        }
      );
    }
  }, [isUpdated]);

  useEffect(() => {
    //@ts-ignore
    if (data?.data) {
      //@ts-ignore
      setApiData(data?.data as IUser);
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(
        <Translations text="User Details Updated Successfully" />,
        {
          variant: "success",
        }
      );
    } else if (error) {
      //@ts-ignore
      enqueueSnackbar(error, { variant: "error" });
    }
  }, [isSuccess, error]);

  async function handleSubmit(values: IUser) {
    let notify = "";
    if (values.sendSms && values.sendEmail) {
      notify = "both";
    } else if (values.sendSms) {
      notify = "sms";
    } else if (values.sendEmail) {
      notify = "email";
    }
    const user = {
      firstName: values.firstName,
      lastName: values.lastName,
      language: values.language,
      email: values.email,
      phone: values.phone,
      timezone: values.timezone,
      roleId: values.userRoles,
      notifyVia: notify,
      companyId: values.companyId,
      _id: apiData?._id,
    };
    await handleUpdateUser(user);
  }

  if (isLoadingInfo) {
    return <PageLoader />;
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
        <FormControlLabel
          label={t("DO NOT DISTURB")}
          control={
            <Switch
              checked={apiData?.doNotDisturbStatus}
              onChange={(e) => {
                //@ts-ignore
                setApiData((pre) => ({
                  ...pre,
                  doNotDisturbStatus: e.target.checked,
                }));
                handleUpdateStatus({
                  id: userId,
                  doNotDisturbStatus: e.target.checked,
                });
              }}
            />
          }
          sx={{ "& .MuiTypography-root": { fontWeight: 300 } }}
        />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <Box
            aria-labelledby="user-view-edit"
            aria-describedby="user-view-edit-description"
            sx={{ "& .MuiPaper-root": { width: "100%", maxWidth: 650 } }}
          >
            {apiData?._id && (
              <Formik
                initialValues={{
                  email: apiData.email,
                  firstName: apiData.firstName,
                  lastName: apiData.lastName,
                  language: apiData.language,
                  phone: apiData.phone,
                  timezone: apiData.timezone,
                  sendEmail:
                    apiData.notifyVia === "both" ||
                    apiData.notifyVia === "email",

                  sendSms:
                    apiData.notifyVia === "both" || apiData.notifyVia === "sms",
                }}
                validationSchema={schema}
                onSubmit={(values) => {
                  //@ts-ignore
                  handleSubmit(values);
                }}
              >
                {({ errors, touched, values, handleChange, handleSubmit }) => {
                  return (
                    <form onSubmit={handleSubmit}>
                      <DialogContent
                        sx={{
                          pb: (theme) => `${theme.spacing(8)} !important`,
                          px: (theme) => [
                            `${theme.spacing(5)} !important`,
                            `${theme.spacing(15)} !important`,
                          ],
                        }}
                      >
                        <Grid container spacing={6} sx={{ mt: 4 }}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label={t("First Name")}
                              name="firstName"
                              onChange={handleChange}
                              value={values.firstName}
                              error={
                                touched.firstName && Boolean(errors.firstName)
                              }
                              helperText={touched.firstName && errors.firstName}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label={t("Last Name")}
                              name="lastName"
                              onChange={handleChange}
                              value={values.lastName}
                              error={
                                touched.lastName && Boolean(errors.lastName)
                              }
                              helperText={touched.lastName && errors.lastName}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              disabled={true}
                              label={t("Email")}
                              name="email"
                              id="email"
                              onChange={handleChange}
                              value={values.email}
                              error={touched.email && Boolean(errors.email)}
                              helperText={touched.email && errors.email}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label={t("Phone")}
                              name="phone"
                              type="string"
                              onChange={handleChange}
                              value={values.phone}
                              error={touched.phone && Boolean(errors.phone)}
                              helperText={touched.phone && errors.phone}
                            />
                          </Grid>
                          {currentUserStore.user.roleName ===
                            userTypes.SUPER_ADMIN && (
                            <Grid item xs={12} sm={6}>
                              <FormControl
                                error={
                                  touched.timezone && Boolean(errors.timezone)
                                }
                                fullWidth
                              >
                                <InputLabel id=" TimeZone">
                                  {t("Time Zone")}
                                </InputLabel>
                                <Select
                                  fullWidth
                                  label={t("Time Zone")}
                                  name="timezone"
                                  onChange={handleChange}
                                  value={values.timezone}
                                >
                                  {timezoneList?.map((e: ITimezone) => {
                                    return (
                                      <MenuItem key={e._id} value={e.timezone}>
                                        {e.timezone}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                                {touched.timezone && errors.timezone && (
                                  <FormHelperText>
                                    {errors.timezone}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                          )}
                          <Grid item xs={12} sm={6}>
                            <FormControl
                              error={
                                touched.language && Boolean(errors.language)
                              }
                              fullWidth
                            >
                              <InputLabel id="user-view-language-label">
                                {t("Language")}
                              </InputLabel>
                              <Select
                                fullWidth
                                label={t("Language")}
                                name="language"
                                value={values.language}
                                onChange={handleChange}
                              >
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="fi">Finnish</MenuItem>
                              </Select>
                              {touched.language && errors.language && (
                                <FormHelperText>
                                  {errors.language}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} sm={12}>
                            <Typography sx={{ mt: 8, ml: 4 }}>
                              {t("Notification")}
                            </Typography>
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "start",
                            }}
                          >
                            <FormControlLabel
                              label={t("Email")}
                              control={
                                <Switch
                                  checked={values.sendEmail}
                                  name="sendEmail"
                                  onChange={handleChange}
                                  sx={{ ml: 50 }}
                                />
                              }
                              sx={{
                                "& .MuiTypography-root": {
                                  fontWeight: 300,
                                  marginLeft: "26px",
                                },
                                flexDirection: "row-reverse",
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sx={{ display: "flex", justifyContent: "start" }}
                          >
                            <FormControlLabel
                              label={t("SMS")}
                              control={
                                <Switch
                                  checked={values.sendSms}
                                  onChange={handleChange}
                                  name="sendSms"
                                  sx={{ ml: 50 }}
                                />
                              }
                              sx={{
                                "& .MuiTypography-root": {
                                  fontWeight: 300,
                                  marginLeft: "26px",
                                },
                                flexDirection: "row-reverse",
                              }}
                            />
                          </Grid>
                        </Grid>
                      </DialogContent>

                      <DialogActions
                        sx={{
                          justifyContent: "start",
                          px: (theme) => [
                            `${theme.spacing(5)} !important`,
                            `${theme.spacing(15)} !important`,
                          ],
                          pb: (theme) => [
                            `${theme.spacing(8)} !important`,
                            `${theme.spacing(8.5)} !important`,
                          ],
                        }}
                      >
                        <Grid
                          item
                          display="flex"
                          justifyContent="space-between"
                          xs={12}
                          sm={12}
                          sx={{ mt: 5 }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            sx={{ mr: 2, ml: 4, width: "205px" }}
                          >
                            {isLoading ? (
                              <CircularProgress
                                size={20}
                                sx={{ color: "white" }}
                              />
                            ) : (
                              <Translations text={"SAVE CHANGES"} />
                            )}
                          </Button>
                          <Button
                            component={Link}
                            to={APP_ROUTES.setPassword}
                            variant="contained"
                            sx={{ mr: 2 }}
                          >
                            {t("RESET PASSWORD")}
                          </Button>
                        </Grid>
                      </DialogActions>
                    </form>
                  );
                }}
              </Formik>
            )}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Account;
