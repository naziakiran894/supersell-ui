import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  Switch,
  Typography,
  useTheme,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useSnackbar } from "notistack";
import {
  useGetAllNumbersQuery,
  useGetAllTeamsQuery,
} from "../../store/services";
import { useParams } from "react-router-dom";
import Icon from "../../@core/components/icon";
import { INumberSettingsFormData } from ".";
import { FormikProps } from "formik";
import Translations from "../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";

export interface IValues {
  callScreening: boolean;
  welcomeMessageStatus: boolean;
  welcomeMessageAudio: string;
  voicemailMessageStatus: boolean;
  voicemailMessageAudio: string;
  voicemailFollowUpTeam: string;
  teamId: string;
}
type IProps = {
  props: FormikProps<any>;
};

const CallScreening = ({ props }: IProps) => {
  const { values, touched, errors, handleChange } = props;
  const [welcomeMsg, setWelcomeMsg] = useState(false);
  const [voicemail, setVoicemail] = useState(false);
  const [callScreen, setCallScreen] = useState(false);
  const [audioSrc, setAudioSrc] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [voicemailSrc, setVoicemailSrc] = useState("");
  const [isVoicemailPlaying, setIsVoicemailPlaying] = useState(false);
  const [selectedWelcomeSrc, setSelectedWelcomeSrc] = useState("");
  const [selectedVoicemailSrc, setSelectedVoicemailSrc] = useState("");

  const { data: teamList } = useGetAllTeamsQuery("");
  const { t } = useTranslation();
  //@ts-ignore
  // const numberList: any = list?.data;

  //@ts-ignore
  // const settings = numberSetting?.data;

  //@ts-ignore
  const teams = teamList?.data;

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

  return (
    <Box sx={{ width: { xs: "100%", md: "80%" } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6">Call Screening</Typography>
          <Typography sx={{ mb: "2.5rem" }} variant="body1">
            <Translations
              text={`Call Screening Press 1 to accept the call. Prevents calls going to
            user's voicemail.`}
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
            Upload
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
          <Translations text="Voicemail message" />
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
            Upload
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
        error={touched.followUp && Boolean(errors.followUp)}
        sx={{ width: { xs: "100%", md: "50%" }, mb: "2.5rem" }}
      >
        <InputLabel id="followup">
          <Translations text="Assign Voicemail Follow Ups To Team" />
        </InputLabel>
        <Select
          labelId="followup"
          id="followup"
          name="followUp"
          label={t("Assign Voicemail Follow Ups To Team")}
          value={values.followUp}
          onChange={handleChange}
          error={touched.followUp && Boolean(errors.followUp)}
        >
          {teams?.map((e: any, index: number) => {
            return (
              <MenuItem key={index} value={e._id}>
                {e.teamName}
              </MenuItem>
            );
          })}
        </Select>
        {touched.followUp && (
          <FormHelperText>{errors.followUp as string}</FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};
export default CallScreening;
