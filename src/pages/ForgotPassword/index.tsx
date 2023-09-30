import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MuiCard, { CardProps } from "@mui/material/Card";
import Icon from "../../@core/components/icon/index";
import themeConfig from "../../configs/themeConfig";
import Footer from "../Footer";
import Logo from "../../@core/components/img/logo";
import { useForgotPasswordMutation } from "../../store/services";
import * as Yup from "yup";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import APP_ROUTES from "../../Routes/routes";
import BlankLayout from "../../@core/layouts/BlankLayout";
import Translations from "../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  display: "flex",
  fontSize: "0.875rem",
  alignItems: "center",
  textDecoration: "none",
  justifyContent: "center",
  color: theme.palette.primary.main,
}));

const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const theme = useTheme();
  const [handleForgotPassword, { error, isSuccess, isLoading }] =
    useForgotPasswordMutation();
  //@ts-ignore
  const errorStatus: string = error?.data?.data?.error;
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = new URLSearchParams(location.search);
  const language = searchParams.get("language");
  const { i18n, t } = useTranslation();

  async function handleSubmit(values: { email: string }) {
    const user = {
      email: values.email,
    };
    await handleForgotPassword(user);
  }
  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language === "fi" ? "fn" : "en");
    }
  }, [language]);

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(
        <Translations text="Email sent, Kindly check your email!" />,
        {
          variant: "success",
        }
      );
    } else if (errorStatus) {
      enqueueSnackbar(errorStatus, { variant: "error" });
    }
  }, [isSuccess, errorStatus]);

  return (
    <BlankLayout>
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
                <Translations text="Forgot Password?" /> 🔒
              </Typography>
              <Typography variant="body2">
                <Translations text="Enter your email and we&prime;ll send you instructions to reset your password" />
              </Typography>
            </Box>
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={LoginSchema}
              onSubmit={(values) => {
                handleSubmit(values);
              }}
            >
              {({ errors, touched, values, handleChange, handleSubmit }) => (
                <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <TextField
                    autoFocus
                    type="email"
                    label="Email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    onChange={handleChange}
                    value={values.email}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{ display: "flex", mb: 4 }}
                  />
                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{ mb: 5.25 }}
                  >
                    {isLoading ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      <Translations text="Send reset link" />
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
                        <Translations text="Back to login" />
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
    </BlankLayout>
  );
};

export default ForgotPassword;
