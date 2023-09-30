import { useEffect } from "react";
import {
  Grid,
  Select,
  Switch,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Field, FormikProps } from "formik";
import { RootState } from "../../../../store";
import { userTypes } from "../../../../store/types/globalTypes";
import { IUser, IUserRoles } from "../../../../store/types/user.types";
import { ICompanyType } from "../../../../store/types/company.types";

import { IUserData } from "../AddUserDialog/AddUserDialog";
import { useTranslation } from "react-i18next";
import Translations from "../../../../@core/layouts/Translations";

interface IFormProps {
  props: FormikProps<IUserData>;
  userDetails: IUser;
}

const AddUserForm = ({ props, userDetails }: IFormProps) => {
  const { errors, touched, values, handleChange, setFieldValue } = props;
  const user = useSelector((state: RootState) => state.auth.user);
  const userRoleStore = useSelector(
    (state: RootState) => state.userRoles.userRoles
  );
  const companyStore = useSelector((state: RootState) => state.companies);
  const timezoneStore = useSelector((state: RootState) => state.timeZones);
  const companyList = companyStore.companies;
  const timezoneList = timezoneStore.timezone;

  const userRoles = userRoleStore.filter(
    (item) => item.roleName !== userTypes.SUPER_ADMIN
  );
  const { t } = useTranslation();

  console.log("errors", errors);

  useEffect(() => {
    if (userDetails?._id) {
      setFieldValue("firstName", userDetails.firstName);
      setFieldValue("lastName", userDetails.lastName);
      setFieldValue("email", userDetails.email);
      setFieldValue("phone", userDetails.phone);
      setFieldValue("timeZone", userDetails.timezone);
      setFieldValue("language", userDetails.language);
      //@ts-ignore
      setFieldValue("userRoles", userDetails?.roleId?._id);
      //@ts-ignore
      setFieldValue("companyId", userDetails?.companyId?._id);
      setFieldValue("doNotDisturbStatus", userDetails?.doNotDisturbStatus);
      setFieldValue(
        "smsNotification",
        userDetails?.notifyVia === "both" || userDetails?.notifyVia === "sms"
      );
      setFieldValue(
        "emailNotification",
        userDetails?.notifyVia === "both" || userDetails?.notifyVia === "email"
      );
      setFieldValue("doNotDisturbStatus", userDetails?.doNotDisturbStatus);
    }
  }, [userDetails]);

  console.log("userrr", user);

  return (
    <>
      <Grid container spacing={6} sx={{ mt: 12 }}>
        <Grid item sm={6} xs={12}>
          <TextField
            fullWidth
            label={t("First Name")}
            name={"firstName"}
            onChange={handleChange}
            value={values?.firstName}
            error={touched.firstName && Boolean(errors.firstName)}
            helperText={touched.firstName && errors.firstName}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            fullWidth
            label={t("Last Name")}
            name={"lastName"}
            onChange={handleChange}
            value={values.lastName}
            error={touched.lastName && Boolean(errors.lastName)}
            helperText={touched.lastName && errors.lastName}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            //@ts-ignore
            disabled={userDetails?.email}
            fullWidth
            label={t("Email")}
            name={"email"}
            id="email"
            onChange={handleChange}
            value={values.email}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            fullWidth
            label={t("Phone")}
            name={"phone"}
            onChange={handleChange}
            value={values.phone}
            error={touched.phone && Boolean(errors.phone)}
            helperText={touched.phone && errors.phone}
          />
        </Grid>
        {
          //@ts-ignore
          userDetails?.roleId?.roleName !== userTypes.SUPER_ADMIN && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    id={t("timeZone")}
                    value={
                      timezoneList?.find(
                        (timezone) => timezone.timezone === values.timeZone
                      ) || null
                    }
                    onChange={(_event, data) =>
                      setFieldValue("timeZone", data?.timezone)
                    }
                    options={timezoneList || []}
                    getOptionLabel={(option) => {
                      return ` ${option.countryName}-${option.timezone}`;
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("Timezone")}
                        name="timeZone"
                        error={Boolean(errors.timeZone && touched.timeZone)}
                        helperText={touched.timeZone && errors.timeZone}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={touched.language && Boolean(errors.language)}
                >
                  <InputLabel id="user-view-language-label">
                    <Translations text="Language" />
                  </InputLabel>
                  <Select
                    fullWidth
                    label={t("Language")}
                    name="language"
                    value={values.language}
                    onChange={handleChange}
                    error={touched.language && Boolean(errors.language)}
                  >
                    <MenuItem value="en">
                      <Translations text="English" />
                    </MenuItem>
                    <MenuItem value="fi">
                      <Translations text="Finnish" />
                    </MenuItem>
                  </Select>
                  <FormHelperText>
                    {touched.language && errors.language}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {(user?.roleName !== userTypes.USER || user?.loginAsClient) && (
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={touched.userRoles && Boolean(errors.userRoles)}
                    >
                      <InputLabel id="userRoles">
                        <Translations text="User Role" />
                      </InputLabel>
                      <Select
                        fullWidth
                        label={t("userRoles")}
                        name={"userRoles"}
                        value={values.userRoles}
                        onChange={handleChange}
                      >
                        {userRoles?.map((e: IUserRoles) => {
                          return (
                            <MenuItem key={e._id} value={e._id}>
                              <Translations text={e.roleName} />
                            </MenuItem>
                          );
                        })}
                      </Select>
                      <FormHelperText>
                        {touched.userRoles && errors.userRoles}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                )}
              {user !== null && user.roleName === userTypes.SUPER_ADMIN && (
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    error={touched.companyId && Boolean(errors.companyId)}
                  >
                    <InputLabel id="companyId">
                      <Translations text="Company" />
                    </InputLabel>
                    <Select
                      fullWidth
                      label={t("company Id")}
                      name="companyId"
                      value={values.companyId}
                      onChange={handleChange}
                    >
                      {companyList?.map((e: ICompanyType) => {
                        return (
                          <MenuItem key={e._id} value={e._id}>
                            <Translations text={e.companyName} />
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText>
                      {touched.companyId && errors.companyId}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              )}
            </>
          )
        }
      </Grid>
      <Grid
        container
        sm={10}
        sx={{ mt: 5, px: 3 }}
        justifyContent="space-between"
        spacing={5}
      >
        {!userDetails?._id && (
          <Grid item xs={12} sm={5} spacing={5}>
            <FormControlLabel
              label={t("Send welcome email")}
              control={
                <Switch
                  name="sendWelcomeEmail"
                  checked={values.sendWelcomeEmail}
                  onChange={handleChange}
                  defaultChecked
                />
              }
              sx={{
                justifyContent: "space-between",
                "& .MuiTypography-root": {
                  fontWeight: 300,
                },

                flexDirection: "row-reverse",
                width: "100%",
              }}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={5}>
          <FormControlLabel
            label={t("Do not distrub")}
            control={
              <Switch
                name="doNotDisturbStatus"
                checked={values.doNotDisturbStatus}
                onChange={handleChange}
                defaultChecked
              />
            }
            sx={{
              justifyContent: "space-between",
              "& .MuiTypography-root": {
                fontWeight: 300,
              },

              flexDirection: "row-reverse",
              width: "100%",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <FormControlLabel
            label={t("Email notification")}
            control={
              <Switch
                name="emailNotification"
                checked={values.emailNotification}
                onChange={handleChange}
                defaultChecked
              />
            }
            sx={{
              justifyContent: "space-between",
              "& .MuiTypography-root": {
                fontWeight: 300,
              },

              flexDirection: "row-reverse",
              width: "100%",
            }}
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <FormControlLabel
            label={t("SMS notification")}
            control={
              <Switch
                name="smsNotification"
                checked={values.smsNotification}
                onChange={handleChange}
                defaultChecked
              />
            }
            sx={{
              justifyContent: "space-between",
              "& .MuiTypography-root": {
                fontWeight: 300,
              },

              flexDirection: "row-reverse",
              width: "100%",
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default AddUserForm;
