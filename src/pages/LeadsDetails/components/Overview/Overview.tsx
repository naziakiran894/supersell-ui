import React, { useEffect, useState } from "react";
import { Box, Card, Grid, Typography } from "@mui/material";

import Icon from "../../../../@core/components/icon/index";

import NotesComponent from "../Notes";
import Offers from "../Offers";
import HistoryCard from "../HistoryCard";
import { ILead } from "../../../../store/types/lead.types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import {
  useDeleteMeetingMutation,
  useGetMeetingDetailsByLeadIdQuery,
} from "../../../../store/services";
import { useParams } from "react-router-dom";
import { IMeeting } from "../../../../store/types/meeting.types";
import dayjs from "dayjs";
import { handleReplaceDynVar } from "../../../../lib/dynamicVariableReplacer";
import { useSnackbar } from "notistack";
import DialogEditMettings from "../../../Meetings/components/EditMeetingDialog";
import WarningDialog from "../../../../@core/components/warningDialog/WarningDialog";
import { Translation, useTranslation } from "react-i18next";
import Translations from "../../../../@core/layouts/Translations";

interface IProps {
  leadDetails: ILead;
}
interface DataItem {
  keyName: string;
  visible: boolean;
}

const index = ({ leadDetails }: IProps) => {
  const { leadId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslation();

  const [showDialog, setShowDialog] = useState(false);
  const [show, setShow] = useState(false);

  const fields = useSelector(
    (state: RootState) => state?.fields?.fields?.offersAndDeals
  );
  const dateFormat = useSelector(
    (state: RootState) =>
      state?.clientSetting?.ClientSetting?.defaultDateTimeFormat
  );

  const meetingDetails = useSelector(
    (state: RootState) => state?.leadMeeting?.meeting
  );

  useGetMeetingDetailsByLeadIdQuery(leadId);

  const [
    handleDeleteMeeting,
    { isLoading: isDeleting, isSuccess: isDeleted, error },
  ] = useDeleteMeetingMutation();

  useEffect(() => {
    if (isDeleted) {
      setShowDialog(false);
      enqueueSnackbar(<Translations text="Deleted Successfully!" />, {
        variant: "success",
      });
    } else if (error) {
      enqueueSnackbar(<Translations text="Something went wrong!" />, {
        variant: "error",
      });
    }
  }, [isDeleted, error]);

  const shouldHideBox = fields?.every((item: DataItem) => !item.visible);

  return (
    <Grid container>
      <Grid item md={6} xs={12}>
        <Card sx={{ p: 5, mb: 4, mr: 4 }}>
          <Typography mb={6} variant="h6" color="text.primary">
            {/* Notes */}
            <Translations text="Notes" />{" "}
          </Typography>
          <NotesComponent leadDetails={leadDetails} />
        </Card>
      </Grid>
      <Grid item md={6} xs={12}>
        {meetingDetails && (
          <Card sx={{ p: 5, mb: 4 }}>
            <Box sx={{ display: "flex" }}>
              <Icon fontSize={"2rem"} icon="mdi:calendar-blank" color="gray" />
              <Typography
                mb={5}
                ml={3}
                variant="h6"
                color="text.primary"
                fontWeight={500}
              >
                {t("Meeting")}
              </Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Box width={"80%"}>
                <Typography variant="body1" fontWeight={600} mb={3}>
                  {meetingDetails?.meetingDate && dateFormat
                    ? dayjs(meetingDetails?.meetingDate).format(dateFormat)
                    : dayjs(meetingDetails?.meetingDate).format("MMM DDo h.mm")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  fontWeight={400}
                  mb={3}
                >
                  {handleReplaceDynVar(
                    meetingDetails?.leadId,
                    meetingDetails?.meetingId?.meetingBasicInfo?.meetingTitle ||
                      ""
                  )}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={400}
                >
                  {handleReplaceDynVar(
                    meetingDetails?.leadId,
                    meetingDetails?.meetingId?.meetingBasicInfo?.meetingSubTitle
                      .value || ""
                  )}
                </Typography>
              </Box>
              <Box sx={{ cursor: "pointer" }}>
                <Icon
                  onClick={() => setShow(true)}
                  fontSize={"1.75rem"}
                  icon="mdi:pencil-outline"
                  color="gray"
                />
                <Icon
                  onClick={() => setShowDialog(true)}
                  fontSize={"1.75rem"}
                  icon="ic:baseline-delete"
                  color={"gray"}
                />
              </Box>
            </Box>

            {/* <Offers leadDetails={leadDetails} /> */}
          </Card>
        )}
        {shouldHideBox ? null : (
          <Card sx={{ p: 5, mb: 4 }}>
            <Typography mb={5} variant="h6" color="text.primary">
              {t("Offers & Deals")}
            </Typography>
            <Offers leadDetails={leadDetails} />
          </Card>
        )}
      </Grid>

      <Grid item sm={12} xs={12}>
        <Card sx={{ p: 5, mb: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center", columnGap: "9px" }}>
            <Icon icon="mdi:graph-timeline-variant" color="black" />
            <Typography variant="h6" color="text.primary">
              {t("History")}
            </Typography>
          </Box>
          {!!leadId && <HistoryCard leadId={leadId} />}
        </Card>
      </Grid>

      <DialogEditMettings
        setShow={setShow}
        show={show}
        meetingId={meetingDetails ? meetingDetails?._id : ""}
      />

      <WarningDialog
        content={t("Are you sure you want to delete meeting?")}
        isLoading={isDeleting}
        setShow={setShowDialog}
        onConfirm={() => {
          if (meetingDetails?._id) {
            handleDeleteMeeting(meetingDetails?._id);
          }
        }}
        show={showDialog}
      />
    </Grid>
  );
};

export default index;
