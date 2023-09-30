import { useEffect } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IHolidayDetails } from "../../../@core/components/dayOffModal/CustomDayOff";
import { FormikProps } from "formik";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { userTypes } from "../../../store/types/globalTypes";
import {
  DialogContent,
  IconButton,
  Box,
  Typography,
  Grid,
  Select,
  TextField,
  MenuItem,
  Switch,
  FormControl,
  FormControlLabel,
  InputLabel,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import Icon from "../../../@core/components/icon/index";
import { ITimezone } from "../../../store/types/timezone.types";
import Translations from "../../../@core/layouts/Translations";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

export interface IFormData {
  title: string;
  datePick: null | string;
  country: string;
  dnd: boolean;
}

interface IFormProps {
  props: FormikProps<IFormData>;
  holidayDetails: IHolidayDetails | null;
  setShow: any;
}

const AddHolidayForm = ({ props, holidayDetails, setShow }: IFormProps) => {
  const { errors, touched, values, handleChange, setFieldValue } = props;
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state?.auth.user);
  const timezoneList = useSelector(
    (state: RootState) => state.timeZones.timezone
  );

  const clientTimeSetting = useSelector(
    (state: RootState) => state.clientSetting.ClientSetting
  );

  useEffect(() => {
    if (holidayDetails?._id) {
      setFieldValue("title", holidayDetails.holidayName);
      setFieldValue("country", holidayDetails?.countryId?._id);
      setFieldValue("datePick", dayjs(holidayDetails.holidayDate));
      setFieldValue("dnd", holidayDetails.doNotDisturb);
    }
  }, [holidayDetails]);

  return (
    <>
      <DialogContent
        sx={{
          position: "relative",
          pb: (theme) => `${theme.spacing(8)} !important`,
          px: (theme) => [
            `${theme.spacing(5)} !important`,
            `${theme.spacing(15)} !important`,
          ],
          pt: (theme) => [
            `${theme.spacing(8)} !important`,
            `${theme.spacing(12.5)} !important`,
          ],
        }}
      >
        <IconButton
          size="small"
          onClick={() => setShow(false)}
          sx={{ position: "absolute", right: "1rem", top: "1rem" }}
        >
          <Icon icon="mdi:close" />
        </IconButton>
        <Box sx={{ mb: 8, textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            <Translations
              text={
                holidayDetails?._id
                  ? "EDIT CUSTOM DAY OFF"
                  : "ADD CUSTOM DAY OFF"
              }
            />
          </Typography>
        </Box>

        <Grid container alignItems="top" spacing={4} sx={{ mt: 12 }}>
          <Grid item sm={6} xs={12}>
            <FormControl required fullWidth>
              <TextField
                fullWidth
                label={t("Title")}
                autoFocus
                id="title"
                name="title"
                autoComplete="title"
                onChange={handleChange}
                value={values.title}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
              />
            </FormControl>
          </Grid>
          {user?.roleName === userTypes.SUPER_ADMIN && (
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  value={
                    timezoneList?.find(
                      (timezone) => timezone.timezone === values.country
                    ) || null
                  }
                  onChange={(_event, data) =>
                    setFieldValue("country", data?.timezone)
                  }
                  options={timezoneList || []}
                  getOptionLabel={(option) => option.countryName}
                  renderInput={(params) => (
                    <TextField
                      name="country"
                      {...params}
                      label={t("Country")}
                      error={touched.country && Boolean(errors.country)}
                      helperText={touched.country && errors.country}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          )}

          <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <DatePicker
                  slotProps={{
                    textField: {
                      error: touched.datePick && Boolean(errors.datePick),
                      helperText: touched.datePick && errors.datePick,
                    },
                  }}
                  value={values.datePick ? dayjs(values.datePick) : null}
                  onChange={(e: any) => {
                    setFieldValue("datePick", e);
                  }}
                  format={
                    clientTimeSetting?.defaultDateTimeFormat ||
                    "DD.MM.YYYY hh.mm"
                  }
                />
              </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <FormControlLabel
              label={t("Do Not Disturb")}
              id="dnd"
              control={
                <Switch
                  name="dnd"
                  checked={values.dnd}
                  onChange={handleChange}
                  sx={{ ml: 5, mt: 5 }}
                />
              }
              sx={{
                "& .MuiTypography-root": {
                  fontWeight: 300,
                  ml: 5,
                  mt: 5,
                },
                flexDirection: "row-reverse",
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );
};

export default AddHolidayForm;
