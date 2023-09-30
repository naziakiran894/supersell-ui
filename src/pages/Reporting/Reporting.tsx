import Grid from "@mui/material/Grid";
import { CardStatsCharacterProps } from "../../@core/components/card-statistics/types";
import { CardStatsProps } from "../../@core/components/card-statistics/types";
import CardStatisticsCharacter from "./components/CardStatisticsCharacter";
import CrmSalesOverview from "./components/CrmSalesOverview";
import CrmOffersOverwiew from "./components/CrmOffersOverview ";
import ApexChartWrapper from "./components/ApexChartWrapper";
import SalesPerformanceTable from "./components/SalesPerformanceTable";
import CallPerformanceTable from "./components/CallPerformanceTable";
import LeadSourceTable from "./components/LeadSourceTable";
import InboundCallsTable from "./components/InboundCallsTable";
import CallPerformanceGraph from "./components/CallPerformanceGraph";
import AverageResponseGraph from "./components/AverageResponseGraph";
import WeeklySalesReportChart from "./components/WeeklySalesReportChart";
import AverageResponse from "./components/AverageResponse";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import PickersRange from "../../@core/components/RangeDatePicker";
import { DateType } from "../../@core/components/types/forms/reactDatepickerTypes";
import Translations from "../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";
import { useGetReportingQuery } from "../../store/services";
import { IReporting } from '../../store/types/reportingTypes'
interface IProps {
  setStartDateRange: React.Dispatch<React.SetStateAction<DateType>>;
  startDateRange: DateType;
  setEndDateRange: React.Dispatch<React.SetStateAction<DateType>>;
  endDateRange: DateType;
}

export interface ICartStatType {
  title: string;
  stats: string;
  number: string;
  bgColor: string;
  icon: string;
}

const CRMReporting = ({
  startDateRange,
  setStartDateRange,
  endDateRange,
  setEndDateRange,
}: IProps) => {
  const reportingData = useGetReportingQuery("");

  //@ts-ignore
  const reporting: IReporting = reportingData?.data?.data || {}

  const calculatePercentage = (connectedLeads: string =  "0", totalLeads: string = '0') => {
    if (Number(totalLeads) === 0) {
      return 0;
    }
    return (Number(connectedLeads) / Number(totalLeads)) * 100;
  };

  const formatTime = (timeInSeconds: string = '0') => {
    const minutes = Math.floor(Number(timeInSeconds) / 60);
    const seconds = Number(timeInSeconds) % 60;
    return `${minutes}m ${seconds}s`;
  };

  const data: ICartStatType[] = [
    {
      title: "LEADS",
      //@ts-ignore
      stats: reporting.totalLeads || 0,
      number: "89%",
      bgColor: "primary.dark",
      icon: "mdi:account-multiple",
    },
    {
      title: "CONTACTED",
      stats: reporting.totalConnectedLeads,
      number: `${calculatePercentage(
        reporting.totalConnectedLeads,
        reporting.totalLeads
      ).toFixed(0)}% `,
      bgColor: "secondary.dark",
      icon: "mdi:phone-in-talk",
    },
    {
      title: "MEETINGS",
      stats: reporting.totalLeadMeetings,
      number: `${calculatePercentage(
        reporting.totalLeadMeetings,
        reporting.totalLeads
      ).toFixed(0)}% `,
      bgColor: "error.dark",
      icon: "mdi:calendar-blank",
    },
    {
      title: "OFFERS",
      stats: reporting.offers,
      number: `${calculatePercentage(
        reporting.offers,
        reporting.totalLeads
      ).toFixed(0)}% `,
      bgColor: "warning.dark",
      icon: "mdi:file-document",
    },
    {
      title: "DEALS",
      stats: reporting.deals,
      number: `${calculatePercentage(
        reporting.deals,
        reporting.totalLeads
      ).toFixed(0)}% `,
      bgColor: "info.dark",
      icon: "mdi:currency-eur",
    },
  ];

  const avgData: CardStatsProps[] = [
    {
      title: "AVERAGE RESPONSE TIME",
      stats: formatTime(reporting.averageResponseTime),
      bgColor: "warning.light",
      icon: "mdi:clock",
    },
    {
      title: "AVERAGE CALL ATTEMPS",
      stats: formatTime(reporting.averageCallAttemptsTime),
      bgColor: "error.light",
      icon: "mdi:call-missed",
      isReverted: true,
    },
  ];

  return (
    <ApexChartWrapper>
      <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
        <Grid container spacing={6} justifyContent="flex-end">
          <Grid item sm={3.7} xs={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-outlined-label">
                <Translations text={"Select Status"} />
              </InputLabel>
              <Select
                label="Select Team"
                defaultValue=""
                id="demo-simple-select-outlined"
                labelId="demo-simple-select-outlined-label"
              >
                <MenuItem value={1}>Finnish</MenuItem>
                <MenuItem value={2}>English</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={3.7} xs={12}>
            <PickersRange
              startDateRange={startDateRange}
              setStartDateRange={setStartDateRange}
              setEndDateRange={setEndDateRange}
              endDateRange={endDateRange}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        {data?.map((e, i) => {
          return (
            <Grid
              key={i}
              item
              md={2.4}
              xs={12}
              sm={6}
              sx={{
                pt: (theme) => `${theme.spacing(12.25)} !important`,
              }}
            >
              <CardStatisticsCharacter data={e} />
            </Grid>
          );
        })}
      </Grid>

      <Grid container mt={10} spacing={5}>
        <Grid
          item
          xs={12}
          md={9.6}
          sm={12}
          sx={{
            mb: 1.5,
            rowGap: 1,
            alignItems: "flex-start",
          }}
        >
          <WeeklySalesReportChart />
        </Grid>
        <Grid item md={2.4} xs={12}>
          <Grid container spacing={5}>
            {avgData.map((e, i) => {
              return (
                <Grid item key={i} md={12} xs={12} sm={6}>
                  <AverageResponse avgData={e} />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={6} mt={5}>
        <Grid item xs={12} md={6}>
          <CrmOffersOverwiew />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <CrmSalesOverview />
        </Grid>
      </Grid>
      <Grid mt={5} xs={12} sm={12} md={12}>
        <SalesPerformanceTable />
      </Grid>
      <Grid mt={5} xs={12} sm={12} md={12}>
        <CallPerformanceTable />
      </Grid>
      <Grid mt={5} xs={12} sm={12} md={12}>
        <LeadSourceTable />
      </Grid>
      <Grid mt={5} xs={12} sm={12} md={12}>
        <InboundCallsTable />
      </Grid>

      <Grid container mt={5}>
        <Grid
          item
          md={8}
          xs={12}
          sm={12}
          sx={{
            mb: 1.5,
            rowGap: 1,
            alignItems: "flex-start",
          }}
        >
          <CallPerformanceGraph />{" "}
        </Grid>
      </Grid>
      <Grid container mt={5}>
        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          sx={{
            mb: 1.5,
            rowGap: 1,
            alignItems: "flex-start",
          }}
        >
          <AverageResponseGraph />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default CRMReporting;
