import { useState, useEffect } from "react";
import { TableCell, Button, Card, Typography } from "@mui/material";
import useDebounce from "../../hooks/useDebounce";
import { styled } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";
import Icon from "../../@core/components/icon";
import PaginatedTable, {
  ColumnsProps,
  Order,
} from "../../@core/components/PaginatedTable";
import TeamsHeader from "./components/TeamsHeader";
import {
  useDeleteTeamMutation,
  useGetTeamListQuery,
} from "../../store/services";
import WarningDialog from "../../@core/components/warningDialog/WarningDialog";
import { IPartialUser, ITeam } from "../../store/types/team.types";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { userTypes } from "../../store/types/globalTypes";
import { useNavigate } from "react-router";
import APP_ROUTES from "../../Routes/routes";
import AddTeamDialog from "./components/addTeam/AddTeamDialog";
import DoNotDisturbCheckBox from "./components/DoNotDisturbCheckbox";
import Translations from "../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";

const AvailableChip = styled(Box)({
  padding: "3px 10px",
  textAlign: "center",
  background:
    "linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #4CAF50",
  color: "#56CA00",
  borderRadius: "16px",
});

const UnAvailableChip = styled(Box)({
  padding: "3px 10px",
  textAlign: "center",
  background:
    "linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #ca0000",
  color: "#ca0000",
  borderRadius: "16px",
});

const TeamsList = () => {
  const [offSet, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState("");
  const [show, setShow] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [currentRowId, setCurrentRowId] = useState("");
  const [pageOffSet, setPageOffSet] = useState(0);
  const [currentTeamData, setCurrentData] = useState<ITeam | null>();
  const [name, setName] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const debouncedSearchTerm = useDebounce(query, 500);
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("firstName");
  const { t } = useTranslation();

  const user = useSelector((state: RootState) => state.auth.user);
  const permissions = useSelector(
    (state: RootState) => state?.permissions?.Permissions
  );

  const { data, isFetching, refetch } = useGetTeamListQuery({
    offset: pageOffSet,
    limit: limit,
    order: order === "asc" ? 1 : -1,
    sort: orderBy,
    searchQuery: debouncedSearchTerm.length >= 2 ? query : "",
  });

  const [handleDeleteTeam, { isLoading: isDeleting, isSuccess: isDeleted }] =
    useDeleteTeamMutation();

  //@ts-ignore
  const teamList: ITeam[] = data?.data?.list;
  //@ts-ignore
  const totalCount = data?.data?.totalCount;

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isDeleted) {
      setShowDialog(false);
      enqueueSnackbar(<Translations text="Deleted Successfully" />, {
        variant: "success",
      });
    }
  }, [isDeleted]);

  const handleChangePage = (event: unknown, newPage: number) => {
    const add = newPage > offSet;
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
    <Card>
      <TeamsHeader setValue={setQuery} value={query} />
      <PaginatedTable
        id="name"
        hasCheckBox
        columns={headCells}
        items={teamList}
        showPagination
        setSelected={setSelected}
        selected={selected}
        isLoading={isFetching}
        page={offSet}
        count={totalCount}
        rowsPerPage={limit}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        setOrder={setOrder}
        order={order}
        setOrderBy={setOrderBy}
        orderBy={orderBy}
        renderBody={(row: ITeam, index) => {
          return (
            <>
              <TableCell
                key={row._id}
                component="th"
                scope="row"
                sx={{
                  minWidth: 150,
                  cursor: "pointer",
                  "&:hover": {
                    color: "purple",
                    textDecorationLine: "underline",
                    textDecorationColor: "purple",
                  },
                }}
                onClick={() => {
                  setShow(true);
                  setCurrentData(row);
                }}
              >
                <Typography
                  sx={{ fontWeight: "400", fontSize: "14px", color: "#3A3541" }}
                  variant="body1"
                >
                  {row.teamName}
                </Typography>
              </TableCell>
              <TableCell align="left" sx={{ minWidth: 200 }}>
                {row?.users &&
                  row?.users?.map((e: IPartialUser, i: number) => {
                    return (
                      <span key={e._id}>
                        {e?.firstName}{" "}
                        {row?.users?.length &&
                          row?.users?.length - 1 !== i &&
                          ", "}
                      </span>
                    );
                  })}
              </TableCell>
              <TableCell align="left">
                {row.available ? (
                  <AvailableChip>
                    <Translations text="Online" />
                  </AvailableChip>
                ) : (
                  <UnAvailableChip>
                    <Translations text="Offline" />
                  </UnAvailableChip>
                )}
              </TableCell>
              <TableCell align="center" sx={{ minWidth: 100 }}>
                <DoNotDisturbCheckBox
                  rowId={row._id}
                  checked={row.doNotDisturbStatus}
                />
              </TableCell>
              <TableCell align="left">
                <Box display="flex" columnGap={3}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      navigate(
                        `${APP_ROUTES.editTeamUser}/${row._id}?companyId=${row.companyId}`
                      )
                    }
                  >
                    <Translations text={"USERS"} />
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      navigate(`${APP_ROUTES.teamSchedule}/${row._id}`)
                    }
                  >
                    <Translations text={"SCHEDULE"} />
                  </Button>
                  {(user?.roleName === userTypes.SUPER_ADMIN ||
                    user?.loginAsClient === true ||
                    (permissions !== null &&
                      permissions?.["Team settings"])) && (
                    <Button
                      onClick={() =>
                        navigate(`${APP_ROUTES.teamSettings}/${row._id}`)
                      }
                      variant="outlined"
                      color="secondary"
                    >
                      <Translations text={"SETTINGS"} />
                    </Button>
                  )}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => {
                  setCurrentRowId(row._id);
                  setShowDialog(true);
                  setName(row.teamName);
                }}
                sx={{ cursor: "pointer" }}
              >
                <Icon icon="mdi:rubbish-bin" />
              </TableCell>
              <TableCell align="left">{""}</TableCell>
            </>
          );
        }}
      />

      <AddTeamDialog
        setShow={setShow}
        show={show}
        companyId={currentTeamData?._id}
      />

      <WarningDialog
        content={t("Are you sure you want to delete team?")}
        isLoading={isDeleting}
        setShow={setShowDialog}
        onConfirm={() => {
          if (currentRowId) {
            handleDeleteTeam(currentRowId);
          }
        }}
        show={showDialog}
        name={name}
      />
    </Card>
  );
};
export default TeamsList;

const headCells: ColumnsProps[] = [
  {
    id: "teamName",
    label: "NAME",
  },
  {
    id: "users",
    label: "USERS",
    hideSortIcon: true,
  },
  {
    id: "available",
    label: "AVAILABLE",
  },
  {
    id: "doNotDisturb",
    label: "DO NOT DISTURB",
    hideSortIcon: true,
  },
  {
    id: "",
    label: "",
    hideSortIcon: true,
  },
  {
    id: "gghg",
    label: "",
    hideSortIcon: true,
  },
  {
    id: "gghg",
    label: "",
    hideSortIcon: true,
  },
];
