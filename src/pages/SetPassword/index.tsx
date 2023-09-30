import { ReactNode, useCallback, useEffect } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  CardContent,
  CircularProgress,
} from "@mui/material";
import PasswordInput from "../../@core/components/PasswordInput/PasswordInput";

import Logo from "../../@core/components/img/logo";
import { styled, useTheme } from "@mui/material/styles";
import MuiCard, { CardProps } from "@mui/material/Card";
import Icon from "../../@core/components/icon/index";
import themeConfig from "../../configs/themeConfig";
import BlankLayout from "../../@core/layouts/BlankLayout";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import { useSetPasswordMutation } from "../../store/services";
import APP_ROUTES from "../../Routes/routes";
import { useSnackbar } from "notistack";
import Translations from "../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";

interface IFormValues {
  password: string;
  confirmPassword: string;
}
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  justifyContent: "center",
  color: theme.palette.primary.main,
}));

const validatePasswordSchema = Yup.object({
  password: Yup.string()
    .required("Please enter your password.")
    .min(8, "Your password is too short."),
  confirmPassword: Yup.string()
    .required("Please retype your password.")
    .oneOf([Yup.ref("password")], "Your passwords do not match."),
});

const SetPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const language = searchParams.get("language");
  const { i18n, t } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const [handleSetPassword, { error, isSuccess, isLoading }] =
    useSetPasswordMutation();

  const urlParams = new URLSearchParams(window.location.search);
  const otp = urlParams.get("otp");
  const fp = urlParams.get("fp");

  //@ts-ignore
  const Error: string = error?.data?.data?.error;

  const handleUpdatePassword = useCallback(async (values: IFormValues) => {
    const data = {
      password: values.password,
      confirmPassword: values.confirmPassword,
      otp: otp,
      fp: fp || 'y',
    };
    await handleSetPassword(data);

  }, [otp, fp])

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language === "fi" ? "fn" : "en");
    }
  }, [language]);

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(<Translations text="Password Updated Successfully" />, {
        variant: "success",
      });
      setTimeout(() => {
        navigate(APP_ROUTES.account);
      }, 100);
    } else if (Error) {
      enqueueSnackbar(Error, { variant: "error" });
    }
  }, [isSuccess, Error]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(5),
      }}
    >
      <Card sx={{ zIndex: 1 }}>
        <CardContent
          sx={{ p: (theme) => `${theme.spacing(12, 9, 7)} !important` }}
        >
          <Box
            sx={{
              mb: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Logo />
            <Typography
              variant="h6"
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: "uppercase",
                fontSize: "1.5rem !important",
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
              <Translations text="Set Password" />
              🔒
            </Typography>
            <Typography variant="body2">
              <Translations text="Your new password must be different from previously used passwords" />
            </Typography>
          </Box>
          <Formik
            initialValues={{
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validatePasswordSchema}
            onSubmit={(values) => {
              handleUpdatePassword(values);
            }}
          >
            {({ errors, touched, values, handleChange, handleSubmit }) => (
              <form autoComplete="off" onSubmit={handleSubmit}>
                <PasswordInput
                  label={t("New Password")}
                  name="password"
                  autoFocus
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                <PasswordInput
                  label={t("Confirm Password")}
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  error={
                    touched.confirmPassword && Boolean(errors.confirmPassword)
                  }
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />

                <Button
                  disabled={isLoading}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{ mb: 5.25 }}
                >
                  {isLoading ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    <Translations text="Set New Password" />
                  )}
                </Button>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LinkStyled to={APP_ROUTES.login}>
                    <Icon icon="mdi:chevron-left" />
                    <span>
                      <Translations text="Back to Login" />
                    </span>
                  </LinkStyled>
                </Typography>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
      <Footer />
    </Box>
  );
};

SetPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default SetPassword;
