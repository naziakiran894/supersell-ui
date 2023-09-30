import { FormikProps } from "formik";
import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Box,
  Switch,
  FormHelperText,
} from "@mui/material";
import CustomizedSelect from "../../../@core/components/CustomVariableSelect";

import {
  useGetAllNumbersQuery,
  useGetAllTeamsQuery,
} from "../../../store/services";

import { Field } from "../../../store/types/fields.types";
import { ITeamSettingsFormData } from "..";
import { IRetry } from "../../../store/types/teamSettings.types";
import Translations from "../../../@core/layouts/Translations";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

type IProps = {
  props: FormikProps<ITeamSettingsFormData>;
  dropdownFields: Field[];
  numberOfRet: number;
  setNumberOfRet: React.Dispatch<React.SetStateAction<number>>;
  setRetryDetails: React.Dispatch<React.SetStateAction<IRetry[]>>;
  retryDetails: IRetry[];
};
export interface IValues {
  teamId: string;
  twilioNumberId: any;
}

const TeamSettingsHeader = ({
  props,
  dropdownFields,
  setNumberOfRet,
  setRetryDetails,
  retryDetails,
  numberOfRet,
}: IProps) => {
  const { values, touched, errors, setFieldValue, handleChange } = props;

  const { data: list } = useGetAllNumbersQuery("");
  const { data } = useGetAllTeamsQuery("");
  const { t } = useTranslation();

  //@ts-ignore
  const numberList: any = list?.data;
  //@ts-ignore
  const teams: any = data?.data;

  const options = dropdownFields?.map((e: any, i) => `{{${e?.keyName}}}`);

  const handleChangeMinHour = (value: string, index: number) => {
    const newArray = JSON.parse(JSON.stringify(retryDetails));
    newArray[index].attemptType = value;
    setRetryDetails(newArray);
  };

  const handleChangeDuration = (value: number, index: number) => {
    const newArray = JSON.parse(JSON.stringify(retryDetails));
    newArray[index].attemptValue = value;
    setRetryDetails(newArray);
  };

  return (
    <>
      <Grid container display="flex" flexDirection="column">
        <Grid item sm={12} md={3.5} my={5}>
          <TextField
            fullWidth
            id="outlined-basic"
            label={t("Team name")}
            name="teamName"
            variant="outlined"
            value={values.teamName}
            onChange={handleChange}
            error={touched.teamName && Boolean(errors.teamName)}
            helperText={touched.teamName && errors.teamName}
          />
        </Grid>
        <Grid
          item
          sm={12}
          md={3.5}
          display="flex"
          flexDirection="column"
          gap={4}
        >
          <Typography variant="h6" fontWeight="600">
            <Translations text={"Caller ID’s"} />
          </Typography>

          <FormControl
            fullWidth
            error={touched.callerUserId && Boolean(errors.callerUserId)}
          >
            <InputLabel id="callerUserId">
              <Translations
                text={"Caller ID that the User will see on the call"}
              />
            </InputLabel>
            <Select
              labelId="callerUserId"
              name="callerUserId"
              value={values.callerUserId}
              label={t("Caller ID that the User will see on the call")}
              onChange={handleChange}
              error={touched.callerUserId && Boolean(errors.callerUserId)}
            >
              {numberList?.map((e: any, index: number) => {
                return (
                  <MenuItem key={index} value={e._id}>
                    {e.numberName} : {e.number}
                  </MenuItem>
                );
              })}
            </Select>

            {touched.callerUserId && (
              <FormHelperText>{errors.callerUserId}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            error={touched.callerLeadId && Boolean(errors.callerLeadId)}
          >
            <InputLabel id="callerLeadId">
              <Translations
                text={"Caller ID that the Lead will see on the call"}
              />
            </InputLabel>
            <Select
              labelId="callerLeadId"
              name="callerLeadId"
              value={values.callerLeadId}
              label={t("Caller ID that the Lead will see on the call")}
              onChange={handleChange}
              error={touched.callerLeadId && Boolean(errors.callerLeadId)}
            >
              {numberList?.map((e: any, index: number) => {
                return (
                  <MenuItem key={index} value={e._id}>
                    {e.numberName} : {e.number}
                  </MenuItem>
                );
              })}
            </Select>
            {touched.callerLeadId && (
              <FormHelperText>{errors.callerLeadId}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          my={5}
          display="flex"
          flexDirection="column"
          gap={5}
        >
          <Typography variant="h6" fontWeight="600">
            <Translations text={"Whispertext"} />
          </Typography>
          <CustomizedSelect
            label={t("SMS")}
            value={values.whispertext}
            options={options}
            setValue={(value: string) => setFieldValue("whispertext", value)}
            rows={4}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={3.5}
          my={5}
          display="flex"
          flexDirection="column"
          gap={5}
        >
          <FormControl
            fullWidth
            error={
              touched.whispertextLanguages &&
              Boolean(errors.whispertextLanguages)
            }
          >
            <InputLabel id="user-view-language-label">
              <Translations text={"Whispertext Language"} />
            </InputLabel>
            <Select
              fullWidth
              label="Whispertext Languages"
              name="whispertextLanguages"
              value={values.whispertextLanguages}
              onChange={handleChange}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="fi">Finnish</MenuItem>
            </Select>
            {touched.whispertextLanguages && (
              <FormHelperText>{errors.whispertextLanguages}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid
          item
          sm={12}
          md={6}
          my={5}
          display="flex"
          flexDirection="column"
          gap={5}
        >
          <Typography variant="h6" fontWeight="600">
            <Translations text={"User retries"} />
          </Typography>
          <Box sx={{ display: "flex", gap: "20px" }}>
            <FormControlLabel
              value="start"
              control={
                <Switch
                  color="primary"
                  inputProps={{ "aria-label": "Switch" }}
                  name="userRetries"
                  checked={values.userRetries}
                  onChange={handleChange}
                  sx={{ mx: 5 }}
                />
              }
              label={t("User retries")}
              labelPlacement="start"
            />
            <FormControl sx={{ width: "130px" }}>
              <InputLabel id="demo-simple-select-outlined-label">
                <Translations text={"Number of Retries"} />
              </InputLabel>
              <Select
                label={t("Number of Retries")}
                id="demo-simple-select-outlined"
                labelId="demo-simple-select-outlined-label"
                value={numberOfRet}
                onChange={(e) => setNumberOfRet(e.target.value as number)}
              >
                {Array(10)
                  .fill("")
                  .map((e, index) => {
                    return (
                      <MenuItem key={index} value={index + 1}>
                        {index + 1}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Box>
        </Grid>

        {retryDetails?.map((e, index) => {
          return (
            <Grid key={index} item sm={12} lg={5} my={5}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <Typography>
                  <Translations text={"Retry #"} />
                  {index + 1}
                </Typography>
                <TextField
                  variant="outlined"
                  sx={{ width: "70px" }}
                  value={e.attemptValue}
                  onChange={(e) =>
                    handleChangeDuration(
                      e.target.value as unknown as number,
                      index
                    )
                  }
                />
                <FormControl sx={{ width: "105px" }}>
                  <InputLabel id="demo-simple-select-outlined-label">
                    {e.attemptType}
                  </InputLabel>
                  <Select
                    label={e.attemptType}
                    value={e.attemptType}
                    onChange={(e) =>
                      handleChangeMinHour(e.target.value as string, index)
                    }
                    id="demo-simple-select-outlined"
                    labelId="demo-simple-select-outlined-label"
                  >
                    <MenuItem value="min">min</MenuItem>
                    <MenuItem value="hours">hours</MenuItem>
                  </Select>
                </FormControl>
                <Typography>
                  <Translations text={"After Last Attempt"} />
                </Typography>
              </Box>
            </Grid>
          );
        })}
        <Grid
          item
          sm={12}
          md={5}
          my={5}
          display="flex"
          flexDirection="column"
          gap={5}
        >
          <Typography variant="h6" fontWeight="700">
            <Translations text={"Followup settings if lead doesn’t answer"} />
          </Typography>
          <FormControl sx={{ width: "300px" }}>
            <InputLabel id="demo-simple-select-outlined-label">
              <Translations text={"Copy settings from Team"} />
            </InputLabel>
            <Select
              label={t("Copy settings from Team")}
              defaultValue=""
              id="demo-simple-select-outlined"
              labelId="demo-simple-select-outlined-label"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {teams?.map((team: any, index: number) => {
                return (
                  <MenuItem key={index} value={team?._id}>
                    {team?.teamName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
};

export default TeamSettingsHeader;
