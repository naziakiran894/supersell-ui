import React, { Ref, forwardRef, ReactElement, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import DialogContent from "@mui/material/DialogContent";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSelector } from "react-redux";

import {
  Box,
  MenuItem,
  Dialog,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  FadeProps,
  Fade,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  InputLabel,
  FormControl,
  CircularProgress,
  Select,
} from "@mui/material";

import {
  useGetScheduleCallByIdQuery,
  useGetAllTeamsQuery,
  useGetUsersListQuery,
  useUpdateScheduleCallMutation,
} from "../../../../store/services";

import { RootState } from "../../../../store";
import { userTypes } from "../../../../store/types/globalTypes";
import { enqueueSnackbar } from "notistack";
import { ICallSchedule } from "../../../../store/types/scheduleCall.types";
import PageLoader from "../../../../@core/components/loader/PageLoader";
import Icon from "../../../../@core/components/icon";
import Translations from "../../../../@core/layouts/Translations";
import { Trans } from "react-i18next";

const addSchedulledCallSchema = Yup.object({
  dateTime: Yup.string().required("Date & Time Format is required"),
  noteToCall: Yup.string().required("Note to call is required"),
  selection: Yup.string().required("Selection is required"),
  team: Yup.string().test({
    name: "teamRequired",
    test: function (value) {
      const selection = this.parent.selection;
      return selection === "user" || !!value;
    },
    message: "Team is required",
  }),
  user: Yup.string().test({
    name: "userRequired",
    test: function (value) {
      const selection = this.parent.selection;
      return selection === "team" || !!value;
    },
    message: "User is required",
  }),
});

