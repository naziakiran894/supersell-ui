import { ReactNode } from "react";

import { Link } from "react-router-dom";

import { Box, Button, Typography, CardContent } from "@mui/material";
import Logo from "../../@core/components/img/logo";
import { styled, useTheme } from "@mui/material/styles";
import MuiCard, { CardProps } from "@mui/material/Card";
import themeConfig from "../../configs/themeConfig";
import BlankLayout from "../../@core/layouts/BlankLayout";
import Footer from "../Footer";
import Translations from "../../@core/layouts/Translations";

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  marginLeft: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const VerifyEmail = () => {
  // ** Hook
  const theme = useTheme();

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
              mb: 10,
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
          <Box sx={{ mb: 8 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              <Translations text="Verify your email" />
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              <Translations text="Account activation link sent to your email address:" />
              <strong>john.doe@email.com</strong>{" "}
              <Translations
                text="Please follow the link inside
              to continue."
              />
            </Typography>
          </Box>
          <Button fullWidth variant="contained">
            <Translations text="Skip for now" />
          </Button>
          <Box
            sx={{
              mt: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "text.secondary" }}>
              <Translations text="Didn't get the mail?" />
            </Typography>
            <LinkStyled to="/" onClick={(e) => e.preventDefault()}>
              <Translations text="Resend" />
            </LinkStyled>
          </Box>
        </CardContent>
      </Card>
      <Footer />
    </Box>
  );
};

VerifyEmail.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default VerifyEmail;
