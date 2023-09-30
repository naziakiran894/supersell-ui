import { useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Switch,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { FormikProps } from "formik";

import { ITeamSettingsFormData } from "..";
import {
  useGetAllTeamsQuery,
  useGetLeadRoutingServiceQuery,
} from "../../../store/services";
import Translations from "../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";

type IProps = {
  props: FormikProps<ITeamSettingsFormData>;
};
export interface IValues {
  props: any;
  teamId: string;
  twilioNumberId: any;
  offlineTeamSendSmsToLead: boolean;
}

const SendSmsSettings = ({ props }: IProps) => {
  const { values, touched, errors, handleChange } = props;

  const { data } = useGetAllTeamsQuery("");
  const { t } = useTranslation();

  const { data: routeOptions } = useGetLeadRoutingServiceQuery("");

  //@ts-ignore
  const teams = data?.data;

  //@ts-ignore
  const routingSetting: IRoutingSetting[] = routeOptions?.data;

  return (
    <>
      <Grid container>
        <Grid item md={10} display="flex" flexDirection="column">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              <Translations
                text={"Send SMS to lead if team is offline when lead comes in"}
              />
            </Typography>
            <Switch
              inputProps={{ "aria-label": "Switch" }}
              name="offlineTeamSendSmsToLead"
              checked={values.offlineTeamSendSmsToLead}
              onChange={handleChange}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          display="flex"
          flexDirection="column"
          gap="20px"
        >
          <TextField
            value={values.offlineTeamSmsMessage}
            onChange={handleChange}
            name="offlineTeamSmsMessage"
            id="outlined-multiline-static"
            label={t("SMS message when team is offline")}
            multiline
            rows={4}
          />
        </Grid>

        <Grid
          item
          md={10}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box mt={5}>
            <Typography variant="h6">
              <Translations text={"Lead Routing Setting"} />
            </Typography>
            <Typography>
              <Translations
                text={
                  "Settings for inbound calls which are not in the sytem can be changed from the purchased number settings"
                }
              />
            </Typography>
          </Box>
        </Grid>

        <Grid mt={5} container display="flex" spacing={5}>
          <Grid item md={5} sm={12}>
            <FormControl
              fullWidth
              error={
                touched.outboundLeadOwner && Boolean(errors.outboundLeadOwner)
              }
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <Translations text={"Outbound Lead routing"} />
              </InputLabel>
              <Select
                label={t("Outbound Lead routing")}
                name="outboundLeadOwner"
                value={values.outboundLeadOwner || ""}
                onChange={handleChange}
                error={
                  touched.outboundLeadOwner && Boolean(errors.outboundLeadOwner)
                }
              >
                {routingSetting?.map((e: any, index: number) => {
                  return (
                    <MenuItem key={index} value={e?.keyName}>
                      {e.description}
                    </MenuItem>
                  );
                })}
              </Select>
              {touched.outboundLeadOwner && (
                <FormHelperText>{errors.outboundLeadOwner}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item md={5} sm={12} xs={12}>
            <FormControl
              fullWidth
              error={touched.outboundCall && Boolean(errors.outboundCall)}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <Translations text={"Outbound call routing"} />
              </InputLabel>
              <Select
                label={t("Outbound call routing")}
                name="outboundCall"
                value={values.outboundCall || ""}
                onChange={handleChange}
                error={touched.outboundCall && Boolean(errors.outboundCall)}
              >
                <MenuItem value="simultaneous">Simultaneous</MenuItem>
                <MenuItem value="round_robin">Round robin</MenuItem>
              </Select>
              {touched.outboundCall && (
                <FormHelperText>{errors.outboundCall}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item md={5} sm={12} xs={12}>
            <FormControl
              fullWidth
              error={
                touched.inboundExistingNo && Boolean(errors.inboundExistingNo)
              }
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <Translations text={"Inbound Lead routing"} />
              </InputLabel>
              <Select
                label={t("Inbound call routing")}
                value={values.inboundExistingNo || ""}
                name="inboundExistingNo"
                onChange={handleChange}
                error={
                  touched.inboundExistingNo && Boolean(errors.inboundExistingNo)
                }
              >
                {routingSetting?.map((e: any, index: number) => {
                  return (
                    <MenuItem key={index} value={e?.keyName}>
                      {e.description}
                    </MenuItem>
                  );
                })}
              </Select>
              {touched.inboundExistingNo && (
                <FormHelperText>{errors.inboundExistingNo}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item md={5} sm={12} xs={12}>
            <FormControl
              fullWidth
              error={touched.InboundCall && Boolean(errors.InboundCall)}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <Translations text={"Inbound call routing"} />
              </InputLabel>
              <Select
                label={t("Outbound call routing")}
                name="InboundCall"
                value={values.InboundCall || ""}
                onChange={handleChange}
                error={touched.InboundCall && Boolean(errors.InboundCall)}
              >
                <MenuItem value="simultaneous">Simultaneous</MenuItem>
                <MenuItem value="round_robin">Round robin</MenuItem>
              </Select>
              {touched.InboundCall && (
                <FormHelperText>{errors.InboundCall}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item md={5} xs={12}>
            <FormControl
              fullWidth
              // error={touched.fallBack && Boolean(errors.fallBack)}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <Translations
                  text={"Fallback Team after all retries have been used"}
                />
              </InputLabel>
              <Select
                label={t("Fallback Team after all retries have been used")}
                value={values.fallBack || ""}
                name="fallBack"
                onChange={handleChange}
                // error={touched.fallBack && Boolean(errors.fallBack)}
              >
                {teams?.map((team: any, index: string) => {
                  return (
                    <MenuItem key={index} value={team?._id}>
                      {team?.teamName}
                    </MenuItem>
                  );
                })}
              </Select>
              {/* {touched.fallBack && (
                <FormHelperText>{errors.fallBack}</FormHelperText>
              )} */}
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SendSmsSettings;
