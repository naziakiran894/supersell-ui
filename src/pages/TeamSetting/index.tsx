import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import {
  Grid,
  Typography,
  Card,
  Button,
  Box,
  CircularProgress,
  MenuItem,
} from "@mui/material";

import { RootState } from "../../store";
import {
  useAddTeamSettingsMutation,
  useGetTeamSettingsByIdQuery,
} from "../../store/services";
import { nanoid } from "nanoid";
import FollowUpsettings from "./components/FollowUpSettings";
import LeadRoutingSettings from "./components/LeadRoutingSettings";
import TeamDetailsSettings from "./components/TeamDetailsSettings";
import SendSmsSettings from "./components/SendSmsSettings";
import SpecialFollowUpSettings from "./components/SpecialFollowUpSettings ";
import PageLoader from "../../@core/components/loader/PageLoader";

import {
  IFollowUpData,
  IFollowUpSetting,
  IRetry,
  ITeamSettings,
} from "../../store/types/teamSettings.types";
import Translations from "../../@core/layouts/Translations";

const CALL_LEAD_OWNER_FIRST = "lead_routing_setting_1";
const ROUND_ROBIN = "round_robin"
export interface ITeamSettingsFormData {
  teamName: string;
  callerUserId: string;
  callerLeadId: string;
  whispertext: string;
  whispertextLanguages: string;
  InboundCall: string;
  outboundLeadOwner: string;
  outboundCall: string;
  inboundExistingNo: string;
  fallBack: string;
  offlineTeamSendSmsToLead: boolean;
  userRetries: boolean;
  rescheduleCallIfTeamIsOffline: boolean;
  offlineTeamSmsMessage: string;
  outboundIntegrationUrl: string;
}
interface IFollowUpSpecialData {
  data: any;
}

const teamSettingSchema = Yup.object({
  teamName: Yup.string().required("Team name is required"),
  callerUserId: Yup.string().required("Caller userId  is required"),
  callerLeadId: Yup.string().required("Caller leadId is required"),
  whispertext: Yup.string().required("Whispertext is required"),
  whispertextLanguages: Yup.string().required(
    "Whispertext languages is required"
  ),
  setting: Yup.string(),
  outboundLeadOwner: Yup.string().required("Outbound lead owner is required"),
  outboundCall: Yup.string().required("Outbound call routing is required"),
  InboundCall: Yup.string().required("Inbound call routing is required"),
  inboundExistingNo: Yup.string().required(
    "Inbound call routing existing number  is required"
  ),
  // fallBack: Yup.string().required("Fallback team is required"),
  outboundIntegrationUrl: Yup.string(),
});

const initialValuesRetry = {
  attemptValue: 1,
  attemptType: "min",
};

const initalDayValues: IFollowUpData = {
  type: "call",
  value: 0,
  minOrHour: "min",
  callType: "regular",
  sms: false,
  smsText: "",
  phone: true,
  time: null,
  id: nanoid(),
};

const initalSpecialDayValues: IFollowUpData = {
  type: "call",
  value: 0,
  minOrHour: "min",
  callType: "regular",
  sms: false,
  smsText: "",
  phone: true,
  time: null,
  id: nanoid(),
};

// const initalSpecialDayValues: IFollowUpData = {
//   data: "null",
//   // type: "call",
//   // value: 0,
//   // minOrHour: "min",
//   // callType: "regular",
//   // sms: false,
//   // smsText: "",
//   // phone: true,
//   // time: null,
//   // id: nanoid()
// };

export const initalDayCalls: IFollowUpSetting = {
  day: "1",
  data: [initalDayValues],
};

export const initalSpecialDayCalls: IFollowUpSetting = {
  day: "Monday",
  data: [initalSpecialDayValues],
};

