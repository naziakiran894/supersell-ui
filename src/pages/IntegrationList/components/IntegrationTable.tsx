import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { TableCell, Card, Box, Typography, Button } from "@mui/material";
import Icon from "../../../@core/components/icon";
import PaginatedTable, {
  ColumnsProps,
  Order,
} from "../../../@core/components/PaginatedTable";
import {
  useDeleteIntegrationMutation,
  useGetIntegrationDetailsByCompanyIdQuery,
} from "../../../store/services";
import WarningDialog from "../../../@core/components/warningDialog/WarningDialog";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import APP_ROUTES from "../../../Routes/routes";
import { RootState } from "../../../store";
import { IIntegration } from "../../../store/types/integration.types";
import IntegrationHeader from "./IntegrationHeader";
import IsActiveCheckBox from "./ActiveCheckBox";
import Translations from "../../../@core/layouts/Translations";
import dayjs from "dayjs";

const IntegrationTable = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [showDialog, setShowDialog] = useState(false);
  const [currentRowId, setCurrentRowId] = useState("");

  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [pageOffSet, setPageOffSet] = useState(0);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("firstName");
  const [activeStatus, setActiveStatus] = useState(false);

  const companyId = useSelector(
    (state: RootState) => state.auth.user?.companyId
  );

  const currentUser = useSelector(
    (state: RootState) => state?.currentUser?.currentUser
  );
  const clientSettings = useSelector(
    (state: RootState) => state.clientSetting.ClientSetting
  );

  const { data, isLoading, error, refetch } =
    useGetIntegrationDetailsByCompanyIdQuery({
      offset: pageOffSet,
      limit: limit,
      companyId: companyId,
      order: order === "asc" ? 1 : -1,
      sort: orderBy,
      // query: debouncedSearchTerm.length >= 2 ? query : "",
    });

  useEffect(() => {
    refetch();
  }, []);

  const [
    handleDeleteIntegration,
    { isLoading: isDeleting, isSuccess: isDeleted },
  ] = useDeleteIntegrationMutation();

  //@ts-ignore
  const integrationList: IIntegration[] = data?.data?.list;

  useEffect(() => {
    if (isDeleted) {
      enqueueSnackbar(
        <Translations text={"Integration deleted successful."} />,
        {
          variant: "success",
        }
      );
      setShowDialog(false);
    }
    if (error) {
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

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(parseInt(event.target.value, 10));
    setOffset(0);
  };

  return (
    <Box>
      <Box mb={10}>
        <Typography sx={{ fontSize: "24px", fontWeight: "500" }}>
          <Translations text="Integrations" />
        </Typography>
        <Typography sx={{ fontSize: "14px", fontWeight: "400", color: "gray" }}>
          {/* @ts-ignore */}
          {currentUser?.companyId?.companyName}
        </Typography>
      </Box>

      <Card>
        <IntegrationHeader />
        <PaginatedTable
          id="name"
          hasCheckBox={false}
          columns={headCells}
          items={integrationList}
          showPagination
          setSelected={setSelected}
          selected={selected}
          isLoading={isLoading}
          page={page}
          count={integrationList?.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          renderBody={(row: IIntegration, index) => {
            return (
              <>
                <TableCell
                  key={row._id}
                  component="th"
                  scope="row"
                  sx={{ cursor: "pointer" }}
                >
                  {row?.integrationName}
                </TableCell>
                <TableCell align="left">
                  {row?.webhookHistory?.numberOfTimeCall} Events{" "}
                  {row?.webhookHistory?.numberOfTimeError} Errors
                </TableCell>
                <TableCell align="left">
                  {dayjs(row?.latestEvent).format(
                    clientSettings?.defaultDateTimeFormat || "DD.MM.YYYY hh.mm"
                  )}{" "}
                </TableCell>
                <TableCell align="left">
                  {" "}
                  <IsActiveCheckBox rowId={row._id} checked={row.isActive} />
                </TableCell>
                <TableCell align="left">
                  <Box
                    width={"100%"}
                    sx={{ display: "flex", flexDirection: "row" }}
                  >
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ border: "1px solid lightgrey" }}
                      onClick={() =>
                        navigate(`${APP_ROUTES.integrationSetting}/${row._id}`)
                      }
                    >
                      <Translations text={"SETTINGS"} />
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ ml: 2, border: "1px solid lightgrey" }}
                      onClick={() =>
                        navigate(`${APP_ROUTES.integrationHistory}/${row._id}`)
                      }
                    >
                      <Translations text={"HISTORY"} />
                    </Button>
                  </Box>
                </TableCell>

                <TableCell
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setCurrentRowId(row?._id);
                    setShowDialog(true);
                  }}
                  align="left"
                >
                  <Icon icon="mdi:rubbish-bin" />
                </TableCell>
              </>
            );
          }}
        />

        {showDialog && (
          <WarningDialog
            content="Are you sure you want to delete current integration?"
            isLoading={isDeleting}
            setShow={setShowDialog}
            onConfirm={() => {
              if (currentRowId) {
                handleDeleteIntegration(currentRowId);
              }
            }}
            show={showDialog}
          />
        )}
      </Card>
    </Box>
  );
};
export default IntegrationTable;

const headCells: ColumnsProps[] = [
  {
    id: "name",
    label: "Name",
  },
  {
    id: "eventsPast7Days",
    label: "EVENTS PAST 7 DAYS",
  },
  {
    id: "latestEvent",
    label: "LATEST EVENT",
  },
  {
    id: "active",
    label: "ACTIVE",
  },

  {
    id: "",
    label: "",
  },
  {
    id: "",
    label: "",
  },
];
