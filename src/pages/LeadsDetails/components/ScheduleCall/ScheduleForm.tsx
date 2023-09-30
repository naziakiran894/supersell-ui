import { useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";

import {
  useAddScheduleCallMutation,
  useGetUsersListQuery,
  useUpdateScheduleCallMutation,
} from "../../../../store/services";
import {
  useGetAllTeamsQuery,
  useGetScheduleCallByLeadIdQuery,
} from "../../../../store/services";

import { RootState } from "../../../../store";
import {
  defaultTimeFormat,
  userTypes,
} from "../../../../store/types/globalTypes";
import { ITeam } from "../../../../store/types/team.types";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Icon from "../../../../@core/components/icon/index";
import en from 'date-fns/locale/en-US';
import fi from 'date-fns/locale/fi';
import "react-datepicker/dist/react-datepicker.css";


import { registerLocale } from "react-datepicker";
import dayjs from "dayjs";
import { ICallSchedule } from "../../../../store/types/scheduleCall.types";
import PageLoader from "../../../../@core/components/loader/PageLoader";
import { IUserList } from "../../../../store/types/user.types";
import {useTranslation } from "react-i18next";
import Translations from "../../../../@core/layouts/Translations";
import ClientSettings from "../../../ClientSettings";


interface ScheduleCall {
  dateTime: string | null;
  note: string;
  selection: string;
  team: string;
  user: string;
}

registerLocale("fi", fi);
registerLocale("en", en);

const schema = Yup.object().shape({
  dateTime: Yup.date()
    .typeError("Please enter a valid date")
    .required("Date and Time is required"),
  selection: Yup.string().required("Selection is required"),
  team: Yup.string().test({
    name: "teamRequired",
    test: function (value) {
      const selection: any = this.parent.selection;
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
dayjs.locale("fn");


const ScheduleForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { leadId } = useParams();

  const { t } = useTranslation();

  let queryParams = new URLSearchParams(window.location.search);
  const scheduleId = queryParams.get("sId");

  const user = useSelector((state: RootState) => state.auth.user);

  console.log(user, "user");

  const [
    handleAddScheduleCall,
    { error: updateError, isSuccess: isAdded, isLoading: isAdding },
  ] = useAddScheduleCallMutation();
  const [
    handleUpdateScheduledCall,
    { error: addError, isLoading: isUpdating, isSuccess: updateSuccess },
  ] = useUpdateScheduleCallMutation();

  const { data: callScheduleApiData, isLoading: isFetching } =
    useGetScheduleCallByLeadIdQuery(leadId);

  const { data } = useGetAllTeamsQuery("");
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
  const handleAdd = (values: ScheduleCall) => {
    const payload = {
      leadId,
      scheduledCallDateTime: values.dateTime,
      noteToCall: values.note,
      scheduledFor: values.selection,
      teamId: values.selection === "team" ? values.team : null,
      userId: values.selection === "user" ? values.user : null,
    };

    if (callScheduleDetails?._id) {
      handleUpdateScheduledCall({
        _id: callScheduleDetails?._id,
        scheduledCallId: callScheduleDetails?._id,
        ...payload,
      });
    } else {
      handleAddScheduleCall(payload);
    }
  };

  useEffect(() => {
    if (updateSuccess || isAdded) {
      enqueueSnackbar(`${isAdded ? "Added" : "Updated"} Successfully`, {
        variant: "success",
      });
    } else if (updateError || addError) {
      enqueueSnackbar(
        <Translations text="Update failed! Please try again!" />,
        { variant: "error" }
      );
    }
  }, [updateError, updateSuccess, addError, isAdded]);

  if (isFetching) {
    return <PageLoader />;
  }

  return (
    <Card sx={{ p: 5, mb: 4, mr: 4, width: { sm: "100%", lg: "70%" } }}>
      <Typography sx={{ mb: 1.5 }} variant="h6" color="text.primary">
        {t("Schedule Call")}
      </Typography>

      <Formik
        initialValues={{
          dateTime: callScheduleDetails?.scheduledCallDateTime || null,
          note: callScheduleDetails?.noteToCall || "",
          selection: callScheduleDetails?.scheduledFor || "team",
          team: callScheduleDetails?.teamId || "",
          user: callScheduleDetails?.userId || "",
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={(values) => {
          handleAdd(values);
        }}
      >
        {({
          errors,
          touched,
          setFieldValue,
          values,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
              <FormControl
                fullWidth
                error={touched.dateTime && Boolean(errors.dateTime)}
              >
                 <DateTimePicker
                  ampm={
                    clientTimeSetting?.defaultDateTimeFormat ===
                    defaultTimeFormat["12h"]
                  }
                  value={values?.dateTime ? dayjs(values.dateTime) : null}
                  onChange={(date) => setFieldValue("dateTime", date)}
                  format={
                    clientTimeSetting?.defaultDateTimeFormat ||
                    "DD.MM.YYYY hh.mm"
                  }
                  sx={{ mt: 4 }}
                  label={t("Date and Time")}
                  slotProps={{
                    textField: {
                      error: touched.dateTime && Boolean(errors.dateTime),
                      helperText:
                        touched.dateTime && (errors.dateTime as string),
                    },
                  }}
                />
              </FormControl>
            </DemoContainer>
            <TextField
              fullWidth
              sx={{ mt: 4, mb: 4 }}
              id="outlined-multiline-static"
              label={t("Note to Call")}
              multiline
              rows={4}
              name="note"
              value={values.note}
              onChange={handleChange}
            />
            {user?.roleName !== userTypes.USER || user.loginAsClient ? (
              <div>
                <Typography>{t("Schedule For")}</Typography>
                <ToggleButtonGroup
                  fullWidth
                  sx={{ padding: "20px 5px", color:"black"  }}
                  exclusive
                  // color="primary"
                  aria-label={t("team or user")}
                  value={values.selection}
                  onChange={(event, value) =>{value!==null && setFieldValue("selection", value)}}
                >
                  <ToggleButton
                    sx={{
                      borderTopLeftRadius: "25px",
                      borderBottomLeftRadius: "25px",
                     color:"black !important"
                    }}
                    value="team"
                  >
                    {values.selection === "team" && (
                      <Icon
                        style={{ marginRight: "0.2rem" }}
                        icon="mdi:check"
                      />
                    )}
                    {t("Team")}
                  </ToggleButton>
                  <ToggleButton
                    sx={{
                      borderTopRightRadius: "25px",
                      borderBottomRightRadius: "25px",
                      color:"black !important"
                    }}
                    value="user"
                  >
                    {values.selection === "user" && (
                      <Icon
                        style={{ marginRight: "0.2rem" }}
                        icon="mdi:check"
                      />
                    )}
                    {t("User")}
                  </ToggleButton>
                </ToggleButtonGroup>

                {values.selection === "team" ? (
                  <FormControl
                    fullWidth
                    error={touched.team && Boolean(errors.team)}
                  >
                    <InputLabel id="Select Team">{t("Select Team")}</InputLabel>
                    <Select
                      labelId="Select Team"
                      id="Select Team"
                      name="team"
                      value={values.team}
                      label={t("Select Team")}
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
                    <InputLabel id="Select User">{t("Select User")}</InputLabel>
                    <Select
                      labelId="Select User"
                      id="Select User"
                      name="user"
                      value={values.user}
                      label={t("Select User")}
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
              </div>
            ) : (
              ""
            )}

            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", mt: 6 }}>
              <Button
                sx={{ minWidth: "120px" }}
                variant="contained"
                disabled={isUpdating || isAdding}
                type="submit"
                size="medium"
              >
                {isUpdating || isAdding ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  "Schedule Call"
                )}
              </Button>
              <Button
                variant="outlined"
                size="medium"
                onClick={() => navigate(-1)}
              >
                {t("Cancel")}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default ScheduleForm;
