import {
  Card,
  Box,
  Typography,
  TextField,
  Switch,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  useGetNumberSettingByIdQuery,
  useGetAllNumbersQuery,
} from "../../store/services/index";
import { FormikProps } from "formik";
import { INumberSettingsFormData } from ".";

export interface IValues {
  twilioNumberId: any;
  callRecording: boolean;
  callerId: string;
  callScreening: boolean;
}
type IProps = {
  props: FormikProps<any>;
};

const CallRecording = ({ props }: IProps) => {
  const { values, touched, errors, handleChange } = props;

  const { paramId } = useParams();
  const { data: list } = useGetAllNumbersQuery("");

  //@ts-ignore
  const numberList: any = list?.data;

  const { data: numberSetting, isLoading: isFetching } =
    useGetNumberSettingByIdQuery(paramId);

  //@ts-ignore
  const settings = numberSetting?.data;

  return (
    <>
      <Box sx={{ mb: "2.5rem", width: { xs: "100%", md: "40%" } }}>
        <Typography sx={{ mb: "2rem" }} variant="h6">
          Name of the number
        </Typography>
        <TextField
          sx={{ mb: "2.5rem" }}
          fullWidth
          name="twilioNumber"
          disabled
          value={values.twilioNumber}
          onChange={handleChange}
          error={touched.twilioNumber && Boolean(errors.twilioNumber)}
          helperText={touched.twilioNumber && errors.twilioNumber as string}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ mb: "2.5rem" }} variant="h6">
            Call Recording
          </Typography>
          <Switch
            name="callRecording"
            checked={values.callRecording}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        </Box>

        <FormControl
          fullWidth
          error={touched.callerId && Boolean(errors.callerId)}
        >
          <InputLabel id="callerId">
            Caller ID that the User will see on the call
          </InputLabel>
          <Select
            labelId="callerId"
            name="callerId"
            id="callerId"
            label="Caller ID that the User will see on the call"
            value={values.callerId}
            onChange={handleChange}
            error={touched.callerId && Boolean(errors.callerId)}
          >
            {numberList?.map((e: any, index: number) => {
              return (
                <MenuItem key={index} value={e._id}>
                  {e.numberName} : {e.number}
                </MenuItem>
              );
            })}
          </Select>
          {touched.callerId && (
            <FormHelperText>{errors.callerId as string}</FormHelperText>
          )}
        </FormControl>
      </Box>
    </>
  );
};

export default CallRecording;
