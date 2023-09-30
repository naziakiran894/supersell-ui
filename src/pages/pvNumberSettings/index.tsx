import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import CallRecording from "./CallRecording";
import PageLoader from "../../@core/components/loader/PageLoader";
import { useTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import {
  useGetNumberSettingByIdQuery,
  useGetAllNumbersQuery,
  useGetAllTeamsQuery,
  useGetCompanyRoutingListQuery,
  useGetUsersListQuery,
  useGetUserRoutingQuery,
  useAddNumberSettingMutation,
} from "../../store/services";
import { useSnackbar } from "notistack";
import CallScreening from "./CallScreening";
import RoutingSetting from "./RoutingSetting";
import Translations from "../../@core/layouts/Translations";

export interface INumberSettingsFormData {
  twilioNumber: any;
  callRecording: any;
  callerId: any;
  routingType: any;
  teamId: any;
  userRouting: any;
  leadOwnerRoutingSetting: any;
  fallbackTeam: any;
  followUp: any;
}

const numberSettingSchema = Yup.object({
  twilioNumber: Yup.string().required("Number is required"),
  callerId: Yup.string().required(" CallerId  is required"),
  teamId: Yup.string().required("Team is required"),
  routingType: Yup.string().required("Routing type is required"),
  userId: Yup.string().required("User is required"),
  userRouting: Yup.string().required("User routing is required"),
  fallbackTeam: Yup.string().required("Fallback team  is required"),
  followUp: Yup.string().required("Follow up  is required"),
});

const NumberSettings = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { id: paramId } = useParams();

  const [selectedWelcomeSrc, setSelectedWelcomeSrc] = useState("");

  const { data: routeOptions, error, isLoading } = useGetUserRoutingQuery("");

  const { data: numberSetting, isLoading: isFetching } =
    useGetNumberSettingByIdQuery(paramId);

  const { data: list } = useGetAllNumbersQuery("");
  const { data: teamList } = useGetAllTeamsQuery("");

  const [handleNumberSetting, { isError, isSuccess, isLoading: updating }] =
    useAddNumberSettingMutation();

  const { data: userList } = useGetUsersListQuery("");

  //@ts-ignore
  const settings = numberSetting?.data;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = event.target.files?.[0];
    setSelectedWelcomeSrc(file);
    if (file) {
      const fileReader = new FileReader();

      // fileReader.onload = () => {
      //   setAudioSrc(fileReader.result as string);
      // };

      fileReader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(<Translations text="Update successful!" />, {
        variant: "success",
      });
    }
    if (isError) {
      enqueueSnackbar(<Translations text="Update error!" />, {
        variant: "error",
      });
    }
  }, [isError, isSuccess]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
  };
  return (
    <>
      <Box mb={10}>
        <Typography variant="h5">Purchased phone number settings</Typography>
        <Typography variant="h6" color="text.secondary">
          {settings?.twilioNumber?.numberName} :{settings?.twilioNumber?.number}
        </Typography>
      </Box>
      <Card sx={{ p: 5 }}>
        <Formik
          initialValues={{
            callRecording: settings?.twilioNumber?.callRecording || false,
            twilioNumber: settings?.twilioNumber?.numberName || "",
            callerId: settings?.twilioNumber?.callerId || "",
            teamId: settings?.twilioNumber?.teamId || "",
            routingType: settings?.twilioNumber?.routingType || "",
            userId: settings?.twilioNumber?.userId || "",
            userRouting: settings?.twilioNumber?.leadOwnerRoutingSetting || "",
            followUp: settings?.twilioNumber?.followUp || "",
            fallbackTeam: settings?.twilioNumber?.fallbackTeam || "",
          }}
          enableReinitialize
          validationSchema={numberSettingSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {(props) => {
            const { handleSubmit } = props;
            return (
              <>
                <form onSubmit={handleSubmit}>
                  {isFetching && paramId ? (
                    <PageLoader />
                  ) : (
                    <>
                      <CallRecording props={props} />
                      <CallScreening props={props} />
                      <RoutingSetting props={props} />
                      <Box display="flex" gap="20px" m={5}>
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={updating}
                          sx={{ mt: 5, width: "10rem" }}
                          // onClick={(e) => {
                          //   handleSubmit(e);
                          // }}
                        >
                          {updating ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                            />
                          ) : (
                            <Translations text="Save" />
                          )}
                        </Button>
                      </Box>
                    </>
                  )}
                </form>
              </>
            );
          }}
        </Formik>
      </Card>
    </>
  );
};

export default NumberSettings;
