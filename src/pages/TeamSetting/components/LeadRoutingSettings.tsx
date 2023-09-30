import { FormikProps } from "formik";
import { Grid, Typography, Box, Switch, TextField } from "@mui/material";

import { ITeamSettingsFormData } from "..";
import Translations from "../../../@core/layouts/Translations";
import { t } from "i18next";

type IProps = {
  props: FormikProps<ITeamSettingsFormData>;
};

const LeadRoutingSettings = ({ props }: IProps) => {
  const { values, touched, errors, setFieldValue, handleChange } = props;

  return (
    <Grid container>
      <Grid
        item
        md={10}
        my={5}
        display="flex"
        flexDirection="column"
        gap="20px"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            <Translations
              text={
                "Reschedule the call for the first available time slot If team is Offline"
              }
            />
          </Typography>

          <Switch
            inputProps={{ "aria-label": "Switch" }}
            checked={values.rescheduleCallIfTeamIsOffline}
            name="rescheduleCallIfTeamIsOffline"
            onChange={handleChange}
          />
        </Box>
        <Box>
          <Typography variant="h6">
            <Translations text={"Outbound Integration"} />
          </Typography>
          <Typography>
            <Translations
              text={
                "Webhook URL where the status of the call is sent after it is completed"
              }
            />
          </Typography>
        </Box>
        <TextField
          sx={{ width: "100%", marginBottom: "3rem" }}
          id="outlined-multiline-static"
          label={t("URL")}
          multiline
          rows={1}
          name="outboundIntegrationUrl"
          variant="outlined"
          value={values.outboundIntegrationUrl}
          onChange={handleChange}
          error={
            touched.outboundIntegrationUrl &&
            Boolean(errors.outboundIntegrationUrl)
          }
          helperText={
            touched.outboundIntegrationUrl && errors.outboundIntegrationUrl
          }
        />
      </Grid>
    </Grid>
  );
};

export default LeadRoutingSettings;
