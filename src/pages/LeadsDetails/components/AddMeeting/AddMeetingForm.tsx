import { Ref, useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Typography,
  DialogActions,
  Card,
  CircularProgress,
} from "@mui/material";

import {
  useAddMeetingMutation,
  useGetMeetingSettingQuery,
  useUpdateMeetingMutation,
} from "../../../../store/services";
import PageLoader from "../../../../@core/components/loader/PageLoader";
import FormComponent from "./FormComponent";
import {
  IMeetingSettingRes,
  IMeetingSettingsApiData,
} from "../../../../store/types/meetingSettings.types";
import { Dayjs } from "dayjs";
import { ILead } from "../../../../store/types/lead.types";
import { useNavigate, useParams } from "react-router-dom";
import { IMeeting } from "../../../../store/types/meeting.types";
import { Translation, useTranslation } from "react-i18next";
import Translations from "../../../../@core/layouts/Translations";

export interface IAddMettings {
  meetingId: string;
  meetingDate: Dayjs | null;
  meetingParticipant: string;
  leadEmail: string;
  meetingDuration: number;
  leadId: string;
}

interface IProps {
  leadDetails: ILead;
  meetingDetails?: IMeeting | null;
  setShow?: React.Dispatch<React.SetStateAction<boolean>>;
}

const addMeetingSchema = Yup.object().shape({
  meetingId: Yup.string().required("Meeting  title is required"),
  meetingDate: Yup.date()
    .typeError("Please enter a valid date")
    .required("Date is required"),
  meetingParticipant: Yup.string().required("Meeting participant is required"),
  leadEmail: Yup.string().email().required("Lead email is required"),
  meetingDuration: Yup.number().required("Duration is required"),
  leadId: Yup.string(),
});

const AddMeetingForm = ({ leadDetails, meetingDetails, setShow }: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [meetingData, setMeetingData] =
    useState<IMeetingSettingsApiData | null>(null);

  const [initialValues, setInitialValues] = useState({
    meetingId: "",
    meetingDate: null,
    meetingParticipant: "",
    leadEmail: "",
    meetingDuration: 2,
    leadId: "",
  });

  const { t } = useTranslation();

  const {
    data,
    isLoading: isFetching,
    refetch,
  } = useGetMeetingSettingQuery("");

  //@ts-ignore
  const meetingSettings: IMeetingSettingRes = data?.data;
  const [handleAddMeeting, { isLoading, isSuccess, error }] =
    useAddMeetingMutation();
  const [
    handleUpdateMeeting,
    { isLoading: isUpdating, isSuccess: isUpdated, error: updateError },
  ] = useUpdateMeetingMutation();

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess || isUpdated) {
      setShow && setShow(false);
      enqueueSnackbar(
        `Meeting ${isUpdated ? "updated" : "added"} successfully`,
        { variant: "success" }
      );
    } else if (error || updateError) {
      enqueueSnackbar(<Translations text="Something went wrong!" />, {
        variant: "error",
      });
    }
  }, [isSuccess, error, isUpdated, updateError]);

  useEffect(() => {
    if (meetingData?.showExtraFields) {
      const updatedInitialValues = Object.entries(meetingData?.fields).reduce(
        (acc, [key, values]) => {
          values.forEach((e) => {
            //@ts-ignore
            acc[e.keyName] = "";
          });
          return acc;
        },
        { ...initialValues }
      );

      setInitialValues(updatedInitialValues);
    }
  }, [meetingData]);

  if (isFetching) {
    return <PageLoader />;
  }

  const submitHandler = (values: any) => {
    const payload: any = {
      leadId: values.leadId,
      meetingId: values.meetingId,
      meetingDate: values.meetingDate,
      meetingDuration: values.meetingDuration,
      meetingParticipant: values.meetingParticipant,
      leadEmail: values.leadEmail,
      extraFields: {},
    };

    for (const key in values) {
      if (values.hasOwnProperty(key) && !payload.hasOwnProperty(key)) {
        payload.extraFields[key] = values[key];
      }
    }

    if (meetingDetails?._id) {
      handleUpdateMeeting({ _id: meetingDetails?._id, ...payload });
    } else {
      handleAddMeeting(payload);
    }
  };

  return (
    <>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="h6" fontWeight={600} sx={{ m: 4 }}>
          {meetingDetails?._id ? (
            <Translations text={"EDIT MEETING"} />
          ) : (
            <Translations text={"ADD MEETING"} />
          )}
        </Typography>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={addMeetingSchema}
        onSubmit={(values: any) => {
          submitHandler(values);
        }}
      >
        {(props) => {
          const { handleSubmit } = props;
          return (
            <form onSubmit={handleSubmit}>
              <FormComponent
                //@ts-ignore
                props={props}
                leadDetails={leadDetails}
                meetingDetails={meetingDetails}
                meetingSettings={meetingSettings}
                meetingData={meetingData}
                setMeetingData={setMeetingData}
              />

              <DialogActions
                sx={{
                  mt: 20,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
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
                  type="submit"
                  disabled={isLoading || isUpdating}
                  sx={{ mr: 2, mt: 5, minWidth: "120px" }}
                >
                  {isLoading || isUpdating ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    <Translations text={"Save"} />
                  )}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mr: 2, mt: 5 }}
                  onClick={() => (setShow ? setShow(false) : navigate(-1))}
                >
                  {t("Cancel")}
                </Button>
              </DialogActions>
            </form>
          );
        }}
      </Formik>
    </>
  );
};

export default AddMeetingForm;
