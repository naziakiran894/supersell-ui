import { useEffect } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { IHolidayDetails } from "../../../../../../@core/components/dayOffModal/CustomDayOff";
import { FormikProps } from "formik";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store";
import {
  DialogContent,
  Grid,
  TextField,
  Switch,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { Translation, useTranslation } from "react-i18next";
import Translations from "../../../../../../@core/layouts/Translations";
import { defaultTimeFormat } from "../../../../../../store/types/globalTypes";

export interface IFormData {
  holidayName: string;
  date: null | string;
  doNotDisturb: boolean;
}

interface IFormProps {
  props: FormikProps<IFormData>;
  holidayDetails: IHolidayDetails;
  setShow: any;
}

const AddDaysOffForm = ({ props, holidayDetails, setShow }: IFormProps) => {
  const { errors, touched, values, handleChange, setFieldValue } = props;

  const user = useSelector((state: RootState) => state?.auth.user);
  const timezoneList = useSelector(
    (state: RootState) => state.timeZones.timezone
  );
  const { t } = useTranslation();
  const clientTimeSetting = useSelector(
    (state: RootState) => state.clientSetting.ClientSetting
  );
  useEffect(() => {
    if (holidayDetails?._id) {
      setFieldValue("holidayName", holidayDetails.holidayName);
      //@ts-ignore
      setFieldValue("date", dayjs(holidayDetails?.date));
      setFieldValue("doNotDisturb", holidayDetails.doNotDisturb);
    }
  }, [holidayDetails]);

  return (
    <>
      <Grid container spacing={4} sx={{ mt: 12 }}>
        <Grid item sm={6} xs={12}>
          <FormControl required fullWidth>
            <TextField
              fullWidth
              label={t("Day Name")}
              autoFocus
              id="holidayName"
              name="holidayName"
              autoComplete="holidayName"
              onChange={handleChange}
              value={values.holidayName}
              error={touched.holidayName && Boolean(errors.holidayName)}
              helperText={touched.holidayName && errors.holidayName}
            />
          </FormControl>
        </Grid>

        <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <DesktopDatePicker
                slotProps={{
                  textField: {
                    error: touched.date && Boolean(errors.date),
                    helperText: touched.date && errors.date,
                  },
                }}
                format={
                  clientTimeSetting?.defaultDateTimeFormat === defaultTimeFormat["12h"] ? "MM/DD/YYYY" : "DD.MM.YYYY"
                }
              
                value={values.date ? dayjs(values.date) : null}
                onChange={(e: any) => {
                  setFieldValue("date", e);
                }}
              />
            </FormControl>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormControlLabel
            label={t("Do Not Disturb")}
            control={
              <Switch
                name="doNotDisturb"
                checked={values.doNotDisturb}
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
    </>
  );
};
export default AddDaysOffForm;
