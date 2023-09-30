import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Icon from "../../../@core/components/icon";
import { ApexOptions } from "apexcharts";
import CustomAvatar from "../../../@core/components/mui/avatar";
import OptionsMenu from "../../../@core/components/option-menu copy";
import ReactApexcharts from "react-apexcharts";
import { hexToRGBA } from "../../../@core/utils/hex-to-rgba";
import Translations from "../../../@core/layouts/Translations";

const CrmSalesOverview = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const options: ApexOptions = {
    chart: {
      sparkline: { enabled: true },
    },
    colors: [
      theme.palette.primary.main,
      hexToRGBA(theme.palette.primary.main, 0.7),
      hexToRGBA(theme.palette.primary.main, 0.5),
      theme.palette.customColors.trackBg,
    ],
    stroke: { width: 0 },
    legend: { show: false },
    dataLabels: { enabled: false },
    labels: ["Apparel", "Electronics", "FMCG", "Other Sales"],
    states: {
      hover: {
        filter: { type: "none" },
      },
      active: {
        filter: { type: "none" },
      },
    },
    plotOptions: {
      pie: {
        customScale: 0.9,
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              offsetY: 25,
              fontSize: "0.875rem",
              color: theme.palette.text.secondary,
            },
            value: {
              offsetY: -15,
              fontWeight: 500,
              formatter: (value) => `${value}k`,
              color: theme.palette.text.primary,
            },
            total: {
              show: true,
              fontSize: "0.875rem",
              label: "Weekly Sales",
              color: theme.palette.text.secondary,
              formatter: (value) =>
                `${value.globals.seriesTotals.reduce(
                  (total: number, num: number) => total + num
                )}k`,
            },
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader
        title={`${t("Offers Overview")}`}
        titleTypographyProps={{
          sx: {
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important",
          },
        }}
        action={
          <OptionsMenu
            options={["Last 28 Days", "Last Month", "Last Year"]}
            iconButtonProps={{ size: "small", sx: { color: "text.primary" } }}
          />
        }
      />
      <CardContent>
        <Grid container sx={{ my: [0, 4, 1.625] }}>
          <Grid item xs={12} sm={6} sx={{ mb: [3, 0] }}>
            <ReactApexcharts
              type="donut"
              height={220}
              series={[12, 25, 13, 50]}
              options={options}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ my: "auto" }}>
            <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
              <CustomAvatar
                skin="light"
                variant="rounded"
                sx={{ mr: 3, "& svg": { color: "primary.main" } }}
              >
                <Icon icon="mdi:currency-usd" />
              </CustomAvatar>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2">
                  <Translations text={"Amount of Offers"} />
                </Typography>
                <Typography variant="h6">$86,400</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: (theme) => `${theme.spacing(4)} !important` }} />
            <Grid container>
              <Grid item xs={6} sx={{ mb: 4 }}>
                <Box
                  sx={{
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    "& svg": {
                      mr: 1.5,
                      fontSize: "0.75rem",
                      color: "primary.main",
                    },
                  }}
                >
                  <Icon icon="mdi:circle" />
                  <Typography variant="body2">
                  <Translations text={"Category A"} />
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>$1,840</Typography>
              </Grid>
              <Grid item xs={6} sx={{ mb: 4 }}>
                <Box
                  sx={{
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    "& svg": {
                      mr: 1.5,
                      fontSize: "0.75rem",
                      color: hexToRGBA(theme.palette.primary.main, 0.7),
                    },
                  }}
                >
                  <Icon icon="mdi:circle" />
                  <Typography variant="body2">
                  <Translations text={"Category B"} />
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>$11,420</Typography>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    "& svg": {
                      mr: 1.5,
                      fontSize: "0.75rem",
                      color: hexToRGBA(theme.palette.primary.main, 0.5),
                    },
                  }}
                >
                  <Icon icon="mdi:circle" />
                  <Typography variant="body2">
                  <Translations text={"Category C"} />
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>$1,840</Typography>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    "& svg": {
                      mr: 1.5,
                      fontSize: "0.75rem",
                      color: "customColors.trackBg",
                    },
                  }}
                >
                  <Icon icon="mdi:circle" />
                  <Typography variant="body2">
                  <Translations text={"Category D"} />
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>$11,420</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CrmSalesOverview;
