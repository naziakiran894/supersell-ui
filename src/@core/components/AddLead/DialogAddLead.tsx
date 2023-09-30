import { Ref, forwardRef, ReactElement, useEffect, useState } from "react";
import {
  Box,
  Card,
  CircularProgress,
  Dialog,
  Button,
  Typography,
  IconButton,
  DialogContent,
  DialogActions,
  Fade,
  FadeProps,
} from "@mui/material";
import Icon from "../icon/index";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import {
  useAddLeadMutation,
  useGetLeadDetailsByIdQuery,
  useUpdateLeadMutation,
} from "../../../store/services";
import { useSnackbar } from "notistack";
import AddLeadForm from "./AddLeadForm";
import { ILead } from "../../../store/types/lead.types";
import { RootState } from "../../../store";
import { Field, IField } from "../../../store/types/fields.types";
import PageLoader from "../loader/PageLoader";
import { useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";

export interface ILeadData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  zipCode: number | null;
  city: string;
}
const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = Yup.object().shape({
  teamId: Yup.string().required("Team is required"),
  // leadOwnerId:Yup.string().required("Lead owner is required"),
  // phone: Yup.string()
  //   .matches(/^\+?[0-9]{10,13}$/, "Phone number is not valid")
  //   .required("Phone number is required"),
});
interface IAddLeadProp {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  leadId?: string;
  title?: string;
}
const DialogAddLead = ({ setShow, show, leadId, title }: IAddLeadProp) => {
  const { enqueueSnackbar } = useSnackbar();
  const [fields, setFields] = useState([]);
  const clientId = useSelector(
    (state: RootState) => state.auth.user?.companyId
  );

  const { t } = useTranslation();

  const fieldSettings = useSelector(
    (state: RootState) => state?.fields?.fields
  );

  //@ts-ignore
  const clientTimeSetting: ICompanyDetailsByID = useSelector(
    (state: RootState) => state.clientSetting.ClientSetting
  );

  const [handleAddLead, { isSuccess, isLoading, error }] = useAddLeadMutation();
  const [
    handleUpdateLead,
    { isSuccess: isUpdated, isLoading: isUpdating, error: updatedError },
  ] = useUpdateLeadMutation();

  const { data, isLoading: isFetching } = useGetLeadDetailsByIdQuery(leadId);
  const [teamName, setTeamName] = useState("");

  //@ts-ignore
  const leadDetails: ILead = data?.data[0];

  const handleAdd = (values: any) => {
    const leadExtraFields = fieldSettings?.customFields?.map((e) => {
      return { [e?.keyName]: values[e?.keyName] };
    });

    if (leadId) {
      handleUpdateLead({
        _id: leadId,
        leadOwnerId: values.leadOwnerId || '',
        ...values,
        leadExtraFields,
      });
    } else {
      handleAddLead({ ...values, companyId: clientId, leadExtraFields });
    }
  };

  const initialValues = fields?.reduce((acc, field: Field) => {
    return {
      ...acc,
      [field.keyName]: "",
    };
  }, {});

  useEffect(() => {
    const array: any = [];
    if (fieldSettings) {
      Object.entries(fieldSettings)?.map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          //@ts-ignore
          array.push(...value);
        }
      });
      setFields(array?.filter((field: any) => field.visible));
    }
  }, [fieldSettings, title]);

  useEffect(() => {
    if (isSuccess || isUpdated) {
      setShow(false);
      enqueueSnackbar(
        isUpdated ? (
          <Translations text="Lead Updated Successfully" />
        ) : (
          <Translations text="Lead Added Successfully" />
        ),
        { variant: "success" }
      );
    }
    //@ts-ignore
    else if (error?.data?.data) {
      //@ts-ignore
      enqueueSnackbar(error?.data.data.error, { variant: "error" });
    }
  }, [isSuccess, isUpdated, error, updatedError]);

  return (
    <Box>
      <Card>
        <Dialog
          fullWidth
          open={show}
          maxWidth="md"
          scroll="body"
          onClose={() => setShow(false)}
          TransitionComponent={Transition}
          onBackdropClick={() => setShow(false)}
        >
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
              sx={{ position: "absolute", right: "1rem", top: "1rem" }}
            >
              <Icon icon="mdi:close" />
            </IconButton>
            <Box sx={{ mb: 8, textAlign: "center" }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                {leadDetails?._id ? (
                  <Translations text="EDIT LEAD" />
                ) : (
                  <Translations text="ADD LEAD" />
                )}
              </Typography>
            </Box>

            {isFetching ? (
              <PageLoader />
            ) : (
              <Formik
                initialValues={{
                  ...initialValues,
                  leadOwnerId: "",
                  teamId: "",
                }}
                validationSchema={schema}
                onSubmit={(values) => {
                  handleAdd(values);
                }}
              >
                {(props) => {
                  const { handleSubmit } = props;
                  return (
                    <form onSubmit={handleSubmit}>
                      <AddLeadForm
                        leadDetails={leadDetails || null}
                        //@ts-ignore
                        props={props}
                        title={title}
                        fields={fields}
                        fieldSettings={fieldSettings}
                        teamName={teamName}
                        setTeamName={setTeamName}
                      />
                      <DialogActions
                        sx={{
                          marginTop: "10vh",
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
                          type="submit"
                          disabled={isLoading || isUpdating}
                          sx={{ mr: 2, mt: 5, minWidth: "120px" }}
                        >
                          {isUpdating || isLoading ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                            />
                          ) : leadDetails?._id ? (
                            <Translations text="Update" />
                          ) : (
                            <Translations text="Save" />
                          )}
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          sx={{ mr: 2, mt: 5 }}
                          onClick={() => setShow(false)}
                        >
                          {t("Cancel")}
                        </Button>
                      </DialogActions>
                    </form>
                  );
                }}
              </Formik>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </Box>
  );
};

export default DialogAddLead;
