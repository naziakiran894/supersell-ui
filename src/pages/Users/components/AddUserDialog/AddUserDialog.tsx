import { Ref, forwardRef, ReactElement } from "react";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Dialog,
  Typography,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import Fade, { FadeProps } from "@mui/material/Fade";

import Icon from "../../../../@core/components/icon";
import {
  useAddUserMutation,
  useGetUserDetailByIdQuery,
  useUpdateUserMutation,
} from "../../../../store/services";

import AddUserForm from "../AddUserForm/AddUserForm";
import { RootState } from "../../../../store";
import { userTypes } from "../../../../store/types/globalTypes";
import PageLoader from "../../../../@core/components/loader/PageLoader";
import Translations from "../../../../@core/layouts/Translations";

export interface IUserData {
  email: string;
  firstName: string;
  language: string;
  phone: string | number;
  lastName: string;
  timeZone: string;
  countryName: string;
  userRoles: string;
  roleName: string;
  role: string;
  notifyVia?: "none" | "sms" | "email" | "both";
  companyId: string;
  sendWelcomeEmail: boolean;
  doNotDisturbStatus: boolean;
  emailNotification: boolean;
  smsNotification: boolean;
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

interface IAddUserProp {
  show: boolean;
  setShow: any;
  userId?: string;
}

const AddUserInfo = ({ setShow, show, userId }: IAddUserProp) => {
  const [handleAddUser, { isSuccess, isLoading, error }] = useAddUserMutation();

  const [
    handleUpdateUser,
    { isSuccess: isUpdated, isLoading: isLoaded, error: updatedError },
  ] = useUpdateUserMutation();

  const { data, isLoading: isFetching } = useGetUserDetailByIdQuery(
    userId ? userId : ""
  );
  const user = useSelector((state: RootState) => state.auth.user);

  //@ts-ignore
  const userDetails = data?.data;
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isSuccess || isUpdated) {
      setShow(false);
      enqueueSnackbar(
        isUpdated ? (
          <Translations text="User Updated Successfully" />
        ) : (
          <Translations text="User Added Successfully" />
        ),
        { variant: "success" }
      );
      //@ts-ignore
    } else if (error?.data?.data) {
      //@ts-ignore
      enqueueSnackbar(error?.data.data.error, { variant: "error" });
    }
  }, [isSuccess || isUpdated, error || updatedError]);

  const schema = Yup.object().shape({
    firstName: Yup.string().min(2).max(25).required("First Name is required"),

    email: userId
      ? Yup.string()
      : Yup.string()
          .email("Please enter a valid email")
          .required("Email is required"),

    phone: Yup.string()
      .matches(/^\+?[0-9]{10,13}$/, "Phone number is not valid")
      .required("Phone number is required"),
    timeZone:
      userDetails?.roleId?.roleName === userTypes.SUPER_ADMIN
        ? Yup.string()
        : Yup.string().required("Time zone is required"),
    language:
      userDetails?.roleId?.roleName === userTypes.SUPER_ADMIN
        ? Yup.string()
        : Yup.string().required("Language  is required"),
    userRoles:
      userDetails?.roleId?.roleName === userTypes.SUPER_ADMIN
        ? Yup.string()
        : Yup.string().required("User role is required"),
    companyId:
      userDetails?.roleId?.roleName === userTypes.SUPER_ADMIN
        ? Yup.string()
        : user?.roleName === userTypes.SUPER_ADMIN
        ? Yup.string().required("Company is required")
        : Yup.string(),
  });

  async function handleSubmitForm(values: IUserData) {
    let notify = "none";
    if (values.smsNotification && values.emailNotification) {
      notify = "both";
    } else if (values.smsNotification) {
      notify = "sms";
    } else if (values.emailNotification) {
      notify = "email";
    }
    const user = {
      firstName: values.firstName,
      lastName: values.lastName,
      language: values.language,
      email: values.email,
      phone: values.phone,
      timezone: values.timeZone,
      countryName: values.countryName,
      roleId: values.userRoles,
      notifyVia: notify,
      companyId: values.companyId,
      doNotDisturbStatus: values.doNotDisturbStatus,
      sendWelcomeEmail: values.sendWelcomeEmail,
    };
    if (userId) {
      await handleUpdateUser({ _id: userId, ...user });
    } else {
      await handleAddUser(user);
    }
  }

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
              <Translations
                text={userDetails?._id ? "EDIT USER" : "ADD USER"}
              />
            </Typography>
          </Box>
          {isFetching && userId ? (
            <PageLoader />
          ) : (
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                language: "",
                phone: "",
                timeZone: "",
                countryName: "",
                userRoles: "",
                roleName: "",
                role: "",
                companyId: "",
                sendWelcomeEmail: true,
                companyName: "",
                smsNotification: false,
                doNotDisturbStatus: false,
                emailNotification: true,
              }}
              validationSchema={schema}
              onSubmit={(values: IUserData) => {
                handleSubmitForm(values);
              }}
            >
              {(props) => {
                const { handleSubmit, errors } = props;
                return (
                  <form onSubmit={handleSubmit}>
                    <AddUserForm
                      userDetails={userDetails || null}
                      props={props}
                    />

                    <DialogActions
                      sx={{
                        justifyContent: "center",
                        px: (theme) => [
                          `${theme.spacing(5)} !important`,
                          `${theme.spacing(15)} !important`,
                        ],
                        pb: (theme) => [
                          `${theme.spacing(8)} !important`,
                          `${theme.spacing(0.2)} !important`,
                        ],
                      }}
                    >
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                        sx={{ mr: 2, mt: 20 }}
                      >
                        {isLoading || isLoaded ? (
                          <CircularProgress size={20} sx={{ color: "white" }} />
                        ) : userDetails?._id ? (
                          <Translations text="Update" />
                        ) : (
                          <Translations text="Save" />
                        )}
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setShow(false)}
                        sx={{ mt: 20 }}
                      >
                        <Translations text="Cancel" />
                      </Button>
                    </DialogActions>
                  </form>
                );
              }}
            </Formik>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddUserInfo;
