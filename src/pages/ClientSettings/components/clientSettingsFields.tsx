import { useEffect } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import { useSelector } from "react-redux";
import { FormikProps } from "formik";
import { IFormData } from "../index";
import { RootState } from "../../../store";
import { defaultTimeFormat, userTypes } from "../../../store/types/globalTypes";
import { ITimezone } from "../../../store/types/timezone.types";
import { ICompanyDetailsByID } from "../../../store/types/company.types";
import CustomizedSelect from "../../../@core/components/CustomVariableSelect";
import { Field } from "../../../store/types/fields.types";
import { Translation, useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";

interface IProps {
  props: FormikProps<IFormData>;
  clientDetails: ICompanyDetailsByID;
  dropdownFields?: Field[];
}
const ClientSettingFields = ({
  props,
  clientDetails,
  dropdownFields,
}: IProps) => {
  const { handleChange, values, touched, errors, setFieldValue } = props;
  //@ts-ignore
  const options = dropdownFields?.map((e: any, i) => `{{${e?.keyName}}}`);

  const { t } = useTranslation();

  useEffect(() => {
    setFieldValue("clientName", clientDetails?.companyName);
    setFieldValue("country", clientDetails?.defaultCountryId?._id);
    setFieldValue("date", clientDetails?.defaultDateTimeFormat);
    setFieldValue("currency", clientDetails?.defaultCurrency);

    setFieldValue("language", clientDetails?.defaultLanguage);
    setFieldValue("login", clientDetails?.userLoginType);

    setFieldValue("leadTitle", clientDetails?.leadTitle);
    setFieldValue("leadSubtitle", clientDetails?.leadSubTitle);
    setFieldValue("detailsTitle", clientDetails?.detailsTitle);
    setFieldValue("detailsSubtitle", clientDetails?.detailsSubTitle);
  }, [clientDetails]);

  const user = useSelector((state: RootState) => state?.auth.user);
  const userRoleStore = useSelector(
    (state: RootState) => state.userRoles.userRoles
  );
  const timezoneStore = useSelector((state: RootState) => state.timeZones);
  const timezoneList = timezoneStore.timezone;

  const userRoles = userRoleStore.filter(
    (item: any) => item.roleName !== userTypes.SUPER_ADMIN
  );

  return (
    <>
      <Grid container spacing={5}>
        <Grid item md={5} sm={10} xs={10} mb={5} display="flex">
          <TextField
            label={t("Client Name")}
            variant="outlined"
            fullWidth
            name="clientName"
            value={values.clientName}
            onChange={handleChange}
            error={touched.clientName && Boolean(errors.clientName)}
            helperText={touched.clientName && errors.clientName}
          />
        </Grid>

        <Grid
          item
          sm={10}
          xs={10}
          mb={5}
          md={5}
          display="flex"
          flexWrap="wrap"
          gap="10px"
        >
          <FormControl fullWidth>
            <InputLabel id="date" error={touched.date && Boolean(errors.date)}>
              <Translations text="Date & Time Format" />{" "}
            </InputLabel>
            <Select
              label={t("Date & Time Format")}
              name="date"
              value={values.date}
              onChange={handleChange}
              error={touched.date && Boolean(errors.date)}
            >
              <MenuItem value={defaultTimeFormat["24h"]}>
                DD.MM.YYYY 24h
              </MenuItem>
              <MenuItem value={defaultTimeFormat["12h"]}>
                DD/MM/YYYY 12h
              </MenuItem>
            </Select>
            {touched.date && (
              <FormHelperText>{errors.date as string}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid
          item
          md={5}
          sm={10}
          xs={10}
          mb={5}
          display="flex"
          flexWrap="wrap"
          gap="10px"
        >
          <FormControl
            fullWidth
            error={touched.country && Boolean(errors.country)}
          >
            {values.country && (
              <InputLabel
                id="country"
                error={touched.country && Boolean(errors.country)}
                shrink
              >
                <Translations text="Default Country" />{" "}
              </InputLabel>
            )}
            <Autocomplete
              options={timezoneList || []}
              getOptionLabel={(option) => option?.countryName}
              value={
                timezoneList?.find((item) => item?._id === values.country) ||
                null
              }
              onChange={(e, value) => {
                handleChange({
                  target: {
                    name: "country",
                    value: value?._id || "",
                  },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("Default Country")}
                  error={touched.country && Boolean(errors.country)}
                />
              )}
            />
            {touched.country && (
              <FormHelperText>{errors.country}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid
          item
          md={5}
          sm={10}
          xs={10}
          mb={5}
          display="flex"
          flexWrap="wrap"
          gap="10px"
        >
          <FormControl
            fullWidth
            error={touched.currency && Boolean(errors.currency)}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              <Translations text="Default Currency" />{" "}
            </InputLabel>
            <Select
              label={t("Default Currency")}
              name="currency"
              value={values.currency}
              onChange={handleChange}
              error={touched.currency && Boolean(errors.currency)}
            >
              <MenuItem value={"USD"}>USD</MenuItem>
              <MenuItem value={"Euro"}>{t("Euro")}</MenuItem>
            </Select>
            <FormHelperText>
              {touched.currency && errors.currency}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item md={5} sm={10} gap="10px" mb={5}>
          <FormControl
            fullWidth
            error={touched.language && Boolean(errors.language)}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              <Translations text="Default Language" />{" "}
            </InputLabel>
            <Select
              label={t("Default Language")}
              defaultValue=""
              name="language"
              value={values.language}
              onChange={handleChange}
              error={touched.language && Boolean(errors.language)}
            >
              <MenuItem value={"en"}> {t("English")}</MenuItem>
              <MenuItem value={"fi"}>{t("Finnish")}</MenuItem>
            </Select>
            <FormHelperText>
              {touched.language && errors.language}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item md={5} sm={10} gap="10px" mb={5}>
          <FormControl fullWidth error={touched.login && Boolean(errors.login)}>
            <InputLabel id="demo-simple-select-outlined-label">
              {t("Login")}
            </InputLabel>
            <Select
              label={t("Login")}
              name="login"
              value={values.login}
              onChange={handleChange}
              error={touched.language && Boolean(errors.language)}
            >
              <MenuItem value={"BASIC"}>
                {" "}
                <Translations text="Allow email login" />{" "}
              </MenuItem>
              <MenuItem value={"SOCIAL_APP"}>
                <Translations text="Allow social login" />{" "}
              </MenuItem>
              <MenuItem value={"BOTH"}>
                {" "}
                <Translations text="Allow social and email login" />{" "}
              </MenuItem>
            </Select>
            <FormHelperText>{touched.login && errors.login}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item md={5} xs={10} mb={5}>
          <CustomizedSelect
            label={t("Lead Title Field")}
            value={values.leadTitle}
            options={options}
            error={touched.leadTitle && Boolean(errors.leadTitle)}
            helperText={touched.leadTitle && (errors.leadTitle as string)}
            setValue={(value: string) => setFieldValue("leadTitle", value)}
          />
        </Grid>
        <Grid item md={5} xs={10} mb={5}>
          <CustomizedSelect
            label={t("Lead Subtitle Field")}
            value={values.leadSubtitle}
            options={options}
            error={touched.leadSubtitle && Boolean(errors.leadSubtitle)}
            helperText={touched.leadSubtitle && (errors.leadSubtitle as string)}
            setValue={(value: string) => setFieldValue("leadSubtitle", value)}
          />
        </Grid>

        <Grid item md={5} sm={10} xs={10} mb={5}>
          <CustomizedSelect
            label={t("Details Title")}
            value={values.detailsTitle}
            options={options}
            error={touched.detailsTitle && Boolean(errors.detailsTitle)}
            helperText={touched.detailsTitle && (errors.detailsTitle as string)}
            setValue={(value: string) => setFieldValue("detailsTitle", value)}
          />
        </Grid>
        <Grid item md={5} sm={10} gap="10px">
          <CustomizedSelect
            label={t("Details Subtitle")}
            value={values.detailsSubtitle}
            options={options}
            error={touched.detailsSubtitle && Boolean(errors.detailsSubtitle)}
            helperText={
              touched.detailsSubtitle && (errors.detailsSubtitle as string)
            }
            setValue={(value: string) =>
              setFieldValue("detailsSubtitle", value)
            }
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ClientSettingFields;
