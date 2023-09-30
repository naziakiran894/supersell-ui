import { Ref, useState, forwardRef, ReactElement, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Dialog,
  Button,
  TextField,
  Typography,
  IconButton,
  DialogContent,
  DialogActions,
  Fade,
  FadeProps,
  CircularProgress,
} from "@mui/material";
import Icon from "../../../@core/components/icon";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  useAddCompanyMutation,
  useUpdateCompanyMutation,
  useGetCompanyDetailsByIdQuery,
} from "../../../store/services";
import { useSnackbar } from "notistack";
import AddCompanyForm from "./AddCompanyForm";
import PageLoader from "../../../@core/components/loader/PageLoader";
import Translations from "../../../@core/layouts/Translations";

export interface ICompanyData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  companyName: string;
  logo?: string;
  countryId: string;
}
const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

interface IAddCompanyProp {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  companyId?: string;
}

const addCompanySchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\+?[0-9]{10,13}$/, "Phone number is not valid")
    .required("Phone number is required"),
  companyName: Yup.string().min(2).max(25).required("Company name is required"),
  countryId: Yup.string().required("Country is required"),
});

const AddCompanyDialog = ({ setShow, show, companyId }: IAddCompanyProp) => {
  const [handleAddCompany, { isSuccess, isLoading, error }] =
    useAddCompanyMutation();

  const { data, isFetching } = useGetCompanyDetailsByIdQuery(
    companyId ? companyId : ""
  );

  //@ts-ignore
  const companyDetails = data?.data;

  const [
    handleUpdateCompany,
    { isSuccess: isUpdated, isLoading: isLoaded, error: updatedError },
  ] = useUpdateCompanyMutation();

  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmitForm(values: ICompanyData) {
    if (companyId) {
      handleUpdateCompany({
        _id: companyId,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
        companyName: values.companyName,
        countryId: values.countryId,
      });
    } else {
      handleAddCompany({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
        companyName: values.companyName,
        countryId: values.countryId,
      });
    }
  }

  useEffect(() => {
    if (isSuccess || isUpdated) {
      enqueueSnackbar(
        `Company ${isUpdated ? "Updated" : "Added"}  Successfully`,
        { variant: "success" }
      );
      setShow(false);
    } else if (error) {
      //@ts-ignore
      enqueueSnackbar(error.data.data.error, { variant: "error" });
    }
  }, [isSuccess, error, isUpdated, updatedError]);
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
                <Translations text={companyId ? "EDIT CLIENT" : "ADD CLIENT"} />
              </Typography>
            </Box>
            {isFetching && companyId ? (
              <PageLoader />
            ) : (
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  phone: "",
                  email: "",
                  companyName: "",
                  countryId: "",
                }}
                validationSchema={addCompanySchema}
                onSubmit={(values) => {
                  handleSubmitForm(values);
                }}
              >
                {(props) => {
                  const { handleSubmit } = props;

                  return (
                    <form onSubmit={handleSubmit}>
                      <AddCompanyForm
                        companyDetails={companyDetails}
                        props={props}
                      />
                      <DialogActions
                        sx={{
                          marginTop: 10,
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
                          disabled={isLoading}
                          sx={{ mr: 1 }}
                        >
                          {isLoading || isLoaded ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                            />
                          ) : companyId ? (
                            "Update"
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

export default AddCompanyDialog;
