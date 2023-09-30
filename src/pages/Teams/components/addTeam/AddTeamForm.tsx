import { FormikProps } from "formik";
import {
  FormHelperText,
  Grid,
  Switch,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import { useEffect } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { IAddTeam } from "./AddTeamDialog";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { ICompanyType } from "../../../../store/types/company.types";

import { ITeam } from "../../../../store/types/team.types";
import { userTypes } from "../../../../store/types/globalTypes";
import { useTranslation } from "react-i18next";
interface IFormProps {
  props: FormikProps<Partial<IAddTeam>>;
  teamDetails?: ITeam | null;
}
const AddTeamForm = ({ props, teamDetails }: IFormProps) => {
  const { errors, touched, values, handleChange, setFieldValue } = props;
  const user = useSelector((state: RootState) => state?.auth?.user);

  const companies = useSelector(
    (state: RootState) => state.companies.companies
  );
  const { t } = useTranslation();
  const timezoneStore = useSelector((state: RootState) => state.timeZones);
  const timezoneList = timezoneStore.timezone;
  useEffect(() => {
    if (teamDetails?._id) {
      setFieldValue("teamName", teamDetails.teamName);
      setFieldValue("timeZone", teamDetails.timezone);

      //@ts-ignore
      setFieldValue("company", teamDetails?.companyId?._id);
      setFieldValue("doNotDisturb", teamDetails?.doNotDisturbStatus);
    }
  }, [teamDetails]);

  return (
    <div>
      <Grid container spacing={6} sx={{ mt: 12 }}>
        <Grid item sm={6} xs={12}>
          <TextField
            name="teamName"
            value={values.teamName}
            onChange={handleChange}
            error={touched.teamName && Boolean(errors.teamName)}
            helperText={touched.teamName && errors.teamName}
            fullWidth
            label={t("Team Name")}
          />
        </Grid>
        {user?.roleName === userTypes.SUPER_ADMIN && (
          <Grid item xs={12} sm={6}>
            <FormControl
              fullWidth
              error={touched.company && Boolean(errors.company)}
            >
              <InputLabel id="companyId">Company</InputLabel>
              <Select
                fullWidth
                label={t("company")}
                name="company"
                value={values.company}
                onChange={handleChange}
              >
                {companies?.map((e: ICompanyType) => {
                  return (
                    <MenuItem key={e._id} value={e._id}>
                      {e.companyName}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>
                {touched.company && errors.company}
              </FormHelperText>
            </FormControl>
          </Grid>
        )}
        <Grid item sm={6} xs={12}>
          <FormControl fullWidth>
            <Autocomplete
              id="timeZone"
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
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", justifyContent: "start" }}
        >
          <FormControlLabel
            label={t("Do not disturb")}
            control={
              <Switch
                onChange={handleChange}
                checked={values.doNotDisturb}
                name="doNotDisturb"
                sx={{ ml: 5 }}
              />
            }
            sx={{
              "& .MuiTypography-root": {
                fontWeight: 300,
                ml: 5,
              },
              flexDirection: "row-reverse",
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default AddTeamForm;
