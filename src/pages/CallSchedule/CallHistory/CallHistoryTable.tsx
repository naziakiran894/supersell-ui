import { Link, useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  Button,
  TableCell,
  TextField,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Icon from "../../../@core/components/icon";
import { ChangeEvent, Fragment, Key, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import PaginatedTable, {
  Order,
  ColumnsProps,
} from "../../../@core/components/PaginatedTable";
import useDebounce from "../../../hooks/useDebounce";
import EditScheduledCallDialog from "../ScheduledCalls/components/EditSchedulledCallDialog";
import HistoryTableFilters from "./CallHistoryFilters";
import { DateType } from "../../../@core/components/types/forms/reactDatepickerTypes";
import {
  useGetCallHistoryServiceQuery,
  useDownloadCallHistoryMutation,
} from "../../../store/services";
import { ICallHistory } from "../../../store/types/callHistory.types";
import dayjs from "dayjs";
import APP_ROUTES from "../../../Routes/routes";
import { handleReplaceDynVar } from "../../../lib/dynamicVariableReplacer";
import Translations from "../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";
import CallStatus from "../../../@core/components/callStatus";

const CallHistoryTable = () => {
  const navigate = useNavigate();

  const permissions = useSelector(
    (state: RootState) => state.permissions.Permissions
  );
  const user = useSelector((state: RootState) => state.auth.user);
  // const teamId = useSelector((state:RootState)=> state.auth.)
  const clientSettings = useSelector(
    (state: RootState) => state.clientSetting.ClientSetting
  );

  const [currentRowId, setCurrentRowId] = useState("");
  const [userName, setUserName] = useState<string>("");
  const [order, setOrder] = useState<Order>("asc");
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [pageOffSet, setPageOffSet] = useState<number>(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState<string>("firstName");
  const [show, setShow] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [startDateRange, setStartDateRange] = useState<DateType>(null);
  const [endDateRange, setEndDateRange] = useState<DateType>(null);

  //filter
  const [teamName, setTeamName] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [number, setNumber] = useState<string>("");

  const debouncedSearchTerm = useDebounce(query, 500);

  const { data, isFetching: isLoading } = useGetCallHistoryServiceQuery({
    teamId: teamName,
    userId: userName,
    callerNumber: number,
    limit,
    offset: pageOffSet,
    searchQuery: debouncedSearchTerm.length >= 2 ? debouncedSearchTerm : "",
    order: order === "asc" ? 1 : -1,
    sort: orderBy,
    startDate: startDateRange,
    endDate: endDateRange,
  });

  //@ts-ignore
  const callHistory: ICallHistory[] = data?.data?.list;

  //@ts-ignore
  const totalCount = data?.data?.totalCount;

  useEffect(() => {
    setOffset(0);
    setPageOffSet(0);
  }, [order]);

  const [handleDownloadCsv] = useDownloadCallHistoryMutation();

  const handleChangePage = (event: unknown, newPage: number) => {
    const add = newPage > offset;
    if (add) {
      setPageOffSet(limit * newPage);
    } else {
      setPageOffSet(pageOffSet - limit);
    }
    setOffset(newPage);
  };
  const { t } = useTranslation();

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setOffset(0);
  };

  return (
    <>
      <HistoryTableFilters
        teamName={teamName}
        setTeamName={setTeamName}
        status={status}
        setStatus={setStatus}
        setNumber={setNumber}
        number={number}
        startDateRange={startDateRange}
        setStartDateRange={setStartDateRange}
        endDateRange={endDateRange}
        setEndDateRange={setEndDateRange}
        userName={userName}
        setUserName={setUserName}
      />
      <Card>
        <Grid container mt={5}>
          <Grid item md={12} m={5}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 3, sm: 4, md: 4 }}
              justifyContent="space-between"
            >
              <Box>
                {((permissions !== null && permissions?.Downloads) ||
                  user?.loginAsClient) && (
                    <Button
                      sx={{ mr: 4, mb: 2 }}
                      color="secondary"
                      variant="outlined"
                      onClick={async () => handleDownloadCsv({})}
                      startIcon={<Icon icon="mdi:download" fontSize={20} />}
                    >
                      <Translations text="Download" />
                    </Button>
                  )}
              </Box>
              <TextField
                size="small"
                placeholder={t("Search")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Stack>
          </Grid>
        </Grid>

        <PaginatedTable
          id="name"
          hasCheckBox={false}
          columns={headCells}
          items={callHistory}
          showPagination
          setSelected={setSelected}
          selected={selected}
          isLoading={isLoading}
          page={offset}
          rowsPerPage={limit}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          setOrder={setOrder}
          order={order}
          setOrderBy={setOrderBy}
          orderBy={orderBy}
          count={totalCount}
          renderBody={(row: ICallHistory, index) => {
            return (
              <>
                <TableCell component="th" align="center">
                  {row.callDirection === "outbound" ? (
                    <Icon color="secondary" icon="mdi:arrow-top-right" />
                  ) : (
                    <Icon icon="mdi:arrow-bottom-left" />
                  )}
                </TableCell>
                <TableCell component="th" align="left">
                  <Typography variant="subtitle2" color="text.primary">
                    {" "}
                    {dayjs(row?.createdAt).format(
                      clientSettings?.defaultDateTimeFormat ||
                      "DD.MM.YYYY hh.mm"
                    )}
                  </Typography>
                </TableCell>
                <TableCell component="th" align="center">
                  <Typography variant="body1" color="text.primary">
                    {row.leadName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {row.leadPhone}
                  </Typography>
                </TableCell>
                <TableCell component="th" align="center">
                  <Typography variant="body1" color="text.primary">
                    {/* {row?.callStatus || ""} */}
                    <CallStatus callstatusValue={row?.callStatus} />
                  </Typography>
                  {/* <Typography variant="body1" color="text.secondary">
                    Folowup #2
                  </Typography> */}
                </TableCell>
                <TableCell component="th" align="center">
                  {row?.callerName || ""}
                </TableCell>
                <TableCell component="th" align="center">
                  <Typography sx={{ width: "100px" }}>
                    {row?.teamName}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{ display: "flex", flexWrap: "wrap" }}
                  component="th"
                  align="center"
                >
                  {row?.callAttemptedByUsers.map((user: any) => (
                    <Typography sx={{ width: "100%" }}>
                      {user.firstName} {user.lastName}
                    </Typography>
                  ))}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      navigate(`${APP_ROUTES.callHistory}/${row._id}`)
                    }
                  >
                    <Translations text="HISTORY" />
                  </Button>
                </TableCell>
              </>
            );
          }}
        />
        <EditScheduledCallDialog
          show={show}
          setShow={setShow}
          scheduleId={currentRowId}
        />
      </Card>
    </>
  );
};

export default CallHistoryTable;

const headCells: ColumnsProps[] = [
  {
    id: "",
    label: "",
    direction: "center",
  },
  {
    id: "dateAndTime",
    label: "DATE & TIME",
    direction: "left",
  },
  {
    id: "lead",
    label: "LEAD",
    direction: "center",
  },
  {
    id: "status",
    label: "STATUS",
    direction: "center",
  },
  {
    id: "caller",
    label: "CALLER",
    direction: "center",
  },
  {
    id: "team",
    label: "TEAM",
    hideSortIcon: true,
    direction: "center",
  },
  {
    id: "userAttempted",
    label: "USERS ATTEMPTED",
    direction: "center",
  },
  {
    id: "history",
    label: "HISTORY",
    direction: "center",
  },
];