export interface IFormData {
  dateTime: null | string;
  noteToCall: string;
  selection: string;
  team: string;
  user: string;
}
interface IProps {
  scheduleId: string;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const EditScheduledCallDialog = ({ scheduleId, setShow, show }: IProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [
    handleUpdateScheduleCall,
    { error: updateError, isSuccess: updateSuccess, isLoading: isUpdating },
  ] = useUpdateScheduleCallMutation();

  const { data: callScheduleApiData, isLoading: isFetching } =
    useGetScheduleCallByIdQuery(scheduleId);

  const { data, isLoading } = useGetAllTeamsQuery("");
  const { data: apiData } = useGetUsersListQuery("");

  //@ts-ignore
  const callScheduleDetails: ICallSchedule = callScheduleApiData?.data;
  //@ts-ignore
  const teams: ITeam[] = data?.data;
  //@ts-ignore
  const users: IUserList[] = apiData?.data;

  const clientTimeSetting = useSelector(
    (state: RootState) => state.clientSetting.ClientSetting
  );

  const handleUpdate = (values: IFormData) => {
    const payload = {
      _id: scheduleId,
      scheduledCallId: scheduleId,
      scheduledCallDateTime: values.dateTime,
      noteToCall: values.noteToCall,
      scheduledFor: values.selection,
      teamId: values.team,
      userId: values.user,
    };
    handleUpdateScheduleCall(payload);
  };

  useEffect(() => {
    if (updateSuccess) {
      enqueueSnackbar("Updated Successfully", { variant: "success" });
    } else if (updateError) {
      enqueueSnackbar("Update failed! Please try again!", { variant: "error" });
    }
  }, [updateError, updateSuccess]);
  return (
    <>
      <Dialog
        fullWidth
        open={show}
        maxWidth="md"
        scroll="body"
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setShow(false)}
      >
        {isFetching || isLoading ? (
          <PageLoader />
        ) : (
          <Formik
            initialValues={{
              dateTime: callScheduleDetails?.scheduledCallDateTime || null,
              noteToCall: callScheduleDetails?.noteToCall || "",
              selection: callScheduleDetails?.scheduledFor || "team",
              team: callScheduleDetails?.teamId || "",
              user: callScheduleDetails?.userId || "",
            }}
            enableReinitialize
            validationSchema={addSchedulledCallSchema}
            onSubmit={(values) => handleUpdate(values)}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  sx={{
                    position: "relative",
                    pb: (theme) => `${theme.spacing(8)} !important`,
                    px: (theme) => [
                      `${theme.spacing(5)} !important`,
                      `${theme.spacing(15)} !important`,
                    ],
                    pt: (theme) => [
                      `${theme.spacing(8)} !important`,
                      `${theme.spacing(12.5)} !important`,
                    ],
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setShow(false)}
                    sx={{
                      position: "absolute",
                      right: "1rem",
                      top: "1rem",
                    }}
                  >
                    <Icon icon="mdi:close" />
                  </IconButton>
                  <Box sx={{ mx: { xs: 5, sm: 40 } }}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        fontSize: 24,
                        fontWeight: 500,
                        margin: "30px 20px",
                      }}
                    >
                      <Translations text={"Edit Scheduled Call"} />
                    </Typography>
                    <FormControl fullWidth>
                      <DatePicker
                        format={
                          clientTimeSetting?.defaultDateTimeFormat ||
                          "DD.MM.YYYY hh.mm"
                        }
                        // format="DD.MM.YYYY hh.mm"
                        slotProps={{
                          textField: {
                            error: touched.dateTime && Boolean(errors.dateTime),
                            helperText:
                              touched.dateTime && (errors.dateTime as string),
                          },
                        }}
                        value={values.dateTime ? dayjs(values.dateTime) : null}
                        onChange={(e: any) => {
                          setFieldValue("dateTime", e);
                        }}
                      />
                    </FormControl>
                    <TextField
                      fullWidth
                      sx={{
                        mt: 4,
                        mb: 4,
                      }}
                      label="Note to Call"
                      multiline
                      rows={4}
                      name="noteToCall"
                      value={values.noteToCall}
                      error={touched.noteToCall && Boolean(errors.noteToCall)}
                      helperText={
                        touched.noteToCall && (errors.noteToCall as string)
                      }
                      onChange={handleChange}
                    />
                    {user?.roleName !== userTypes.USER && (
                      <>
                        <Typography>
                          <Translations text={"Schedule For"} />{" "}
                        </Typography>
                        <ToggleButtonGroup
                          fullWidth
                          sx={{ padding: "20px 5px", color:"black" }}
                          exclusive
                          aria-label="team or user"
                          value={values.selection}
                          onChange={(event, value) =>
                            setFieldValue("selection", value)
                          }
                        >
                          <ToggleButton
                            sx={{
                              borderTopLeftRadius: "25px",
                              borderBottomLeftRadius: "25px",
                            }}
                            value="team"
                          >
                            {values.selection === "team" && (
                              <Icon
                                style={{ marginRight: "0.2rem" }}
                                icon="mdi:check"
                              />
                            )}
                            <Translations text={"Team"} />
                          </ToggleButton>
                          <ToggleButton
                            sx={{
                              borderTopRightRadius: "25px",
                              borderBottomRightRadius: "25px",
                            }}
                            value="user"
                          >
                            {values.selection === "user" && (
                              <Icon
                                style={{ marginRight: "0.2rem" }}
                                icon="mdi:check"
                              />
                            )}
                            <Translations text={"User"} />
                          </ToggleButton>
                        </ToggleButtonGroup>

                        {values.selection === "team" ? (
                          <FormControl
                            fullWidth
                            error={touched.team && Boolean(errors.team)}
                          >
                            <InputLabel id="Select Team">
                              <Translations text={"Select Team"} />
                            </InputLabel>
                            <Select
                              labelId="Select Team"
                              id="Select Team"
                              name="team"
                              value={values.team}
                              label="Select Team"
                              onChange={handleChange}
                            >
                              {teams?.map((team, index) => {
                                return (
                                  <MenuItem key={index} value={team?._id}>
                                    {team?.teamName}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                            {touched.team && errors.team && (
                              <Typography variant="caption" color="error">
                                {errors.team as string}
                              </Typography>
                            )}
                          </FormControl>
                        ) : (
                          <FormControl
                            fullWidth
                            error={touched.user && Boolean(errors.user)}
                          >
                            <InputLabel id="Select User">
                              <Translations text={"Select User"} />
                            </InputLabel>
                            <Select
                              labelId="Select User"
                              id="Select User"
                              name="user"
                              value={values.user}
                              label="Select User"
                              onChange={handleChange}
                            >
                              {users?.map((user, index: number) => {
                                return (
                                  <MenuItem key={index} value={user?._id}>
                                    {user?.firstName} {user?.lastName}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                            {touched.user && errors.user && (
                              <Typography variant="caption" color="error">
                                {errors.user as string}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      </>
                    )}
                  </Box>
                </DialogContent>
                <DialogActions
                  sx={{
                    justifyContent: "center",
                    px: (theme) => [
                      `${theme.spacing(5)} !important`,
                      `${theme.spacing(15)} !important`,
                    ],
                    pb: (theme) => [
                      `${theme.spacing(8)} !important`,
                      `${theme.spacing(12.5)} !important`,
                    ],
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{ mr: 1 }}
                    onClick={() => setShow(false)}
                    type="submit"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setShow(false)}
                  >
                    <Translations text={"Cancel"} />
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        )}
      </Dialog>
    </>
  );
};

export default EditScheduledCallDialog;
