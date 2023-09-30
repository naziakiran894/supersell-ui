import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Box, Typography, Card, Button, CircularProgress } from "@mui/material";
import PageLoader from "../../@core/components/loader/PageLoader";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetCompanyDetailsByIdQuery,
  useUpdateCompanyDetailsByIdMutation,
} from "../../store/services/index";

import ClientSettingFields from "./components/clientSettingsFields";
import ClientSettingRouting from "./components/clientSettingsRouting";
import { RootState } from "../../store";
import { ICompanyDetailsByID } from "../../store/types/company.types";
import { Field } from "../../store/types/fields.types";
import Translations from "../../@core/layouts/Translations";

const addClientSchema = Yup.object({
  clientName: Yup.string().required("Client Name is required"),
  date: Yup.string().required("Date & Time Format is required"),
  country: Yup.string().required("Default Country is required"),
  currency: Yup.string().required("Default Currency is required"),
  language: Yup.string().required("Default Language is required"),
  login: Yup.string().required("Login Status is required"),
  leadTitle: Yup.string().required("Lead title is required"),
  leadSubtitle: Yup.string().required("Lead subtitle is required"),
  detailsTitle: Yup.string().required("Details title is required"),
  detailsSubtitle: Yup.string().required("Details subtitle is required"),
  assignLeadOwner: Yup.string().required("Lead Owner is required"),
  retryLeads: Yup.boolean().required("Field is required"),
  hangupOnVoicemail: Yup.boolean().required("Field is required"),
  attemptRetry: Yup.boolean().required("Field is required"),
  callMarked: Yup.boolean().required("Field is required"),
});

export interface IFormData {
  clientName: string;
  timezone: string;
  date: any;
  country: string;
  currency: string;
  language: string;
  login: string;
  leadTitle: string;
  leadSubtitle: string;
  detailsTitle: string;
  detailsSubtitle: string;
  assignLeadOwner: string;
  retryLeads: boolean;
  hangupOnVoicemail: boolean;
  attemptRetry: boolean;
  callMarked: boolean;
  callMarkedTime: number;
}

interface ICompany {
  companyId: string;
  about: Field[];
  contact: Field[];
  customFields: Field[];
  details: Field[];
  offersAndDeals: Field[];
  hideEmptyLeadFields: boolean;
  __v?: number;
  __id?: string;
}

const ClientSettings = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [permissions, setPermission] = useState<any>([]);
  const [fields, setFields] = useState<Field[]>();

  const clientId = useSelector(
    (state: RootState) => state.auth.user?.companyId
  );
  const settings = useSelector((state: RootState) => state.fields.fields);

  const { data, isLoading: isFetching } =
    useGetCompanyDetailsByIdQuery(clientId);

  const [
    handleUpdateSettings,
    { error: updateError, isSuccess: updateSuccess, isLoading: isUpdating },
  ] = useUpdateCompanyDetailsByIdMutation();

  //@ts-ignore
  const clientDetails: ICompanyDetailsByID = data?.data;

  const mergeData = (settings: ICompany) => {
    const dropdownFields: Field[] = [];

    dropdownFields.push(...settings.about.filter((field) => field.visible));
    dropdownFields.push(...settings.contact.filter((field) => field.visible));
    dropdownFields.push(
      ...settings.customFields.filter((field) => field.visible)
    );
    dropdownFields.push(...settings.details.filter((field) => field.visible));
    setFields(dropdownFields);
  };

  const handleSubmitForm = (values: IFormData) => {
    const finalPermission = permissions?.map((option: any) => ({
      keyName: option.keyName,
      role:
        option.user && option.admin
          ? "both"
          : option.user
          ? "user"
          : option.admin
          ? "admin"
          : "none",
    }));

    const updateData: ICompanyDetailsByID = {
      attemptRetriesEarly: values.attemptRetry,
      callMarkedAsConversation: {
        active: values.callMarked,
        time: values.callMarkedTime,
      },
      companyName: clientDetails.companyName,
      defaultCountryId: {
        countryName: values.country,
        timezone: values.timezone,
      },
      defaultCurrency: values.currency,
      defaultDateTimeFormat: values.date,
      defaultLanguage: values.language,
      detailsSubTitle: values.detailsSubtitle,
      detailsTitle: values.detailsTitle,
      leadSubTitle: values.leadSubtitle,
      leadTitle: values.leadTitle,
      hangupOnVoicemail: values.hangupOnVoicemail,
      permissions: finalPermission,
      retryLeadsAfterVoicemail: values.retryLeads,
      routingSetting: values.assignLeadOwner,
      userLoginType: values.login,
      _id: clientId,
    };
    handleUpdateSettings(updateData);
  };

  useEffect(() => {
    if (settings) {
      mergeData(settings);
    }
  }, [settings]);

  useEffect(() => {
    if (updateSuccess) {
      enqueueSnackbar(<Translations text={"Updated Successfully"} />, {
        variant: "success",
      });
    } else if (updateError) {
      enqueueSnackbar(
        <Translations text={"Update failed! Please try again!"} />,
        { variant: "error" }
      );
    }
  }, [updateError, updateSuccess]);

  if (isFetching) {
    return <PageLoader />;
  }

  return (
    <>
      <Box my={5}>
        <Typography variant="h5">
          <Translations text="Client Settings" />{" "}
        </Typography>
        <Typography
          sx={{ fontWeight: "400", fontSize: "14px", color: "#3A3541" }}
        >
          {clientDetails?.companyName}
        </Typography>
      </Box>
      <Card sx={{ p: 5 }}>
        <Formik
          initialValues={{
            clientName: "",
            timezone: "",
            date: "",
            country: "",
            currency: "",
            language: "",
            login: "",
            leadTitle: "",
            leadSubtitle: "",
            detailsTitle: "",
            detailsSubtitle: "",
            assignLeadOwner: "",
            retryLeads: true,
            hangupOnVoicemail: true,
            attemptRetry: true,
            callMarked: true,
            callMarkedTime: 0,
          }}
          validationSchema={addClientSchema}
          onSubmit={(values: IFormData) => {
            handleSubmitForm(values);
          }}
        >
          {(props) => {
            const { handleSubmit } = props;
            return (
              <>
                {clientDetails && (
                  <form onSubmit={handleSubmit}>
                    <ClientSettingFields
                      clientDetails={clientDetails}
                      props={props}
                      dropdownFields={fields}
                    />
                    <ClientSettingRouting
                      props={props}
                      clientDetails={clientDetails}
                      permissions={permissions}
                      setPermission={setPermission}
                    />
                    <Box sx={{ display: "flex", gap: "10px", margin: "20px" }}>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ minWidth: "145px" }}
                      >
                        {isUpdating ? (
                          <CircularProgress size={20} sx={{ color: "white" }} />
                        ) : (
                          <Translations text="Save Changes" />
                        )}
                      </Button>
                      <Button onClick={() => navigate(-1)} variant="outlined">
                        <Translations text="Cancel" />
                      </Button>
                    </Box>
                  </form>
                )}
              </>
            );
          }}
        </Formik>
      </Card>
    </>
  );
};

export default ClientSettings;
