import React, { useEffect, useState } from "react";
import {
  Card,
  Box,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FormikProps } from "formik";
import { useParams } from "react-router-dom";
import {
  useGetNumberSettingByIdQuery,
  useGetAllNumbersQuery,
  useGetAllTeamsQuery,
  useGetUsersListQuery,
  useGetUserRoutingQuery,
  useAddNumberSettingMutation,
} from "../../store/services/index";

// import { IRoutingSetting } from "../ClientSettings/components/clientSettingsRouting";
import { useSnackbar } from "notistack";
import { INumberSettingsFormData } from ".";
import Translations from "../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";

export interface IValues {
  twilioNumberId: any;
  callRecording: boolean;
  callerId: string;
  callScreening: boolean;
  welcomeMessageStatus: boolean;
  welcomeMessageAudio: string;
  voicemailMessageStatus: boolean;
  voicemailMessageAudio: string;
  voicemailFollowUpTeam: string;
  routingType: string;
  teamId: string;
  userId: string;
  leadOwnerRoutingSetting: string;
  fallbackTeam: string;
}
type IProps = {
  props: FormikProps<any>;
};

const RoutingSetting = ({ props }: IProps) => {
  const { values, touched, errors, setFieldValue, handleChange } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { id: paramId } = useParams();

  const [callerId, setCallerId] = useState("");
  const [followup, setFollowup] = useState("");
  const [callrecord, setCallrecord] = useState(false);
  const [callScreen, setCallScreen] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState(false);
  const [routing, setRouting] = useState("");
  const [voicemail, setVoicemail] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [ownerRouting, setOwnerRouting] = useState("");
  const [fallback, setFallback] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [voicemailSrc, setVoicemailSrc] = useState("");

  const [isVoicemailPlaying, setIsVoicemailPlaying] = useState(false);
  const [selectedWelcomeSrc, setSelectedWelcomeSrc] = useState("");
  const [selectedVoicemailSrc, setSelectedVoicemailSrc] = useState("");

  const { data: routeOptions, error, isLoading } = useGetUserRoutingQuery("");

  const { data: numberSetting, isLoading: isFetching } =
    useGetNumberSettingByIdQuery(paramId ? paramId : "");
  const { data: list } = useGetAllNumbersQuery("");
  const { data: teamList } = useGetAllTeamsQuery("");
  const [handleNumberSetting, { isError, isSuccess, isLoading: updating }] =
    useAddNumberSettingMutation();
  const { data: userList } = useGetUsersListQuery("");

  //@ts-ignore
  const settings = numberSetting?.data;
  //@ts-ignore
  const teams = teamList?.data;
  //@ts-ignore'
  const routingSetting: IRoutingSetting[] = routeOptions?.data;
  //@ts-ignore'
  const users = userList?.data;

  return (
    <>
      <Box sx={{ width: { xs: "100%", md: "80%" } }}>
        <Typography variant="h6">
          <Translations text="Routing settings for numbers that are not already in the system" />
        </Typography>
        <Typography sx={{ mb: "2.5rem" }} variant="body1">
          <Translations
            text="Team routing settings will be used for leads numbers that already
          existing in the system"
          />
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: "2rem",
            mb: "2.5rem",
          }}
        >
          <FormControl
            fullWidth
            error={touched.routingType && Boolean(errors.routingType)}
            sx={{ width: { xs: "100%", md: "50%" } }}
          >
            <InputLabel id="routing">Routing Type</InputLabel>
            <Select
              labelId="routing"
              id="routing"
              name="routingType"
              label={t("Routing Type")}
              value={values.routingType}
              onChange={handleChange}
              error={touched.routingType && Boolean(errors.routingType)}
            >
              <MenuItem value={"team"}>Team</MenuItem>
              <MenuItem value={"user"}>User</MenuItem>
            </Select>
            {touched.routingType && (
              <FormHelperText>{errors.routingType as string}</FormHelperText>
            )}
          </FormControl>
          {routing === "team" && (
            <FormControl sx={{ width: { xs: "100%", md: "50%" } }}>
              <InputLabel id="selectedTeam">Select team/user</InputLabel>
              <Select
                labelId="selectedTeam"
                id="selectedTeam"
                value={selectedTeam}
                label={t("Select team/user")}
                onChange={(event: SelectChangeEvent) => {
                  setSelectedTeam(event.target.value as string);
                }}
              >
                {teams?.map((e: any, index: number) => {
                  return (
                    <MenuItem key={index} value={e._id}>
                      {e.teamName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}{" "}
          {routing === "user" && (
            <FormControl sx={{ width: { xs: "100%", md: "50%" } }}>
              <InputLabel id="selectedUser">Select team/user</InputLabel>
              <Select
                labelId="selectedUser"
                id="selectedUser"
                value={selectedUser}
                label={t("Select team/user")}
                onChange={(event: SelectChangeEvent) => {
                  setSelectedUser(event.target.value as string);
                }}
              >
                {users?.map((e: any, index: number) => {
                  return (
                    <MenuItem key={index} value={e._id}>
                      {e.firstName} {e.lastName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
        </Box>
        <FormControl
          error={touched.userRouting && Boolean(errors.userRouting)}
          sx={{ width: { xs: "100%", md: "70%" }, mb: "2.5rem" }}
        >
          <InputLabel id="ownerRouting">
            Lead Owner Routing: If the lead has a lead owner
          </InputLabel>
          <Select
            labelId=" Lead Owner Routing: If the lead has a lead owner"
            label={t("Lead Owner Routing: If the lead has a lead owner")}
            id="ownerRouting"
            name="userRouting"
            value={values.userRouting}
            onChange={handleChange}
            error={touched.userRouting && Boolean(errors.userRouting)}
          >
            {routingSetting?.map((e: any, index: number) => {
              return (
                <MenuItem key={index} value={e.keyName}>
                  {e.description}
                </MenuItem>
              );
            })}
          </Select>
          {touched.userRouting && (
            <FormHelperText>{errors.userRouting as string}</FormHelperText>
          )}
        </FormControl>
        <FormControl
          error={touched.fallbackTeam && Boolean(errors.fallbackTeam)}
          sx={{ width: { xs: "100%", md: "50%" } }}
        >
          <InputLabel id="fallbackTeam">Fallback Team</InputLabel>
          <Select
            labelId="fallbackTeam"
            id="fallbackTeam"
            name="fallbackTeam"
            label={t("Fallback Team")}
            value={values.fallbackTeam}
            onChange={handleChange}
            error={touched.fallbackTeam && Boolean(errors.fallbackTeam)}
          >
            {teams?.map((e: any, index: number) => {
              return (
                <MenuItem key={index} value={e._id}>
                  {e.teamName}
                </MenuItem>
              );
            })}
          </Select>
          {touched.fallbackTeam && (
            <FormHelperText>{errors.fallbackTeam as string}</FormHelperText>
          )}
        </FormControl>
      </Box>
    </>
  );
};

export default RoutingSetting;
