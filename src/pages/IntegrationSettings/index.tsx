import { useEffect, useState } from "react";
import { Typography, Box, Card, Button, CircularProgress } from "@mui/material";
import FieldMappingList from "./components/FieldMappingList";
import RoutingRules from "./components/RoutingRules";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  useAddIntegrationSettingMutation,
  useDeleteIntegrationMutation,
  useGetIntegrationByIdQuery,
} from "../../store/services";
import * as Yup from "yup";

import { Formik } from "formik";

import { Field } from "../../store/types/fields.types";
import { enqueueSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import WarningDialog from "../../@core/components/warningDialog/WarningDialog";
import APP_ROUTES from "../../Routes/routes";
import Translations from "../../@core/layouts/Translations";
import { nanoid } from "nanoid";

export interface IRoutingRule {
  ruleId: string;
  fieldType: string;
  condition: string;
  fieldValue1: string;
  fieldValue2: string;
  routeToTeam: string;
  leadOwner: string;
}

let initialValue = {
  ruleId: nanoid(),
  fieldType: "",
  condition: "",
  fieldValue1: "",
  fieldValue2: "",
  routeToTeam: "",
  leadOwner: "",
};

const index = () => {
  const navigate = useNavigate();
  const { integrationId } = useParams();
  const [showDialog, setShowDialog] = useState(false);
  const [routingRules, setRoutingRules] = useState([[initialValue]]);
  const [dropDownFields, setDropDownFields] = useState([]);
  const [copySuccess, setCopySuccess] = useState("");
  const [integrationName, setIntegrationName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  //team noRuleMatchTeam
  const fields = useSelector((state: RootState) => state.fields.fields);
  const settings = useSelector((state: RootState) => state?.fields?.fields);
  const clientId = useSelector(
    (state: RootState) => state.auth.user?.companyId
  );
  const currentUser = useSelector(
    (state: RootState) => state.currentUser.currentUser
  );

  const [handleAddIntegrationSetting, { isSuccess, isLoading, error }] =
    useAddIntegrationSettingMutation();

  const [
    handleDeleteIntegration,
    { isLoading: isDeleting, isSuccess: isDeleted },
  ] = useDeleteIntegrationMutation();

  const { data, isFetching: waiting } =
    useGetIntegrationByIdQuery(integrationId);

  //@ts-ignore
  const integrationData = data?.data;

  const initalValue = dropDownFields?.reduce((acc, field: Field) => {
    return {
      ...acc,
      [field.keyName]: field.keyName,
    };
  }, {});

  useEffect(() => {
    if (integrationData) {
      setRoutingRules(integrationData?.routingRules);
      setCopySuccess(integrationData?.webhookUrl);
    }
  }, [integrationData]);

  useEffect(() => {
    const array: any = [];
    if (settings) {
      Object.entries(settings)?.map(([key, value]) => {
        if (
          typeof value === "object" &&
          value !== null &&
          key !== "offersAndDeals"
        ) {
          //@ts-ignore
          array.push(...value);
        }
      });
      setDropDownFields(array);
    }
  }, [settings]);

  const schema = Yup.object().shape({
    ...dropDownFields?.reduce((acc, field: Field) => {
      return {
        ...acc,
        [field.keyName]: Yup.string().required(`${field?.value} is required`),
      };
    }, {}),
    integrationName: Yup.string().required("Integration name is required"),
    noRulesMatchToTeam: Yup.string().required("Team is required"),
  });

  const sentData = (values: any) => {
    const payload = {
      integrationId: integrationId,
      integrationName: values.integrationName,
      routingRules: routingRules,
      companyId: clientId,
      fields: dropDownFields?.reduce((acc, field: Field) => {
        return {
          ...acc,
          [field.keyName]: values[field.keyName],
        };
      }, {}),
      defaultSettings: {
        routeToTeam: values.noRulesMatchToTeam,
        leadOwner: values.noRulesMatchToLead,
      },
    };
    handleAddIntegrationSetting(payload);
  };

  useEffect(() => {
    if (isDeleted) {
      enqueueSnackbar("Integration deleted successful.", {
        variant: "success",
      });
      setShowDialog(false);
      navigate(`${APP_ROUTES.integrations}`);
    }
    if (isSuccess) {
      enqueueSnackbar("Integration added successfully", { variant: "success" });
      navigate(`${APP_ROUTES.integrations}`);
    } else if (error) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  }, [isSuccess, error, isDeleted]);

  return (
    <>
      {waiting ? (
        <Box
          sx={{
            mt: 6,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <CircularProgress sx={{ mb: 4 }} />
          <Typography>
            <Translations text={"Loading"} />
            ...
          </Typography>
        </Box>
      ) : (
        <>
          <Box my={5}>
            <Typography variant="h5">
              <Translations text={"Integration fields mapping"} />
            </Typography>
            <Typography
              sx={{ fontWeight: "400", fontSize: "14px", color: "#3A3541" }}
            >
              {/* @ts-ignore */}
              {currentUser?.companyId?.companyName}
            </Typography>
          </Box>
          <Card>
            <Formik
              validationSchema={schema}
              initialValues={{
                ...(integrationId ? integrationData?.fields : initalValue),
                integrationName: integrationData?.integrationName || "",
                noRulesMatchToTeam:
                  integrationData?.defaultSettings?.routeToTeam || "",
                noRulesMatchToLead:
                  integrationData?.defaultSettings?.leadOwner || "",
              }}
              onSubmit={(values) => {
                sentData(values);
              }}
              enableReinitialize
            >
              {(props) => {
                const { handleSubmit, errors } = props;

                return (
                  <form onSubmit={handleSubmit}>
                    <FieldMappingList
                      formik={props}
                      integrationName={integrationName}
                      setIntegrationName={setIntegrationName}
                      fields={fields}
                      setCopySuccess={setCopySuccess}
                      copySuccess={copySuccess}
                    />
                    <RoutingRules
                      formik={props}
                      routingRules={routingRules}
                      setRoutingRules={setRoutingRules}
                      dropdownFields={dropDownFields}
                      isSubmitting={isSubmitting}
                    />
                    <Box sx={{ display: "flex", gap: "10px", margin: "40px" }}>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ minWidth: "150px" }}
                        onClick={() => setIsSubmitting(true)}
                      >
                        {isLoading ? (
                          <CircularProgress size={20} sx={{ color: "white" }} />
                        ) : (
                          <Translations text={"Save Changes"} />
                        )}
                      </Button>
                      <Button
                        onClick={() => navigate(-1)}
                        variant="outlined"
                        color="secondary"
                      >
                        <Translations text={"Cancel"} />
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          setShowDialog(true);
                        }}
                      >
                        <Translations text={"DELETE INTEGRATION"} />
                      </Button>
                    </Box>
                  </form>
                );
              }}
            </Formik>

            {showDialog && (
              <WarningDialog
                content="Are you sure you want to delete current integration?"
                isLoading={isDeleting}
                setShow={setShowDialog}
                onConfirm={() => {
                  if (integrationId) {
                    handleDeleteIntegration(integrationId);
                  }
                }}
                show={showDialog}
              />
            )}
          </Card>
        </>
      )}
    </>
  );
};

export default index;
