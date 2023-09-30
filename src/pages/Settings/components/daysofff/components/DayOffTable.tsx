import { useState, useEffect } from "react";
import {
  Box,
  TableCell,
  Grid,
  FormControlLabel,
  Switch,
  Button,
  Card,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import PaginatedTable, {
  ColumnsProps,
} from "../../../../../@core/components/PaginatedTable/index.js";
import Icon from "../../../../../@core/components/icon";
import WarningDialog from "../../../../../@core/components/warningDialog/WarningDialog";
import { RootState } from "../../../../../store";
import {
  useDeleteDaysMutation,
  useGetDaysOffQuery,
  useUpdateAllDaysOffMutation,
  useUpdateDaysOffMutation,
  useUpdateDoNotDisturbStatusMutation,
} from "../../../../../store/services";
import DoNotDisturbCheckBox from "./DoNotDistrubCheckBox/CheckBox";
import DaysOffModal from "./daysOffModal";
import { IDaysOff } from "../../../../../store/types/daysoff.types";
import { formateDate } from "../../../../../lib/dateFormater";
import MuiSwitch from "../../../../../@core/components/muiSwitch";
import { Translation, useTranslation } from "react-i18next";
import Translations from "../../../../../@core/layouts/Translations.js";

const TeamsList = () => {
  const { t } = useTranslation();
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const [selected, setSelected] = useState<string[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [showDialog, setShowDeleteDialog] = useState(false);
  const [currentRowId, setCurrentRowId] = useState("");
  const [holidayId, setHolidayId] = useState("");
  const [userDndStat, setUserDndStatus] = useState(false);

  const [tableData, setTableData] = useState<IDaysOff[]>([]);

  const user = useSelector((state: RootState) => state.auth.user);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  //apis
  const { data, isLoading, isFetching } = useGetDaysOffQuery("");
  const [
    handleUpdateDayOff,
    { isLoading: isUpdating, isSuccess: isUpdatedDayOff },
  ] = useUpdateAllDaysOffMutation();

  const [
    handleDeleteDayOff,
    { isLoading: isDeleting, isSuccess: isDeleted, error },
  ] = useDeleteDaysMutation();

  const [handleUpdateStatus, { isSuccess: isUpdated }] =
    useUpdateDoNotDisturbStatusMutation();

  useEffect(() => {
    if (isUpdated) {
      enqueueSnackbar(
        <Translations text="Do not disturb status update successfully." />,
        {
          variant: "success",
        }
      );
    } else if (isUpdatedDayOff) {
      enqueueSnackbar(<Translations text="Changes saved successfully." />, {
        variant: "success",
      });
    }
  }, [isUpdated, isUpdatedDayOff]);

  //@ts-ignore
  const userDaysOff: IDaysOff[] = data?.data?.list?.holidays;
  //@ts-ignore
  const userDndStatus = data?.data?.list?.userDoNotDisturbStatus;

  useEffect(() => {
    if (userDaysOff) {
      const newData = [...userDaysOff];
      setTableData(newData);
    }
  }, [userDaysOff]);

  useEffect(() => {
    setUserDndStatus(userDndStatus);
  }, [userDndStatus]);

  useEffect(() => {
    if (isDeleted) {
      setShowDeleteDialog(false);
      enqueueSnackbar(<Translations text="Day deleted successfully" />, {
        variant: "success",
      });
    } else if (error) {
      enqueueSnackbar(<Translations text="Something went wrong!" />, {
        variant: "error",
      });
    }
  }, [isDeleted, error]);

  const handleUpdateDnd = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: IDaysOff
  ) => {
    const cIndex = tableData.findIndex((r) => r._id === row._id);
    if (cIndex !== -1) {
      const newData = [...tableData];

      if (row.daysOff.length > 0) {
        const updatedRow = { ...newData[cIndex] };
        const updatedDaysOff = [...updatedRow.daysOff];
        updatedDaysOff[0] = {
          ...updatedDaysOff[0],
          doNotDisturb: e.target.checked,
        };
        updatedRow.daysOff = updatedDaysOff;
        newData[cIndex] = updatedRow;
        setTableData(newData);
      } else {
        const updatedRow = { ...newData[cIndex] };
        updatedRow.doNotDisturb = e.target.checked;
        newData[cIndex] = updatedRow;
        setTableData(newData);
      }
    }
  };

  const handleUpdateChanges = () => {
    const newData = tableData.map((e: IDaysOff) => {
      return {
        userId: user?.id,
        holidayId: e._id,
        doNotDisturb:
          e.daysOff.length > 0 ? e.daysOff[0].doNotDisturb : e.doNotDisturb,
      };
    });

    handleUpdateDayOff({ userDayOff: newData });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setOffset(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(parseInt(event.target.value, 10));
    setOffset(0);
  };

  return (
    <Box sx={{ maxWidth: "1000px" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{ mb: 5 }}
          onClick={() => {
            setShow(true);
            setHolidayId("");
          }}
        >
          {t("ADD PERSONAL DAYOFF")}
        </Button>
      </Box>
      <Card>
        <PaginatedTable
          id="name"
          hasCheckBox={false}
          columns={headCells}
          items={tableData}
          showPagination={false}
          setSelected={setSelected}
          selected={selected}
          isLoading={isLoading || isFetching}
          page={offset}
          //@ts-ignore
          count={data?.data?.totalCount}
          rowsPerPage={limit}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          renderBody={(row: IDaysOff, index: number) => {
            return (
              <>
                <TableCell
                  component="th"
                  scope="row"
                  align="left"
                  sx={{
                    minWidth: 150,
                    fontWeight: "bold",
                    cursor: "pointer",
                    "&:hover": {
                      color: "purple",
                      textDecorationLine: "underline",
                      textDecorationColor: "purple",
                    },
                  }}
                  onClick={() => {
                    if (row.userId === user?.id) {
                      setShow(true);
                      setHolidayId(row._id);
                    } else {
                      enqueueSnackbar(
                        "You Don't have permission to edit this day!",
                        { variant: "error" }
                      );
                    }
                  }}
                >
                  {row.holidayName}
                </TableCell>
                <TableCell component="th" scope="row" align="left">
                  {formateDate(row.holidayDate)}
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 100 }}>
                  <MuiSwitch
                    onChange={(e) => {
                      handleUpdateDnd(e, row);
                    }}
                    value={
                      row.daysOff.length > 0
                        ? row.daysOff[0].doNotDisturb
                        : row.doNotDisturb
                    }
                  />
                </TableCell>

                <TableCell sx={{ cursor: "pointer" }} align="center">
                  {row.userId === user?.id && (
                    <Icon
                      icon="mdi:rubbish-bin"
                      onClick={() => {
                        setShowDeleteDialog(true);
                        setCurrentRowId(row._id);
                      }}
                    />
                  )}
                </TableCell>
              </>
            );
          }}
        />
      </Card>

      <Box sx={{ mt: 10 }}>
        <Button
          onClick={handleUpdateChanges}
          variant="contained"
          sx={{ width: "205px", mr: 1 }}
        >
          {isUpdating ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            <Translations text={"SAVE CHANGES"} />
          )}
        </Button>
        <Button
          sx={{ ml: 3 }}
          variant="outlined"
          color="secondary"
          onClick={() => navigate(-1)}
        >
          {t("CANCEL")}
        </Button>
      </Box>

      <DaysOffModal setShow={setShow} show={show} holidayId={holidayId} />
      <WarningDialog
        isLoading={isDeleting}
        content="Are you sure you want to delete this day"
        setShow={setShowDeleteDialog}
        onConfirm={() => {
          if (currentRowId) {
            handleDeleteDayOff(currentRowId);
          }
        }}
        show={showDialog}
      />
    </Box>
  );
};
export default TeamsList;

const headCells: ColumnsProps[] = [
  {
    id: "day",
    label: "Day",
  },
  {
    id: "date",
    label: "DATE",
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
