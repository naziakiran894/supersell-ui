import { useState, useEffect } from "react";

import { Link, useLocation } from "react-router-dom";
import Logo from "../../../@core/components/img/logo";

import {
  Box,
  Button,
  Divider,
  CardContent,
  FormControl,
  OutlinedInput,
  Checkbox,
  TextField,
  InputLabel,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  FormHelperText,
} from "@mui/material";

import { styled, useTheme } from "@mui/material/styles";
import MuiCard, { CardProps } from "@mui/material/Card";

import MuiFormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";
import * as Yup from "yup";
import { Formik } from "formik";
import Icon from "../../../@core/components/icon/index";
import themeConfig from "../../../configs/themeConfig";
import Footer from "../../Footer";
import { RootState } from "../../../store/index";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MicrosoftLogo from "../../../@core/components/img/microsoft";
import {
  useUserLoginMutation,
  useGoogleLoginMutation,
} from "../../../store/services";
import { useSnackbar } from "notistack";
import APP_ROUTES from "../../../Routes/routes";
import BlankLayout from "../../../@core/layouts/BlankLayout";
import { userTypes } from "../../../store/types/globalTypes";
import Translations from "../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";

interface State {
  password: string;
  showPassword: boolean;
}

interface FormValues {
  email: string;
  password: string;
}

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: "0.875rem",
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(
  ({ theme }) => ({
    "& .MuiFormControlLabel-label": {
      fontSize: "0.875rem",
      color: theme.palette.text.secondary,
    },
  })
);

const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const LoginComponent = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const language = searchParams.get("language");
  const { i18n, t } = useTranslation();

  const [showPassword, setPassword] = useState<boolean>(false);
  const [handleUserLogin, { error, isLoading, isSuccess }] =
    useUserLoginMutation();

  const [handleGoogleLogin, { isError }] = useGoogleLoginMutation();
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const theme = useTheme();

  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  //@ts-ignore
  const loginError: string = error?.data?.data?.error;
  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(values: FormValues) {
    const user = {
      email: values.email,
      password: values.password,
    };

    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }
    await handleUserLogin(user);
  }

  useEffect(() => {
    if (user?.id) {
      if (user?.roleName !== userTypes.SUPER_ADMIN) {
        navigate(APP_ROUTES.leads);
      } else {
        navigate(APP_ROUTES.clients);
      }
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess && !loginError) {
      enqueueSnackbar(<Translations text="Login successful!" />, {
        variant: "success",
      });
      enqueueSnackbar("Login successful!", { variant: "success" });

      if (user?.roleName !== userTypes.SUPER_ADMIN) {
        navigate(APP_ROUTES.leads);
      } else {
        navigate(APP_ROUTES.clients);
      }
    } else if (loginError) {
      enqueueSnackbar(loginError, { variant: "error" });
    }
  }, [isSuccess, loginError]);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language === "fi" ? "fn" : "en");
    }
  }, [language]);

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
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, mb: 1.5, textAlign: "center" }}
              >
                <Translations text="Welcome to" /> {themeConfig.templateName}!
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "center" }}>
                <Translations text="Please sign-in to your account" />
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 2,
                borderTop: "1px solid lightgrey",
                borderBottom: "1px solid lightgrey",
                width: "100%",
                cursor: "pointer",
              }}
            >
              <IconButton
                component={Box}
                onClick={(e: any) => e.preventDefault()}
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "light" ? "#272727" : "grey.300",
                }}
              >
                <Icon icon="mdi:microsoft-office" color="red" />
              </IconButton>{" "}
              {/* // <MicrosoftLogo /> */}
              <b>Microsoft</b>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 2,
                borderTop: "1px solid lightgrey",
                borderBottom: "1px solid lightgrey",
                width: "100%",
                cursor: "pointer",
              }}
              onClick={() => {
                handleGoogleLogin("");
              }}
            >
              <IconButton component={Box} sx={{ color: "#db4437" }}>
                <Icon icon="mdi:google" />
              </IconButton>
              <b>Google</b>
            </Box>

            <Divider sx={{ my: (theme) => `${theme.spacing(5)} !important` }}>
              <Translations text="or" />
            </Divider>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={LoginSchema}
              onSubmit={(values) => {
                handleSubmit(values);
              }}
            >
              {({ errors, touched, values, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <TextField
                    autoFocus
                    fullWidth
                    id="email"
                    label={t("Email")}
                    sx={{ mb: 4 }}
                    name="email"
                    autoComplete="email"
                    onChange={handleChange}
                    value={values.email}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <FormControl
                    error={touched.password && Boolean(errors.password)}
                    fullWidth
                  >
                    <InputLabel htmlFor="password">
                      <Translations text="Password" />
                    </InputLabel>
                    <OutlinedInput
                      label={t("Password")}
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      id="password"
                      name="password"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={(e) => {
                              e.preventDefault();
                              setPassword(!showPassword);
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                            aria-label="toggle password visibility"
                          >
                            <Icon
                              icon={
                                showPassword
                                  ? "mdi:eye-outline"
                                  : "mdi:eye-off-outline"
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <FormHelperText>
                      {touched.password && errors.password}
                    </FormHelperText>
                  </FormControl>
                  <Box
                    sx={{
                      mb: 4,
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={() => {
                            setRememberMe(!rememberMe);
                          }}
                        />
                      }
                      label={t("Remember Me")}
                    />
                    <LinkStyled to={APP_ROUTES.forgetPassword}>
                      <Translations text="Forgot Password?" />
                    </LinkStyled>
                  </Box>
                  <Button
                    disabled={isLoading}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{ mb: 7 }}
                  >
                    {isLoading ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      <Translations text="Login" />
                    )}
                  </Button>
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

export default LoginComponent;
