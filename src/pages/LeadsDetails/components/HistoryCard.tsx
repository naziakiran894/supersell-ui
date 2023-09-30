import { Box, CardContent, Typography, Grid } from "@mui/material";
import {
  TimelineConnector,
  TimelineSeparator,
  TimelineItem,
  TimelineContent,
} from "@mui/lab";
import MuiTimeline, { TimelineProps } from "@mui/lab/Timeline";
import { styled, useTheme } from "@mui/material/styles";
import Icon from "../../../@core/components/icon";
import { useGetLeadHistoryQuery } from "../../../store/services";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import Audio from "../../../@core/components/Audio/Audio";

const LEAD = "LEAD";
const TEAM = "CALLER_TEAM";
const CALLER = "CALLER_USER";

const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  "& .MuiTimelineItem-root": {
    width: "100%",
    "&:before": {
      display: "none",
    },
  },
});

interface IHistory {
  createdAt: string;
  historyDescription: string;
  historyTitle: string;
  historyType: string;
  recordingSid?: string;
  callerUserName?: string;
  callerTeamName?: string;
  leadName?: string;
  leadId: string;
  __v: number;
  _id: string;
}

const handleAddUserOrTeamName = ({
  text,
  teamName,
  leadName,
  callerName,
}: {
  text?: string;
  teamName?: string;
  leadName?: string;
  callerName?: string;
}) => {
  if (text?.includes(`{{${LEAD}}}`)) {
    text = text.replace(`{{${LEAD}}}`, leadName || "Lead");
  }
  if (text?.includes(`{{${TEAM}}}`)) {
    text = text.replace(`{{${TEAM}}}`, teamName || "Team");
  }
  if (text?.includes(`{{${CALLER}}}`)) {
    text = text.replace(`{{${CALLER}}}`, callerName || "Caller");
  }

  return text;
};

//@ts-ignore
const RECORDING_BASE_URL = import.meta.env.VITE_TWILIO_RECORDING_URL;
const HistoryCard = ({ leadId }: { leadId?: string }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  //@ts-ignore
  const { data: historydData } = useGetLeadHistoryQuery(leadId);
  //@ts-ignore
  const leadHistory: IHistory[] = historydData?.data;

  if (!leadHistory || leadHistory.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={7}>
        <Typography variant="h6">{t("No History")}</Typography>
      </Box>
    );
  }

  return (
    <CardContent>
      <Grid container>
        <Timeline sx={{ my: 0, py: 0 }}>
          {leadHistory?.map((history) => {
            let formattedDate = dayjs(history.createdAt);
            let currentDate = dayjs();
            let daysPassed = currentDate.diff(formattedDate, "day");
            let hoursPassed = currentDate.diff(formattedDate, "hour");
            let minutesPassed = currentDate.diff(formattedDate, "minute");

            let iconValue = "";
            if (history?.historyType === "note") {
              iconValue = "mdi:note-text";
            } else if (history?.historyType === "sms") {
              iconValue = "mdi-message-processing";
            } else if (history?.historyType === "lead") {
              iconValue = "mdi-account-multiple";
            } else if (history?.historyType === "conversation") {
              iconValue = "mdi-phone";
            }
            return (
              <TimelineItem
                sx={{
                  "& .MuiTimelineSeparator-root": {
                    width: "1px",
                  },
                }}
              >
                <TimelineSeparator sx={{ mt: 2 }}>
                  <Icon color={theme.palette.primary.main} icon={iconValue} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent
                  sx={{
                    mt: 0,
                    pl: 5,
                    mb: (theme) => `${theme.spacing(2)} !important`,
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                      mb: 2.5,
                    }}
                  >
                    <Box width="60%">
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{
                          mr: 2,
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {handleAddUserOrTeamName({
                          text: history.historyTitle,
                          leadName: history.leadName,
                          teamName: history.callerTeamName,
                          callerName: history.callerUserName,
                        })}
                      </Typography>

                      <Box>
                        <Typography
                          sx={{ display: "inline" }}
                          variant="body2"
                          color="text.secondary"
                        >
                          {!!history.callerUserName
                            ? `${history.callerUserName}:`
                            : !!history.callerTeamName
                            ? `${history.callerTeamName}:`
                            : ""}{" "}
                          {handleAddUserOrTeamName({
                            text: history.historyDescription,
                            leadName: history.leadName,
                            teamName: history.callerTeamName,
                            callerName: history.callerUserName,
                          })}
                        </Typography>
                        {history.recordingSid && (
                          <Audio
                            type="audio/mpeg"
                            url={`${RECORDING_BASE_URL}/${history.recordingSid}`}
                          />
                        )}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end"
                    >
                      <Typography variant="caption" color="text.primary">
                        {formattedDate.format("MMMM DD, H.mm")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {daysPassed > 0 && (
                          <>
                            {daysPassed}
                            <span>days </span>
                          </>
                        )}

                        {daysPassed == 0 && hoursPassed == 1 && (
                          <span>{`${hoursPassed} hour ago`}</span>
                        )}
                        {daysPassed == 0 && hoursPassed > 1 && (
                          <span>{`${hoursPassed} hours ago`}</span>
                        )}
                        {daysPassed == 0 && hoursPassed == 0 && (
                          <span>{`${minutesPassed} minutes ago`}</span>
                        )}

                        {daysPassed == 0 &&
                          hoursPassed == 0 &&
                          minutesPassed == 0 && <span>{`Just Now`}</span>}
                      </Typography>
                    </Box>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Grid>
    </CardContent>
  );
};

export default HistoryCard;
