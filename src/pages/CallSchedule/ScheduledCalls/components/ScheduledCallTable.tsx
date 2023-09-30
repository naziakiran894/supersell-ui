import { ChangeEvent, useEffect, useState, useTransition } from "react";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import {
  Grid,
  Card,
  Button,
  TableCell,
  TextField,
  Box,
  Stack,
  Typography,
  styled,
} from "@mui/material";

import { useGetAllScheduleCallQuery } from "../../../../store/services";
import PaginatedTable, {
  ColumnsProps,
  Order,
} from "../../../../@core/components/PaginatedTable";
import useDebounce from "../../../../hooks/useDebounce";
import { IUser } from "../../../../store/types/user.types";
import EditScheduledCallDialog from "./EditSchedulledCallDialog";
import Icon from "../../../../@core/components/icon";
import TableFilters from "./TableFilters";
import { handleReplaceDynVar } from "../../../../lib/dynamicVariableReplacer";
import { ICallSchedule } from "../../../../store/types/scheduleCall.types";
import { useDownloadScheduleServiceMutation } from "../../../../store/services";
import { useDeleteScheduleCallServiceMutation } from "../../../../store/services";

import addDays from "date-fns/addDays";
import { DateType } from "../../../../@core/components/types/forms/reactDatepickerTypes";
import format from "date-fns/format";
import APP_ROUTES from "../../../../Routes/routes";
import { enqueueSnackbar } from "notistack";
import WarningDialog from "../../../../@core/components/warningDialog/WarningDialog";
import { ISchedule } from "../../../../store/types/schedule.types";
import Translations from "../../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";
import { userTypes } from "../../../../store/types/globalTypes";
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const ScheduledCallsTable = () => {
  const [currentRowId, setCurrentRowId] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [pageOffSet, setPageOffSet] = useState<number>(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState<string>("firstName");
  const [show, setShow] = useState<boolean>(false);
  const [showDialog, setShowDeleteDialog] = useState(false);
  const [name, setName] = useState("");
  const [scheduleCall, setScheduleCall] = useState<ISchedule | null>();

  //filters
  const [teamName, setTeamName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [startDateRange, setStartDateRange] = useState<DateType>(null);
  const [endDateRange, setEndDateRange] = useState<DateType>(null);
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(query, 500);

  const formatDate = (date: any) => {
    if (date) {
      return date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    }
  };

  const {
    data,
    isFetching: isLoading,
    refetch,
  } = useGetAllScheduleCallQuery({
    limit,
    offset: pageOffSet,
    searchQuery: debouncedSearchTerm.length >= 2 ? query : "",
    order: order === "asc" ? 1 : -1,
    sort: orderBy,
    teamId: teamName,
    leadOwnerId: userName,
    numberId: number,
    startDateRange: formatDate(startDateRange),
    endDateRange: formatDate(endDateRange),
  });

  const permissions = useSelector(
    (state: RootState) => state.permissions.Permissions
  );
  const clientSettings = useSelector(
    (state: RootState) => state?.clientSetting?.ClientSetting
  );

  const [handleDownloadCsv] = useDownloadScheduleServiceMutation();

  const [
    handleDeleteScheduleCall,
    { isLoading: isDeleting, error, isSuccess: isDeleted },
  ] = useDeleteScheduleCallServiceMutation();

  //@ts-ignore
  const callList: IUser[] = data?.data?.list;
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    setOffset(0);
    setPageOffSet(0);
  }, [order]);

  useEffect(() => {
    if (isDeleted) {
      setShowDeleteDialog(false);
      enqueueSnackbar(
        <Translations text={"Schedule call deleted successfully"} />,
        {
          variant: "success",
        }
      );
    } else if (error) {
      enqueueSnackbar(<Translations text={"Something went wrong!"} />, {
        variant: "error",
      });
    }
  }, [isDeleted, error]);

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
      <TableFilters
        teamName={teamName}
        setTeamName={setTeamName}
        setUserName={setUserName}
        userName={userName}
        setNumber={setNumber}
        number={number}
        startDateRange={startDateRange}
        setStartDateRange={setStartDateRange}
        endDateRange={endDateRange}
        setEndDateRange={setEndDateRange}
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
          items={callList}
          showPagination
          setSelected={setSelected}
          selected={selected}
          isLoading={isLoading}
          page={offset}
          //@ts-ignore
          count={data?.data?.totalCount}
          rowsPerPage={limit}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          setOrder={setOrder}
          order={order}
          setOrderBy={setOrderBy}
          orderBy={orderBy}
          renderBody={(data: ICallSchedule, index: number) => {
            const handleEditButtonClick = () => {
              setCurrentRowId(data._id);
              const leadUrl = APP_ROUTES.leadsDetails;
              const leadId = data?.lead?._id;
              const navigateUrl = `${leadUrl}/${leadId}?showSchedule=true&sId=${data._id}`;
              navigate(navigateUrl);
            };
            return (
              <>
                <TableCell component="th" align="left">
                  {dayjs(data?.scheduledCallDateTime).format(
                    clientSettings?.defaultDateTimeFormat || "DD.MM.YYYY hh.mm"
                  )}
                </TableCell>
                <TableCell
                  component="th"
                  align="left"
                  onClick={() =>
                    navigate(`${APP_ROUTES.leadsDetails}/${data?.lead?._id}`)
                  }
                  sx={{ cursor: "pointer" }}
                >
                  <Typography
                    variant="body1"
                    color="text.primary"
                    onClick={() =>
                      navigate(`${APP_ROUTES.leadsDetails}/${data?.lead?._id}`)
                    }
                  >
                    {clientSettings?.leadTitle &&
                      data?.lead &&
                      handleReplaceDynVar(
                        data?.lead,
                        clientSettings?.leadTitle
                      )}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {clientSettings?.leadSubTitle &&
                      data?.lead &&
                      handleReplaceDynVar(
                        data?.lead,
                        clientSettings?.leadSubTitle
                      )}
                  </Typography>
                </TableCell>
                <TableCell component="th" align="left">
                  <Typography variant="body1" color="text.primary">
                    {data?.user?.firstName} {data?.user?.lastName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {data?.team}
                  </Typography>
                </TableCell>
                <TableCell component="th" align="center">
                  <Typography variant="body1" color="text.secondary">
                    {!!data?.followUp ? `#${data?.followUp}` : "First attempt"}
                  </Typography>
                </TableCell>
                <TableCell>

                </TableCell>

                <TableCell sx={{ cursor: "pointer" }} align="center">
                  <Button
                    sx={{ mb: 2, backgroundColor: "none", minWidth: "77px" }}
                    variant="outlined"
                    onClick={handleEditButtonClick}
                  >
                    <Translations text={"EDIT"} />
                  </Button>
                </TableCell>
                <TableCell sx={{ cursor: "pointer" }} align="left">
                  {data.role !== userTypes.SUPER_ADMIN && (
                    <Icon
                      icon="mdi:rubbish-bin"
                      onClick={() => {
                        setShowDeleteDialog(true);
                        setCurrentRowId(data._id);
                      }}
                    />
                  )}
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
        <WarningDialog
          isLoading={isDeleting}
          setShow={setShowDeleteDialog}
          onConfirm={() => {
            if (currentRowId) {
              handleDeleteScheduleCall(currentRowId);
            }
          }}
          show={showDialog}
          name={name}
        />
      </Card>
    </>
  );
};

export default ScheduledCallsTable;

const headCells: ColumnsProps[] = [
  {
    id: "dateAndTime",
    label: "DATE & TIME",
  },
  {
    id: "lead",
    label: "LEAD",
  },
  {
    id: "userAndTeam",
    label: "USER & TEAM",
  },
  {
    id: "followup",
    label: "FOLLOWUP",
    direction: "center",
  },
  {
    id: "",
    label: "",
    hideSortIcon: true,
    direction: "center",
  },
  {
    id: "",
    label: "",
    hideSortIcon: true,
    direction: "center",
  },
  {
    id: "",
    label: "",
    hideSortIcon: true,
    direction: "center",
  },
];
function setShowDeleteDialog(arg0: boolean) {
  throw new Error("Function not implemented.");
}