const SuperAdminSetting = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { teamId } = useParams();

  const settings = useSelector((state: RootState) => state?.fields?.fields);

  const [dropDownFields, setDropDownFields] = useState([]);
  const [numberOfRet, setNumberOfRet] = useState(1);
  const [retryDetails, setRetryDetails] = useState<IRetry[]>([
    initialValuesRetry,
  ]);
  const [leadCallDay, setLeadCallDays] = useState([initalDayCalls]);
  const [specialLeadCallDay, setSpecialLeadCallDays] = useState<
    IFollowUpSetting[]
  >([]);

  const {
    data,
    isLoading: isFetching,
    refetch,
  } = useGetTeamSettingsByIdQuery(teamId);
  const [
    handleUpdateSettings,
    { error: addedError, isSuccess: addedSuccess, isLoading: isUpdating },
  ] = useAddTeamSettingsMutation();

  //@ts-ignore
  const teamSettings: ITeamSettings = data?.data;

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (teamSettings) {
      setNumberOfRet(teamSettings?.userRetries?.noOfRetries || 1);
      setRetryDetails(teamSettings?.userRetries?.retries);
      setLeadCallDays(teamSettings?.followUpSettings || []);
      setSpecialLeadCallDays(teamSettings?.followUpRules || []);
    }
  }, [teamSettings]);

  useEffect(() => {
    const array: any = [];
    if (settings) {
      Object.entries(settings)?.map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          //@ts-ignore
          array.push(...value);
        }
      });
      setDropDownFields(array?.filter((field: any) => field.visible));
    }
  }, [settings]);

  useEffect(() => {
    if (numberOfRet > 0) {
      setRetryDetails(Array(numberOfRet).fill(initialValuesRetry));
    }
  }, [numberOfRet]);

  useEffect(() => {
    if (addedSuccess) {
      enqueueSnackbar("Added Successfully", { variant: "success" });
    } else if (addedError) {
      enqueueSnackbar("Added failed! Please try again!", { variant: "error" });
    }
  }, [addedError, addedSuccess]);

  if (isFetching) {
    return <PageLoader />;
  }

  const handleSave = (values: ITeamSettingsFormData) => {
    const payload = {
      teamId,
      teamName: values.teamName,
      callerIdForUser: values.callerUserId,
      callerIdForLead: values.callerLeadId,
      whisperText: values.whispertext,
      whisperLanguage: values.whispertextLanguages,
      userRetries: {
        active: values?.userRetries,
        noOfRetries: numberOfRet,
        retries: retryDetails,
      },
      followUpRules: specialLeadCallDay,
      sendSMSToLeadIfTeamOffline: {
        active: values.offlineTeamSendSmsToLead,
        sms: values.offlineTeamSmsMessage,
      },
      followUpSettings: leadCallDay,
      rescheduleCallIfTeamIsOffline: values.rescheduleCallIfTeamIsOffline,
      leadRoutingSettings: {
        outboundLeadOwnerRouting: values.outboundLeadOwner,
        outboundCallRoutingType: values.outboundCall,
        inboundCallRoutingExistingNumber: values.inboundExistingNo,
        inboundCallRoutingTypeExistingNumber: values.InboundCall,
      },
      fallbackTeam: values.fallBack,
      outboundIntegrationUrl: values.outboundIntegrationUrl,
    };
    handleUpdateSettings(payload);
  };

  return (
    <>
      <Grid container display="flex" flexDirection="column">
        <Grid item mb={10}>
          <Typography variant="h4">
            <Translations text={"Team Settings"} />
          </Typography>
          <Typography variant="h6">{teamSettings?.team?.teamName}</Typography>
        </Grid>

        <Card sx={{ p: 5 }}>
          <Formik
            initialValues={{
              teamName: teamSettings?.team?.teamName || "",
              callerUserId: teamSettings?.callerIdForUser || "",
              callerLeadId: teamSettings?.callerIdForLead || "",
              whispertext: teamSettings?.whisperText || "",
              whispertextLanguages: teamSettings?.whisperLanguage || "",
              InboundCall:
                teamSettings?.leadRoutingSettings
                  ?.inboundCallRoutingTypeExistingNumber || ROUND_ROBIN,
              outboundLeadOwner:
                teamSettings?.leadRoutingSettings?.outboundLeadOwnerRouting ||
                CALL_LEAD_OWNER_FIRST,
              outboundCall:
                teamSettings?.leadRoutingSettings?.outboundCallRoutingType ||
                ROUND_ROBIN,
              inboundExistingNo:
                teamSettings?.leadRoutingSettings
                  ?.inboundCallRoutingExistingNumber || CALL_LEAD_OWNER_FIRST,
              fallBack: teamSettings?.fallbackTeam || "",
              userRetries: teamSettings?.userRetries?.active || false,
              rescheduleCallIfTeamIsOffline:
                teamSettings?.rescheduleCallIfTeamIsOffline || false,
              outboundIntegrationUrl:
                teamSettings?.outboundIntegrationUrl || "",
              offlineTeamSendSmsToLead:
                teamSettings?.sendSMSToLeadIfTeamOffline?.active || false,
              offlineTeamSmsMessage:
                teamSettings?.sendSMSToLeadIfTeamOffline?.sms || "",
            }}
            enableReinitialize
            validationSchema={teamSettingSchema}
            onSubmit={(values) => {
              handleSave(values);
            }}
          >
            {(props) => {
              const { handleSubmit } = props;
              return (
                <>
                  <form onSubmit={handleSubmit}>
                    <TeamDetailsSettings
                      dropdownFields={dropDownFields}
                      setNumberOfRet={setNumberOfRet}
                      numberOfRet={numberOfRet}
                      setRetryDetails={setRetryDetails}
                      retryDetails={retryDetails}
                      props={props}
                    />

                    <FollowUpsettings
                      setLeadCallDays={setLeadCallDays}
                      leadCallDay={leadCallDay}
                    />
                    <SpecialFollowUpSettings
                      setLeadCallDays={setSpecialLeadCallDays}
                      leadCallDay={specialLeadCallDay}
                    />
                    <SendSmsSettings props={props} />
                    <LeadRoutingSettings props={props} />

                    <Box display="flex" gap="20px" m={5}>
                      <Button
                        disabled={isUpdating}
                        type="submit"
                        variant="contained"
                        sx={{ minWidth: "145px" }}
                      >
                        {isUpdating ? (
                          <CircularProgress size={20} sx={{ color: "white" }} />
                        ) : (
                          <Translations text={"Save Changes"} />
                        )}
                      </Button>
                      <Button variant="outlined">
                        <Translations text={"Cancel"} />
                      </Button>
                    </Box>
                  </form>
                </>
              );
            }}
          </Formik>
        </Card>
      </Grid>
    </>
  );
};

export default SuperAdminSetting;
