// ** React Imports
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid, { GridProps } from "@mui/material/Grid";
import { styled, useTheme } from "@mui/material/styles";
import Icon from "../../../@core/components/icon";
import { ApexOptions } from "apexcharts";
import { ThemeColor } from "../../../@core/layouts/types";
import CustomAvatar from "../../../@core/components/mui/avatar";
import OptionsMenu from "../../../@core/components/option-menu copy";
import ReactApexCharts from "react-apexcharts";
import Translations from "../../../@core/layouts/Translations";

interface DataType {
  title: string;
  icon: ReactNode;
  subtitle: string;
  avatarBgcolor: ThemeColor;
  avatarColor?: ThemeColor;
}

const series = [
  {
    name: "Product A",
    data: [29000, 22000, 25000, 18500, 29000, 20000, 34500],
  },
];

const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  [theme.breakpoints.up("sm")]: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const EcommerceTotalProfit = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const data: DataType[] = [
    {
      title: "2min 22s",
      avatarBgcolor: "warning",
      avatarColor: "warning",
      subtitle: "Calls",
      icon: <Icon icon="mdi:trending-up" fontSize="1.875rem" />,
    },
  ];

  const options: ApexOptions = {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "38%",
        borderRadiusApplication: "around",
        borderRadiusWhenStacked: "all",
      },
    },
    colors: ["#ffb400"],
    grid: {
      strokeDashArray: 7,
      borderColor: theme.palette.divider,
      padding: {
        left: 0,
        bottom: -10,
      },
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 6,
      curve: "smooth",
      lineCap: "round",
      colors: [theme.palette.background.paper],
    },
    states: {
      hover: {
        filter: { type: "none" },
      },
      active: {
        filter: { type: "none" },
      },
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: [15.1, 16.1, 17.1, 18.1, 19.1, 20.1, 21.1],
      labels: {
        style: { colors: theme.palette.text.disabled },
      },
    },
    yaxis: {
      labels: {
        offsetY: 2,
        offsetX: -10,
        formatter: (value: number) =>
          value > 999 ? `${(value / 1000).toFixed(0)}` : `${value}`,
        style: { colors: theme.palette.text.disabled },
      },
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xl,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "45%",
            },
          },
        },
      },
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "50%",
            },
          },
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "45%",
            },
          },
        },
      },
      {
        breakpoint: 430,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "55%",
            },
          },
        },
      },
    ],
  };

  return (
    <Card>
      <Grid container>
        <StyledGrid item xs={12} sm={7}>
          <CardContent
            sx={{
              height: "100%",
              "& .apexcharts-xcrosshairs.apexcharts-active": { opacity: 0 },
            }}
          >
            <Typography variant="h6">
              <Translations
                text={"Average Response Time by Day past 14 days"}
              />
            </Typography>
            <ReactApexCharts
              type="bar"
              height={282}
              series={series}
              options={options}
            />
          </CardContent>
        </StyledGrid>
        <Grid item xs={12} sm={5}>
          <CardHeader
            title={`${t("Monday 17.1")}`}
            titleTypographyProps={{
              sx: {
                fontSize: "1.5rem !important",
                lineHeight: "2rem !important",
                letterSpacing: "0.43px !important",
              },
            }}
            action={
              <OptionsMenu
                options={["Last 28 Days", "Last Month", "Last Year"]}
                iconButtonProps={{
                  size: "small",
                  sx: { color: "text.primary" },
                }}
              />
            }
          />
          <CardContent
            sx={{
              pt: (theme) => `${theme.spacing(4)} !important`,
              pb: (theme) => `${theme.spacing(5.5)} !important`,
            }}
          >
            {data.map((item: DataType, index: number) => {
              return (
                <Box
                  key={index}
                  sx={{ mb: 4, display: "flex", alignItems: "center", ml: 2 }}
                >
                  <CustomAvatar
                    // skin="light"
                    variant="rounded"
                    color={item?.avatarColor}
                    sx={{
                      mr: 3.5,
                      "& svg": { color: "white" },
                    }}
                  >
                    {item.icon}
                  </CustomAvatar>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2">
                      <Translations text={item.subtitle} />
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default EcommerceTotalProfit;
