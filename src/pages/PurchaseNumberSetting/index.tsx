import React, { useEffect, useState } from "react";
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
  SelectChangeEvent,
  Button,
  IconButton,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import Icon from "../../@core/components/icon";
import { useTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import {
  useGetNumberSettingByIdQuery,
  useGetAllNumbersQuery,
  useGetAllTeamsQuery,
  useGetCompanyRoutingListQuery,
  useGetUsersListQuery,
  useGetUserRoutingQuery,
  useAddNumberSettingMutation,
} from "../../store/services/index";
import { useSnackbar } from "notistack";
import PageLoader from "../../@core/components/loader/PageLoader";
import Translations from "../../@core/layouts/Translations";
import { t } from "i18next";
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

const PurchaseNumberSetting = () => {
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
  const { t } = useTranslation();

  //@ts-ignore
  const settings = numberSetting?.data;
  //@ts-ignore
  const numberList: any = list?.data;
  //@ts-ignore
  const teams = teamList?.data;
  //@ts-ignore'
  const routingSetting: IRoutingSetting[] = routeOptions?.data;
  //@ts-ignore'
  const users = userList?.data;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = event.target.files?.[0];
    setSelectedWelcomeSrc(file);
    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        setAudioSrc(fileReader.result as string);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVoicemailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file: any = event.target.files?.[0];
    setSelectedVoicemailSrc(file);
    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        setVoicemailSrc(fileReader.result as string);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const handlePlayPauseVoicemail = () => {
    setIsVoicemailPlaying(!isVoicemailPlaying);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const newFormData = new FormData();

    paramId && newFormData.append("twilioNumberId", paramId);
    if (followup) {
      newFormData.append("voicemailFollowUpTeam", followup);
    }
    if (selectedTeam) {
      newFormData.append("teamId", selectedTeam);
    }
    if (selectedUser) {
      newFormData.append("userId", selectedUser);
    }
    if (ownerRouting) {
      newFormData.append("leadOwnerRoutingSetting", ownerRouting);
    }

    if (callrecord) {
      newFormData.append("callRecording", callrecord.toString());
    }

    if (callScreen) {
      newFormData.append("callScreening", callScreen.toString());
    }

    if (callerId) {
      newFormData.append("callerId", callerId);
    }

    if (routing) {
      newFormData.append("routingType", routing);
    }
    if (fallback) {
      newFormData.append("fallbackTeam", fallback);
    }

    if (welcomeMsg) {
      if (selectedWelcomeSrc) {
        newFormData.append("welcomeMessageStatus", welcomeMsg.toString());
        newFormData.append("welcomeMessage", selectedWelcomeSrc);
      } else {
        enqueueSnackbar("Welcome Audio clip Required!", {
          variant: "error",
        });
        return;
      }
    }

    if (voicemail) {
      if (selectedVoicemailSrc) {
        newFormData.append("voicemailMessageStatus", voicemail.toString());
        newFormData.append("voicemailMessage", selectedVoicemailSrc);
      } else {
        enqueueSnackbar("Voicemail Audio clip Required!", {
          variant: "error",
        });
        return;
      }
    }

    handleNumberSetting(newFormData);
  };

  useEffect(() => {
    if (settings) {
      setDefaultValues();
    }
  }, [settings]);

  const setDefaultValues = () => {
    setCallrecord(settings.callRecording);
    setCallerId(settings.callerId || "");
    setCallScreen(settings.callScreening);
    setWelcomeMsg(settings.welcomeMessageStatus);
    // setSelectedWelcomeSrc(settings.welcomeMessage);
    setAudioSrc(settings.welcomeMessage);
    setVoicemail(settings.voicemailMessageStatus);
    // setSelectedVoicemailSrc(settings.voicemailMessage);
    setVoicemailSrc(settings.voicemailMessage);
    setFollowup(settings.voicemailFollowUpTeam);
    setRouting(settings.routingType || "");
    setSelectedTeam(settings.teamId);
    setSelectedUser(settings.userId);
    setOwnerRouting(settings.leadOwnerRoutingSetting);
    setFallback(settings.fallbackTeam || "");
  };

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(<Translations text={"Update successful!"} />, {
        variant: "success",
      });
    }
    if (isError) {
      enqueueSnackbar(<Translations text={"Update error!"} />, {
        variant: "error",
      });
    }
  }, [isError, isSuccess]);

  return (
    <>
      {isFetching && paramId ? (
        <PageLoader />
      ) : (
        <>
          <Box mb={10}>
            <Typography variant="h5">
              <Translations text={"Purchased phone number settings"} />
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {settings?.twilioNumber?.numberName} :
              {settings?.twilioNumber?.number}
            </Typography>
          </Box>
          <Card sx={{ p: 7, width: { xs: "100%", md: "80%" } }}>
            <Box sx={{ mb: "2.5rem", width: { xs: "100%", md: "40%" } }}>
              <Typography sx={{ mb: "2rem" }} variant="h6">
                <Translations text={"Name of the number"} />
              </Typography>
              <TextField
                sx={{ mb: "2.5rem" }}
                fullWidth
                id="name"
                disabled
                value={settings?.twilioNumber?.numberName}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ mb: "2.5rem" }} variant="h6">
                  <Translations text={"Call Recording"} />
                </Typography>
                <Switch
                  checked={callrecord}
                  onChange={() => setCallrecord(!callrecord)}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Box>

              <FormControl fullWidth required error={callerId?.length === 0}>
                <InputLabel id="callerId">
                  <Translations
                    text={"Caller ID that the User will see on the call"}
                  />
                </InputLabel>
                <Select
                  labelId="callerId"
                  id="callerId"
                  value={callerId}
                  label={t("Caller ID that the User will see on the call")}
                  onChange={(event: SelectChangeEvent) => {
                    setCallerId(event.target.value as string);
                  }}
                >
                  {numberList?.map((e: any, index: number) => {
                    return (
                      <MenuItem key={index} value={e._id}>
                        {e.numberName} : {e.number}
                      </MenuItem>
                    );
                  })}
                </Select>
                {callerId?.length === 0 && (
                  <FormHelperText style={{ color: "red" }}>
                    <Translations text={"Caller Id is required"} />
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "80%" } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6">
                    <Translations text={"Call Screening"} />
                  </Typography>
                  <Typography sx={{ mb: "2.5rem" }} variant="body1">
                    <Translations
                      text={
                        "Call Screening Press 1 to accept the call. Prevents calls going to user's voicemail."
                      }
                    />
                  </Typography>
                </Box>
                <Box>
                  <Switch
                    checked={callScreen}
                    onChange={() => setCallScreen(!callScreen)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: "2.5rem",
                }}
              >
                <Typography variant="h6">
                  <Translations text={"Welcome message"} />
                </Typography>

                <Switch
                  checked={welcomeMsg}
                  onChange={() => setWelcomeMsg(!welcomeMsg)}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: "2.5rem",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Box sx={{ mb: { xs: "2rem" } }}>
                  <audio src={audioSrc} controls={true} autoPlay={isPlaying} />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    height: "100%",
                    justifyContent: { xs: "center" },
                  }}
                >
                  <Box
                    sx={{
                      border: "2px solid #9155FD",
                      mr: 4,
                      borderRadius: "15%",
                    }}
                  >
                    <IconButton color="primary">
                      <Icon icon="mdi:reload" />
                    </IconButton>
                  </Box>

                  <Button
                    variant="outlined"
                    // sx={{ bgcolor: theme.palette.secondary.dark }}
                    component="label"
                    startIcon={<Icon icon="mdi:tray-arrow-up" fontSize={20} />}
                  >
                    <Translations text={"Upload"} />
                    <input
                      type="file"
                      accept="audio/*"
                      hidden
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: "2.5rem",
                }}
              >
                <Typography variant="h6">
                  <Translations text={"Voicemail message"} />
                </Typography>

                <Switch
                  checked={voicemail}
                  onChange={() => setVoicemail(!voicemail)}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: "2.5rem",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Box sx={{ mb: { xs: "2rem" } }}>
                  <audio
                    src={voicemailSrc}
                    controls={true}
                    autoPlay={isVoicemailPlaying}
                    onPause={handlePlayPauseVoicemail}
                    onPlay={handlePlayPauseVoicemail}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    height: "100%",
                    justifyContent: { xs: "center" },
                  }}
                >
                  <Box
                    sx={{
                      border: "2px solid #9155FD",
                      mr: 4,
                      borderRadius: "15%",
                    }}
                  >
                    <IconButton color="primary">
                      <Icon icon="mdi:reload" />
                    </IconButton>
                  </Box>

                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Icon icon="mdi:tray-arrow-up" fontSize={20} />}
                  >
                    <Translations text={"Upload"} />
                    <input
                      type="file"
                      accept="audio/*"
                      hidden
                      onChange={handleVoicemailUpload}
                    />
                  </Button>
                </Box>
              </Box>
              <FormControl
                sx={{ width: { xs: "100%", md: "50%" }, mb: "2.5rem" }}
                required
                error={followup?.length === 0}
              >
                <InputLabel id="followup">
                  <Translations text={"Assign Voicemail Follow Ups To Team"} />
                </InputLabel>
                <Select
                  labelId="followup"
                  id="followup"
                  value={followup}
                  label={t("Assign Voicemail Follow Ups To Team")}
                  onChange={(event: SelectChangeEvent) => {
                    setFollowup(event.target.value as string);
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
                {followup?.length === 0 && (
                  <FormHelperText>Followup team is required!</FormHelperText>
                )}
              </FormControl>
              <Typography variant="h6">
                <Translations
                  text={
                    "Routing settings for numbers that are not already in the system"
                  }
                />
              </Typography>
              <Typography sx={{ mb: "2.5rem" }} variant="body1">
                <Translations
                  text={
                    "Team routing settings will be used for leads numbers that already existing in the system"
                  }
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
                  sx={{ width: { xs: "100%", md: "50%" } }}
                  required
                  error={routing?.length === 0}
                >
                  <InputLabel id="routing">
                    <Translations text={"Routing Type"} />
                  </InputLabel>
                  <Select
                    labelId="routing"
                    id="routing"
                    value={routing}
                    label={t("Routing Type")}
                    onChange={(event: SelectChangeEvent) => {
                      setRouting(event.target.value as string);
                    }}
                  >
                    <MenuItem value={"team"}>Team</MenuItem>
                    <MenuItem value={"user"}>User</MenuItem>
                  </Select>
                  {routing?.length === 0 && (
                    <FormHelperText>Routing is required!</FormHelperText>
                  )}
                </FormControl>
                {routing === "team" && (
                  <FormControl sx={{ width: { xs: "100%", md: "50%" } }}>
                    <InputLabel id="selectedTeam">
                      <Translations text={"Select team/user"} />
                    </InputLabel>
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
                    <InputLabel id="selectedUser">
                      <Translations text={"Select team/user"} />
                    </InputLabel>
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
                sx={{ width: { xs: "100%", md: "70%" }, mb: "2.5rem" }}
              >
                <InputLabel id="ownerRouting">
                  <Translations
                    text={"Lead Owner Routing: If the lead has a lead owner"}
                  />
                </InputLabel>
                <Select
                  labelId="ownerRouting"
                  id="ownerRouting"
                  value={ownerRouting}
                  label={t("Lead Owner Routing: If the lead has a lead owner")}
                  onChange={(event: SelectChangeEvent) => {
                    setOwnerRouting(event.target.value as string);
                  }}
                >
                  {routingSetting?.map((e: any, index: number) => {
                    return (
                      <MenuItem key={index} value={e.keyName}>
                        {e.description}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl
                sx={{ width: { xs: "100%", md: "60%" } }}
                required
                error={fallback?.length === 0}
              >
                <InputLabel id="fallback">
                  <Translations text={"Fallback Team"} />
                </InputLabel>
                <Select
                  labelId="fallback"
                  required
                  id="fallback"
                  value={fallback}
                  label={t("Fallback Team")}
                  onChange={(event: SelectChangeEvent) => {
                    setFallback(event.target.value as string);
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
                {fallback?.length === 0 && (
                  <FormHelperText>Fallback is required!</FormHelperText>
                )}
              </FormControl>
            </Box>

            <Button
              variant="contained"
              type="submit"
              disabled={updating}
              sx={{ mt: 5, width: "10rem" }}
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              {updating ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                <Translations text={"Save"} />
              )}
            </Button>
          </Card>
        </>
      )}
    </>
  );
};

export default PurchaseNumberSetting;
