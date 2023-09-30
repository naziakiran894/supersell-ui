import { useState, useEffect, SetStateAction } from "react";
import { Box, Card, Button, CircularProgress, Grid } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import MeetingInfo from "./components/MeetingInfo";
import MeetingReminders from "./components/MeetingReminders";
import MeetingExtraInfo from "./components/MeetingExtraInfo";
import {
  useAddMeetingSettingMutation,
  useDeleteMeetingSettingMutation,
} from "../../store/services";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { IMeetingSettingsApiData } from "../../store/types/meetingSettings.types";
import { enqueueSnackbar } from "notistack";
import { Field } from "../../store/types/fields.types";
import WarningDialog from "../../@core/components/warningDialog/WarningDialog";
import Translations from "../../@core/layouts/Translations";
import { Translation, useTranslation } from "react-i18next";
import { nanoid } from "nanoid";

interface IFields {
  keyName: string;
  type: string;
  value: string;
}
interface IInformation {
  name: string;
  value: string;
}

export interface IMeetingReminder {
  values: string;
  beforeMeeting: string;
  sms: string;
  id: string
}

export interface IFieldItem {
  fieldName: string;
  fields: IFields[];
}

export interface IInformationItem {
  fieldName: string;
  fields: IInformation[];
}

export interface ISubtitle {
  value: string;
  visible: boolean;
}

interface IProps {
  meetingSettings: IMeetingSettingsApiData;
  setMeetings: React.Dispatch<React.SetStateAction<IMeetingSettingsApiData[]>>;
  meetings: IMeetingSettingsApiData[];
  currentIndex: number;
}

export interface IFormickValue {
  meetingTitle: string;
}

const meetingSettingSchema = Yup.object({
  meetingTitle: Yup.string().required("Meeting title  is required"),
});

