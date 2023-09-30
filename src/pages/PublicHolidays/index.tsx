import { ChangeEvent, useState, useEffect } from "react";
import {
  Box,
  Paper,
  TableContainer,
  Button,
  TableCell,
  Typography,
} from "@mui/material";
import Icon from "../../@core/components/icon";
import TableHeader from "./components/TableHeader";
import CustomDayOff from "../../@core/components/dayOffModal/CustomDayOff";
import WarningDialog from "../../@core/components/warningDialog/WarningDialog";
import PaginatedTable, {
  ColumnsProps,
} from "../../@core/components/PaginatedTable";
import {
  useDeleteHolidayMutation,
  useGetAllHolidaysQuery,
} from "../../store/services";
import DoNotDisturbCheckBox from "./components/DoNotDistrubCheckBox/CheckBox";
import { useSnackbar } from "notistack";
import { IHoliday } from "../../store/types/holiday.type";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { userTypes } from "../../store/types/globalTypes";
import Translations from "../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";

const PublicHolidays = () => {
  const [show, setShow] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [pageOffSet, setPageOffSet] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [queryOne, setQueryOne] = useState("");
  const [queryTwo, setQueryTwo] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [currentRowId, setCurrentRowId] = useState("");
  const [holidayId, setHolidayId] = useState("");

  const user = useSelector((state: RootState) => state.auth.user);

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const { data, isFetching: isLoading } = useGetAllHolidaysQuery({
    limit,
    offset: pageOffSet,
    yearQuery: queryOne ? queryOne : "",
    countryQuery: queryTwo ? queryTwo : "",
  });
  //@ts-ignore
  const holidayList: IHoliday = data?.data?.list;
  //@ts-ignore
  const totalCount = data?.data?.totalCount;
  const [
    handleDeleteHoliday,
    { isLoading: isDeleting, isSuccess: isDeleted, error },
  ] = useDeleteHolidayMutation();

  const handleChangePage = (event: unknown, newPage: number) => {
    const add = newPage > offset;
    if (add) {
      setPageOffSet(limit * newPage);
    } else {
      setPageOffSet(pageOffSet - limit);
    }
    setOffset(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setOffset(0);
  };

  const getDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return formattedDate;
  };

  function getYearFromString(str: string) {
    const date = new Date(str);
    return date.getFullYear();
  }

  useEffect(() => {
    if (isDeleted) {
      setShowDialog(false);
      enqueueSnackbar(<Translations text={"Deleted successful"} />, {
        variant: "success",
      });
    }
    if (error) {
      enqueueSnackbar(<Translations text={"Error alert!"} />, {
        variant: "error",
      });
    }
  }, [isDeleted]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", m: 4 }}>
        <Button
          sx={{ backgroundColor: "none" }}
          variant="contained"
          onClick={() => {
            setShow(true);
            setHolidayId("");
          }}
        >
          <Translations text="ADD DAY OFF" />
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <TableHeader
          setYear={setQueryOne}
          year={queryOne}
          setCountry={setQueryTwo}
          country={queryTwo}
        />
        <PaginatedTable
          id="name"
          hasCheckBox
          columns={headCells}
          items={holidayList}
          showPagination
          setSelected={setSelected}
          selected={selected}
          isLoading={isLoading}
          page={offset}
          count={totalCount}
          rowsPerPage={limit}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          renderBody={(row: IHoliday, index) => {
            return (
              <>
                <TableCell
                  key={row._id}
                  sx={{
                    minWidth: 150,
                    cursor: "pointer",
                    "&:hover": {
                      color: "purple",
                      textDecorationLine: "underline",
                      textDecorationColor: "purple",
                    },
                  }}
                  component="th"
                  scope="row"
                  onClick={() => {
                    if (
                      user?.roleName === userTypes.SUPER_ADMIN ||
                      row?.companyAdminId !== null
                    ) {
                      setShow(true);
                      setHolidayId(row._id);
                    } else {
                      enqueueSnackbar("You are not authorize to edit", {
                        variant: "error",
                      });
                    }
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "400",
                      fontSize: "14px",
                      color: "#3A3541",
                    }}
                    variant="body1"
                  >
                    {row.holidayName}
                  </Typography>
                </TableCell>
                <TableCell align="left" sx={{ minWidth: 200 }}>
                  {getDate(row.holidayDate)}
                </TableCell>
                <TableCell align="left">
                  {getYearFromString(row.holidayDate)}
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 100 }}>
                  <DoNotDisturbCheckBox
                    rowId={row._id}
                    checked={row.doNotDisturb}
                  />
                </TableCell>

                <TableCell sx={{ cursor: "pointer" }}>
                  {(user?.roleName === userTypes.SUPER_ADMIN ||
                    row?.companyAdminId !== null) && (
                    <Box
                      onClick={() => {
                        setCurrentRowId(row._id);
                        setShowDialog(true);
                      }}
                    >
                      <Icon icon="mdi:rubbish-bin" />
                    </Box>
                  )}
                </TableCell>
              </>
            );
          }}
        />
      </TableContainer>

      <CustomDayOff setShow={setShow} show={show} holidayId={holidayId} />

      {showDialog && (
        <WarningDialog
          content={t("Are you sure you want to delete team?")}
          isLoading={isDeleting}
          setShow={setShowDialog}
          onConfirm={() => {
            if (currentRowId) {
              handleDeleteHoliday(currentRowId);
            }
          }}
          show={showDialog}
        />
      )}
    </>
  );
};
export default PublicHolidays;

const headCells: ColumnsProps[] = [
  {
    id: "title",
    label: "TITLE",
  },
  {
    id: "date",
    label: "DATE",
  },
  {
    id: "year",
    label: "YEAR",
  },
  {
    id: "doNotDisturb",
    direction: "center",
    label: "DO NOT DISTURB",
  },
  {
    id: "",
    label: "",
  },
];
