import {
  Fragment,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  ButtonGroup,
  ClickAwayListener,
} from "@mui/material";

import Icon from "../../../@core/components/icon";
import { ILead } from "../../../store/types/lead.types";
import {
  useGetTagsAndStatusesQuery,
  useAddLeadTagsMutation,
  useSetStageMutation,
  useGetMeetingDetailsByLeadIdQuery,
  useDeleteMeetingMutation,
  useGetScheduleCallByLeadIdQuery,
  useDeleteScheduleCallServiceMutation,
} from "../../../store/services";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ITagsAndStatuses } from "../../../store/types/tagsAndStatuses.types";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import DialogEditMettings from "../../Meetings/components/EditMeetingDialog";
import WarningDialog from "../../../@core/components/warningDialog/WarningDialog";
import { handleReplaceDynVar } from "../../../lib/dynamicVariableReplacer";
import dayjs from "dayjs";
import { handleCurrentStatus } from "../../Leads/components/LeadsTable";
import { ICallSchedule } from "../../../store/types/scheduleCall.types";
import { currentTab } from "../../../store/slices/editScheduleSlice";
import { useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";
import { INITAIAL_STAGES } from "../../TagsAndStatuses";
interface IProps {
  leadDetails: ILead;
}
export interface IQuery {
  leadId?: string;
  tags: ITagsAndStatuses[];
}

const Header = ({ leadDetails }: IProps) => {
  const { t } = useTranslation();
  const { leadId } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const clientId = useSelector(
    (state: RootState) => state.auth.user?.companyId
  );
  const meetingDetails = useSelector(
    (state: RootState) => state?.leadMeeting?.meeting
  );

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const tagMenuRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState<boolean>(false);
  const [openTagMenu, setOpenTagMenu] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<ITagsAndStatuses[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState(false);

  const [handleAddLeadTags, { isSuccess, error }] = useAddLeadTagsMutation();
  const [handleSetStage, { isSuccess: successful, error: fault }] =
    useSetStageMutation();
  const { data } = useGetTagsAndStatusesQuery(clientId);
  const { data: callScheduleApiData, isLoading: isFetching } =
    useGetScheduleCallByLeadIdQuery(leadId);

  useGetMeetingDetailsByLeadIdQuery(leadId);

  const [
    handleDeleteMeeting,
    { isLoading: isDeleting, isSuccess: isDeleted, error: deletingError },
  ] = useDeleteMeetingMutation();

  const [handleDeleteScheduleCall, { isLoading, isSuccess: deleted }] =
    useDeleteScheduleCallServiceMutation();

  //@ts-ignore
  const tags: ITagsAndStatuses[] = useMemo(() => data?.data?.tags?.filter?.((e) => e.visible) || [data]);

  //@ts-ignore
  const stages: ITagsAndStatuses[] = data?.data?.stages?.length ? data?.data?.stages: INITAIAL_STAGES;

  const currentLeadStage: ITagsAndStatuses = useMemo(
    () =>
      handleCurrentStatus(stages, leadDetails?.leadStageId) as ITagsAndStatuses,
    [stages, leadDetails?.leadStageId]
  );
  const dateFormat = useSelector(
    (state: RootState) =>
      state?.clientSetting?.ClientSetting?.defaultDateTimeFormat
  );

  //@ts-ignore
  const scheduledCall: ICallSchedule = callScheduleApiData?.data;

  const sendData = (tag: any) => {
    let payload: IQuery = {
      leadId: leadId,
      tags: tag,
    };
    handleAddLeadTags(payload);
  };

  useEffect(() => {
    if (isDeleted || deleted) {
      setShowDialog(false);
      enqueueSnackbar(<Translations text="Deleted Successfully!" />, {
        variant: "success",
      });
    } else if (deletingError) {
      enqueueSnackbar(<Translations text="Something went wrong!" />, {
        variant: "error",
      });
    }
  }, [isDeleted, deletingError, deleted]);

  useEffect(() => {
    if (successful) {
      enqueueSnackbar(<Translations text="Update Successful" />, {
        variant: "success",
      });
    }
    if (fault) {
      enqueueSnackbar(
        <Translations text="Update failed! Please try again!" />,
        { variant: "error" }
      );
    }
  }, [successful, fault]);

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(<Translations text="Update Successful" />, {
        variant: "success",
      });
    }
    if (error) {
      enqueueSnackbar(
        <Translations text="Update failed! Please try again!" />,
        { variant: "error" }
      );
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (leadDetails?.tags) {
      setSelectedTags(leadDetails?.tags);
    }
  }, [leadDetails?.tags]);

  const handleMenuItemClick = (
    event: SyntheticEvent,
    stage: ITagsAndStatuses
  ) => {
    const payload = {
      leadId: leadId,
      leadStageId: stage?.id,
    };
    handleSetStage(payload);
    setOpen(false);
  };

  const handleNavigate = () => {
    dispatch(currentTab("schedule"));
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const nextMeeting = useMemo(() => {
    const currentDate: Date = new Date();

    const scheduledCallDate = scheduledCall?.scheduledCallDateTime
      ? new Date(scheduledCall.scheduledCallDateTime)
      : null;
    const scheduledCallTimeDiff = scheduledCallDate
      ? Math.abs(currentDate.getTime() - scheduledCallDate.getTime())
      : Infinity;

    const meetingDate = meetingDetails?.meetingDate
      ? new Date(meetingDetails.meetingDate)
      : null;
    const meetingTimeDiff = meetingDate
      ? Math.abs(currentDate.getTime() - meetingDate.getTime())
      : Infinity;

    if (
      meetingDate &&
      meetingDate < currentDate &&
      scheduledCallDate &&
      scheduledCallDate < currentDate
    ) {
      return null;
    }

    if (
      meetingDate &&
      meetingDate > currentDate &&
      scheduledCallDate &&
      scheduledCallDate > currentDate
    ) {
      if (scheduledCallDate > meetingDate) {
        return {
          type: "scheduledCall",
          data: scheduledCall,
        };
      } else {
        return {
          type: "meeting",
          data: meetingDetails,
        };
      }
    }

    let recentObject;

    if (
      scheduledCallTimeDiff !== Infinity &&
      (meetingTimeDiff === Infinity || scheduledCallTimeDiff < meetingTimeDiff)
    ) {
      recentObject = {
        type: "scheduledCall",
        data: scheduledCall,
      };
    } else if (meetingTimeDiff !== Infinity) {
      recentObject = {
        type: "meeting",
        data: meetingDetails,
      };
    } else {
      recentObject = null;
    }

    return recentObject;
  }, [scheduledCall, meetingDetails]);

  const handleAddTag = (event: SyntheticEvent, index: number) => {
    setSelectedTags((prevState) => {
      const updatedTags: ITagsAndStatuses[] = [...prevState, tags[index]];
      sendData(updatedTags);
      return updatedTags;
    });
    setOpenTagMenu(false);
  };

  const handleRemoveTag = (index: number) => {
    let updatedTags: ITagsAndStatuses[] = [];
    setSelectedTags((prevState) => {
      updatedTags = prevState.filter((_, i) => i !== index);
      return updatedTags;
    });
    sendData(updatedTags);
  };

  const handleToggleTagMenu = () => {
    setOpenTagMenu((prevOpen) => !prevOpen);
  };

  const handleCloseTagMenu = () => {
    setOpenTagMenu(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const Chip = ({ textColor, statusName, backgroundColor, index }: any) => {
    return (
      <Box
        display="flex"
        alignItems="center"
        columnGap={2}
        sx={{
          height: "fit-content",
          padding: "3px 10px",
          cursor: "pointer",
          borderRadius: 5,
          color: textColor,
          backgroundColor: backgroundColor,
        }}
      >
         <Translations text= {statusName}/>
        {/* {statusName} */}
        <Icon
          icon="mdi:close"
          fontSize={20}
          color={textColor}
          onClick={() => handleRemoveTag(index)}
        />
      </Box>
    );
  };

  return (
    <Card sx={{ m: 4, p: 4 }}>
      <CardContent>
        <Typography sx={{ mb: 1.5 }} variant="h5" color="text.primary">
          {leadDetails?.address}
        </Typography>
        <Typography sx={{ mb: 1.5 }} variant="h6" color="text.secondary">
          {leadDetails?.firstName} {leadDetails?.lastName}
        </Typography>

        <Box>
          <Box
            display="flex"
            mr={4}
            columnGap="18px"
            rowGap="10px"
            flexWrap="wrap"
            alignItems="center"
          >
            {selectedTags?.map((option: ITagsAndStatuses, index: number) => (
              <Chip
                key={index}
                statusName={option?.statusName}
                textColor={option?.textColor}
                backgroundColor={option?.backgroundColor}
                index={index}
              />
            ))}
            <Fragment>
              <ButtonGroup
                ref={tagMenuRef}
                color="secondary"
                aria-label="medium secondary button group"
              >
                <Button
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                  }}
                  variant="outlined"
                  color="primary"
                  aria-haspopup="menu"
                  onClick={handleToggleTagMenu}
                  aria-expanded={open ? "true" : undefined}
                  aria-controls={open ? "split-button-menu" : undefined}
                  endIcon={<Icon icon="mdi:plus" />}
                >
                  {t("Add Tags")}
                </Button>
              </ButtonGroup>
              <Popper
                open={openTagMenu}
                anchorEl={tagMenuRef.current}
                role={undefined}
                transition
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleCloseTagMenu}>
                        <MenuList id="split-button-menu">
                          {tags?.map(
                            (option: ITagsAndStatuses, index: number) => (
                              <MenuItem
                                key={index}
                                selected={selectedTags
                                  .map((tag) => tag.id)
                                  .includes(option.id)}
                                onClick={(event) => {
                                  handleAddTag(event, index);
                                }}
                              >
                                  <Translations text={option.statusName} />
                              </MenuItem>
                            )
                          )}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Fragment>
          </Box>
        </Box>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Box>
          {nextMeeting && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography variant="h6">{t("Next")}:</Typography>
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Icon
                  fontSize={"2rem"}
                  icon="mdi:calendar-blank"
                  color="gray"
                />
              </Box>
              <Typography variant="h6">
                {nextMeeting.type === "meeting"
                  ? handleReplaceDynVar(
                      meetingDetails?.leadId,
                      meetingDetails?.meetingId?.meetingBasicInfo
                        ?.meetingTitle || ""
                    )
                  : "Scheduled Call"}
                <br />
              </Typography>
              <Typography variant="body2" color="gray">
                {nextMeeting.type === "meeting" &&
                  handleReplaceDynVar(
                    meetingDetails?.leadId,
                    meetingDetails?.meetingId?.meetingBasicInfo?.meetingSubTitle
                      .value || ""
                  )}{" "}
                {nextMeeting.type === "meeting"
                  ? meetingDetails?.meetingDate && dateFormat
                    ? dayjs(meetingDetails?.meetingDate).format(dateFormat)
                    : dayjs(meetingDetails?.meetingDate).format(
                        "DD.MM.YYYY hh.mm"
                      )
                  : scheduledCall?.scheduledCallDateTime && dateFormat
                  ? dayjs(scheduledCall?.scheduledCallDateTime).format(
                      dateFormat
                    )
                  : dayjs(scheduledCall?.scheduledCallDateTime).format(
                      "DD.MM.YYYY hh.mm"
                    )}
                <br />
              </Typography>

              <Box
                onClick={() => {
                  nextMeeting.type === "meeting"
                    ? setShow(true)
                    : handleNavigate();
                }}
                sx={{
                  display: "flex",
                  cursor: "pointer",
                }}
              >
                <Icon
                  fontSize={"2rem"}
                  icon="mdi:pencil-outline"
                  color="gray"
                />
              </Box>
              <Box
                onClick={() => setShowDialog(true)}
                sx={{
                  display: "flex",
                  cursor: "pointer",
                }}
              >
                <Icon
                  fontSize={"2rem"}
                  icon="ic:baseline-delete"
                  color={"gray"}
                />
              </Box>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            "&.MuiBox-root": {
              marginLeft: "0px !important",
            },
          }}
        >
          <Fragment>
            <ButtonGroup
              sx={{
                color: currentLeadStage?.textColor,
                backgroundColor: currentLeadStage?.backgroundColor,
              }}
              ref={anchorRef}
              aria-label="split button"
            >
              <Button
                variant="text"
                aria-haspopup="menu"
                onClick={handleToggle}
                aria-expanded={open ? "true" : undefined}
                aria-controls={open ? "split-button-menu" : undefined}
                sx={{
                  color: currentLeadStage?.textColor,
                  backgroundColor: currentLeadStage?.backgroundColor,
                  "& :hover": {
                    border: "none",
                    background: `${currentLeadStage?.backgroundColor} !important`,
                  },
                }}
              >
                <Translations text={currentLeadStage?.statusName} />
                
              </Button>
            </ButtonGroup>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="split-button-menu">
                        {stages
                          .filter((e) => e?.visible)
                          ?.map((option: ITagsAndStatuses, index: number) => (
                            <MenuItem
                              key={index}
                              selected={option.id === currentLeadStage?.id}
                              onClick={(event) =>
                                handleMenuItemClick(event, option)
                              }
                            >
                              <Translations text={option.statusName} />
                              {/* {option.statusName} */}
                            </MenuItem>
                          ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Fragment>
        </Box>
      </CardActions>
      <DialogEditMettings
        setShow={setShow}
        show={show}
        meetingId={meetingDetails ? meetingDetails?._id : ""}
      />
      {nextMeeting && (
        <WarningDialog
          content={
            nextMeeting.type === "meeting"
              ? "Are you sure you want to delete meeting?"
              : "Are you sure you want to delete scheduled call?"
          }
          isLoading={isDeleting || isLoading}
          setShow={setShowDialog}
          onConfirm={() => {
            if (nextMeeting.type === "meeting" && meetingDetails?._id) {
              handleDeleteMeeting(meetingDetails._id);
            } else if (scheduledCall?._id) {
              handleDeleteScheduleCall(scheduledCall?._id);
            }
          }}
          show={showDialog}
        />
      )}
    </Card>
  );
};

export default Header;