const MeetingSettings = ({
  meetingSettings,
  meetings,
  setMeetings,
  currentIndex,
}: IProps) => {
  const intialValueMetting = [
    { values: "", beforeMeeting: "", sms: "", id: nanoid() },
  ];

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [subTitle, setSubTitle] = useState({
    value: "",
    visible: true,
  });
  const [tag, setTag] = useState({
    value: "",
    visible: true,
  });
  const [fields, setFields] = useState(intialValue);
  const [value, setValue] = useState("");
  const [askFields, setAskFields] = useState(false);

  const [extraInformation, setExtraInformation] = useState(intialValuesInfo);
  const [reminders, setReminders] =
    useState<IMeetingReminder[]>(intialValueMetting);
  const [dropDownFields, setDropDownFields] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [
    handleDeleteMeetingSettings,
    { isLoading: isDeleting, isSuccess: isDeleted, error },
  ] = useDeleteMeetingSettingMutation();

  const companyId = useSelector(
    (state: RootState) => state.auth.user?.companyId
  );

  const settings = useSelector((state: RootState) => state?.fields?.fields);

  const [handleAddMeetingsetting, { isLoading, isSuccess, error: errors }] =
    useAddMeetingSettingMutation();

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(<Translations text={"Meeting updated successfully."} />, {
        variant: "success",
      });
    } else if (errors) {
      enqueueSnackbar(<Translations text={"Something went wrong!"} />, {
        variant: "error",
      });
    }
  }, [isSuccess, errors]);

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
    if (isDeleted) {
      setShowDeleteDialog(false);
      enqueueSnackbar(<Translations text={"Meeting deleted successfully"} />, {
        variant: "success",
      });
    } else if (error) {
      enqueueSnackbar(<Translations text={"Something went wrong!"} />, {
        variant: "error",
      });
    }
  }, [isDeleted, error]);

  useEffect(() => {
    if ("meetingBasicInfo" in meetingSettings) {
      const objectKeys = Object.keys(meetingSettings.fields);
      setSubTitle(meetingSettings?.meetingBasicInfo?.meetingSubTitle);
      setTag(meetingSettings?.meetingBasicInfo?.automaticTag);
      setReminders(meetingSettings?.meetingReminders);
      setAskFields(meetingSettings?.showExtraFields);
      setFields({
        fieldName: objectKeys[0],
        fields: meetingSettings?.fields[objectKeys[0]],
      });
      setExtraInformation({
        fieldName: objectKeys[1],
        fields: meetingSettings?.fields[objectKeys[1]],
      });
    }
  }, [meetingSettings]);

  const handleSaveChanges = async (values: IFormickValue) => {
    if (companyId) {
      handleAddMeetingsetting({
        meetingId: meetingSettings._id ? meetingSettings._id : "",
        companyId,
        meetingBasicInfo: {
          meetingTitle: values.meetingTitle,
          meetingSubTitle: subTitle,
          automaticTag: tag,
        },
        showExtraFields: askFields,
        fields: {
          [fields.fieldName]: fields.fields,
          [extraInformation.fieldName]: extraInformation.fields,
        },
        meetingReminders: reminders,
      });
    }
  };

  const handleDeleteMeeting = () => {
    if (meetingSettings._id) {
      handleDeleteMeetingSettings(meetingSettings._id);
    } else {
      const newArray = JSON.parse(JSON.stringify(meetings));
      newArray.splice(currentIndex, 1);
      setMeetings(newArray);
    }
  };

  return (
    <>
      <Card sx={{ p: 5 }}>
        <Grid
          item
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            my: "20px",
          }}
        >
          <Button onClick={() => setShowDeleteDialog(true)} variant="contained">
            <Translations text="DELETE MEETING" />
          </Button>
        </Grid>
        <Formik
          initialValues={{
            meetingTitle: meetingSettings?.meetingBasicInfo?.meetingTitle || "",
          }}
          enableReinitialize
          validationSchema={meetingSettingSchema}
          onSubmit={(values) => {
            handleSaveChanges(values);
          }}
        >
          {(props) => {
            const { handleSubmit } = props;
            return (
              <>
                <form onSubmit={handleSubmit}>
                  <MeetingInfo
                    setAskFields={setAskFields}
                    askFields={askFields}
                    subTitle={subTitle}
                    setSubTitle={setSubTitle}
                    setFields={setFields}
                    fields={fields}
                    tag={tag}
                    setTag={setTag}
                    value={value}
                    setValue={setValue}
                    dropdownFields={dropDownFields}
                    props={props}
                  />

                  {askFields && (
                    <MeetingExtraInfo
                      dropdownFields={dropDownFields}
                      setExtraInformation={setExtraInformation}
                      extraInformation={extraInformation}
                    />
                  )}

                  <MeetingReminders
                    dropdownFields={dropDownFields}
                    setReminders={setReminders}
                    reminders={reminders}
                  />
                  <Box display="flex" flexWrap="wrap" gap="10px" m={10}>
                    <Button
                      disabled={isLoading}
                      variant="contained"
                      type="submit"
                      sx={{ minWidth: "145px" }}
                    >
                      {isLoading ? (
                        <CircularProgress size={20} sx={{ color: "white" }} />
                      ) : (
                        <Translations text="Save Changes" />
                      )}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                      <Translations text="Cancel" />
                    </Button>
                  </Box>
                </form>
              </>
            );
          }}
        </Formik>

        <WarningDialog
          isLoading={isDeleting}
          setShow={setShowDeleteDialog}
          show={showDeleteDialog}
          content={t("Are you sure you want to delete this meeting?")}
          onConfirm={handleDeleteMeeting}
        />
      </Card>
    </>
  );
};

export default MeetingSettings;

const intialValue = {
  fieldName: "Location",
  fields: [
    {
      keyName: "",
      type: "",
      value: "",
    },
  ],
};

const intialValuesInfo = {
  fieldName: "EXTRA INFORMATION",
  fields: [
    {
      keyName: "",
      type: "",
      value: "",
    },
  ],
};
