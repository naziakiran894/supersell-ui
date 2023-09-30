import React, { useEffect } from "react";
import {
  Grid,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import { FormikProps } from "formik";
import { ICompanyType } from "../../../store/types/company.types";
import { ICompanyData } from "./AddCompanyDialog";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ITimezone } from "../../../store/types/timezone.types";
import Translations from "../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";
interface IFormProps {
  props: FormikProps<ICompanyData>;
  companyDetails?: ICompanyType | null;
}

const AddCompanyForm = ({ props, companyDetails }: IFormProps) => {
  const { errors, touched, values, handleChange, setFieldValue } = props;

  const timezoneList = useSelector(
    (state: RootState) => state.timeZones.timezone
  );

  const { t } = useTranslation();

  useEffect(() => {
    if (companyDetails?._id) {
      setFieldValue("firstName", companyDetails?.firstName);
      setFieldValue("lastName", companyDetails?.lastName);
      setFieldValue("phone", companyDetails?.phone);
      setFieldValue("email", companyDetails?.email);
      setFieldValue("companyName", companyDetails?.companyName);
      //@ts-ignore
      setFieldValue("countryId", companyDetails?.defaultCountryId?._id);
    }
  }, [companyDetails]);
  return (
    <Grid container mt={10} justifyContent="center" gap="20px">
      <Grid item sm={5} xs={12}>
        <TextField
          fullWidth
          label={t("First Name")}
          name={"firstName"}
          onChange={handleChange}
          value={values.firstName}
          error={touched.firstName && Boolean(errors.firstName)}
          helperText={touched.firstName && errors.firstName}
        />
      </Grid>
      <Grid item sm={5} xs={12}>
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
      <Grid item sm={5} xs={12}>
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
      <Grid item sm={5} xs={12}>
        <TextField
          fullWidth
          label={t("Email")}
          name={"email"}
          onChange={handleChange}
          value={values.email}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
        />
      </Grid>
      <Grid item sm={5} xs={12}>
        <TextField
          fullWidth
          label={t("Company")}
          name="companyName"
          onChange={handleChange}
          value={values.companyName}
          error={touched.companyName && Boolean(errors.companyName)}
          helperText={touched.companyName && errors.companyName}
        />
      </Grid>
      <Grid item sm={5} xs={12}>
        <FormControl fullWidth>
          <Autocomplete
            value={
              timezoneList?.find(
                (timezone: any) => timezone._id === values.countryId
              ) || null
            }
            onChange={(_event, data) => {
              setFieldValue("countryId", data?._id);
            }}
            options={timezoneList || []}
            getOptionLabel={(option) => option.countryName}
            renderInput={(params) => (
              <TextField
                name="countryId"
                {...params}
                label={t("Country")}
                error={touched.countryId && Boolean(errors.countryId)}
                helperText={touched.countryId && errors.countryId}
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid item sm={5} xs={12}></Grid>
    </Grid>
  );
};

export default AddCompanyForm;
