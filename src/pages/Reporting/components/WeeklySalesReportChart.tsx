import React, { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Card,
  Box,
  Typography,
  Grid,
  CardContent,
  CardHeader,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomAvatar from "../../../@core/components/mui/avatar";
import Icon from "../../../@core/components/icon";
import { ApexOptions } from "apexcharts";
import OptionsMenu from "../../../@core/components/option-menu copy";
import { useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";
import { useGetGraphQuery } from "../../../store/services";

interface DataType {
  title: string;
  Stats: string;
  bgColor: string;
  icon: string;
}

interface ReportingProps {
  totalLeads: number;
  totalConnectedLeads: number;
  totalLeadMeetings: number;
  offers: number;
  deals: number;
}
const ApexChart: React.FC = () => {
  const graphData = useGetGraphQuery("");
  const theme = useTheme();
  const { t } = useTranslation();

  //@ts-ignore
  const totalLeadsSum = graphData.data?.data.reduce(
    (acc: number, item: any) => acc + item.totalLeads,
    0
  );
  //@ts-ignore
  const connectedSum = graphData.data?.data.reduce(
    (acc: number, item: any) => acc + item.totalConnectedLeads,
    0
  );
  //@ts-ignore
  const meetingSum = graphData.data?.data.reduce(
    (acc: number, item: any) => acc + item.totalLeadMeetings,
    0
  );
  //@ts-ignore
  const offersSum = graphData.data?.data.reduce(
    (acc: number, item: any) => acc + item.offers,
    0
  );
  //@ts-ignore
  const dealsSum = graphData.data?.data.reduce(
    (acc: number, item: any) => acc + item.deals,
    0
  );

  const data: DataType[] = [
    {
      title: "Leads",
      Stats: totalLeadsSum,
      bgColor: theme.palette.primary.dark,
      icon: "mdi:account-multiple",
    },
    {
      title: "Contacted",
      Stats: connectedSum,
      bgColor: theme.palette.secondary.dark,
      icon: "mdi:phone-in-talk",
    },
    {
      title: "Meetings",
      Stats: meetingSum,
      bgColor: theme.palette.error.dark,
      icon: "mdi:calendar-blank",
    },
    {
      title: "Offers",
      Stats: offersSum,
      bgColor: theme.palette.warning.dark,
      icon: "mdi:file-document",
    },
    {
      title: "Deals",
      Stats: dealsSum,
      bgColor: theme.palette.info.dark,
      icon: "mdi:currency-eur",
    },
  ];

  const series = useMemo(() => {
    //@ts-ignore
    const reportingData: ReportingProps[] = graphData.data?.data;

    const totalLeads = reportingData?.map((item) => item.totalLeads);
    const totalConnectedLeads = reportingData?.map(
      (item) => item.totalConnectedLeads
    );
    const totalLeadMeetings = reportingData?.map(
      (item) => item.totalLeadMeetings
    );
    const offers = reportingData?.map((item) => item.offers);
    const deals = reportingData?.map((item) => item.deals);

    const reporting = [
      { data: totalLeads },
      { data: totalConnectedLeads },
      { data: totalLeadMeetings },
      { data: offers },
      { data: deals },
    ];

    return reporting;
  }, [graphData]);

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      height: 350,
      toolbar: {
        show: false,
      },
    },
    legend: { show: false },
    plotOptions: {
      bar: {
        columnWidth: "95%",
        borderRadius: 5,
      },
    },
    grid: {
      show: false,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    colors: [
      theme.palette.primary.dark,
      theme.palette.secondary.dark,
      theme.palette.error.dark,
      theme.palette.warning.dark,
      theme.palette.info.dark,
    ],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `$ ${val} thousands`,
      },
    },
  });

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Card sx={{ width: "100%" }}>
          <CardHeader
            title={`${t(
              "Sales funnel by week (same card also for month, quarters and years)"
            )}`}
            titleTypographyProps={{
              sx: {
                lineHeight: "2rem !important",
                letterSpacing: "0.15px !important",
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
          <div id="chart">
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              width="100%"
              height={350}
            />
          </div>
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              pt: (theme) => `${theme.spacing(4)} !important`,
              pb: (theme) => `${theme.spacing(5.5)} !important`,
            }}
          >
            <Grid container sx={{ display: "flex", alignItems: "center" }}>
              {data.map((item: DataType, index: number) => {
                return (
                  <Grid
                    item
                    xs={6}
                    md={2.4}
                    sm={4}
                    sx={{
                      mb: 4,
                      display: "flex",
                      justifyItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CustomAvatar
                      variant="rounded"
                      sx={{
                        mr: 3.5,
                        bgcolor: item.bgColor,
                        "& svg": { color: "white" },
                      }}
                    >
                      <Icon icon={item.icon} />
                    </CustomAvatar>
                    <Box sx={{}}>
                      <Typography sx={{ fontWeight: 600 }}>
                        {item.Stats}
                      </Typography>
                      <Typography variant="body2">
                        <Translations text={item.title} />
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default ApexChart;
