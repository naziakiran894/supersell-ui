import { useState, useEffect } from "react";
import { Card, TableCell, Button } from "@mui/material";
import Icon from "../../@core/components/icon";
import PaginatedTable, {
  ColumnsProps,
  Order,
} from "../../@core/components/PaginatedTable";
import WarningDialog from "../../@core/components/warningDialog/WarningDialog";
import { useSnackbar } from "notistack";
import { IUser } from "../../store/types/user.types";
import AddUserDialog from "./components/AddUserDialog/AddUserDialog";
import { useNavigate } from "react-router-dom";
import TableHeader from "./components/TableHeader";
import APP_ROUTES from "../../Routes/routes";
import {
  useGetUserListQuery,
  useDeleteUserMutation,
} from "../../store/services";
import { userTypes } from "../../store/types/globalTypes";
import DoNotDisturbCheckBox from "./components/DoNotDistrubCheckBox/CheckBox";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import useDebounce from "../../hooks/useDebounce";
import Translations from "../../@core/layouts/Translations";

const TeamsList = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [pageOffSet, setPageOffSet] = useState<number>(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [show, setShow] = useState<boolean>(false);
  const [currentUserData, setCurrentData] = useState<IUser | null>();
  const [showDialog, setShowDeleteDialog] = useState(false);
  const [currentRowId, setCurrentRowId] = useState("");
  const [name, setName] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("firstName");

  const user = useSelector((state: RootState) => state.auth.user);
  const debouncedSearchTerm = useDebounce(query, 500);

  const { data, isLoading, isFetching, refetch } = useGetUserListQuery({
    limit,
    offset: pageOffSet,
    searchQuery: debouncedSearchTerm.length >= 2 ? query : "",
    order: order === "asc" ? 1 : -1,
    sort: orderBy,
  });

  const [
    handleDeleteUser,
    { isLoading: isDeleting, error, isSuccess: isDeleted },
  ] = useDeleteUserMutation();

  //@ts-ignore
  const users: IUser[] = data?.data.list;

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
      enqueueSnackbar(<Translations text="User deleted successfully" />, {
        variant: "success",
      });
    } else if (error) {
      enqueueSnackbar(<Translations text="Something went wrong!" />, {
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
    <Card>
      <TableHeader setValue={setQuery} value={query} />
      <PaginatedTable
        id="name"
        hasCheckBox
        columns={headCells}
        items={users}
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
        renderBody={(row: IUser, index) => {
          return (
            <>
              <TableCell
                key={index}
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
                    ((user?.roleName === userTypes.ADMIN ||
                      user?.roleName === userTypes.LOGIN_AS_CLIENT) &&
                      userTypes.SUPER_ADMIN !== row.role) ||
                    user?.roleName === userTypes.SUPER_ADMIN
                    || user?.loginAsClient
                  )
                    setShow(true);
                  setCurrentData(row);
                }}
              >
                {row.firstName} {row.lastName}
              </TableCell>

              <TableCell align="left" sx={{ minWidth: 200 }}>
                {row.email}
              </TableCell>
              <TableCell align="left" sx={{ minWidth: 100 }}>
                {row.phone}
              </TableCell>
              <TableCell
                align="center"
                sx={{ minWidth: 150, textTransform: "capitalize" }}
              >
                {row.role}
              </TableCell>
              <TableCell align="center" sx={{ minWidth: 150 }}>
                {row.available === true ? (
                  <Icon icon="mdi:success-circle" style={{ color: "green " }} />
                ) : (
                  <Icon icon="mdi:clear-circle" style={{ color: "red" }} />
                )}
              </TableCell>

              <TableCell align="center" sx={{ minWidth: 180 }}>
                <DoNotDisturbCheckBox
                  rowId={row._id}
                  checked={row.doNotDisturbStatus}
                />
              </TableCell>
              <TableCell align="right">
                {row.role !== userTypes.SUPER_ADMIN && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ border: "1px solid lightgrey" }}
                    onClick={() =>
                      navigate(`${APP_ROUTES.schedule}/${row._id}`)
                    }
                  >
                    <Translations text="SCHEDULE" />
                  </Button>
                )}
              </TableCell>
              <TableCell sx={{ cursor: "pointer" }} align="left">
                {row.role !== userTypes.SUPER_ADMIN && (
                  <Icon
                    icon="mdi:rubbish-bin"
                    onClick={() => {
                      setShowDeleteDialog(true);
                      setCurrentRowId(row._id);
                      setName(row?.firstName + " " + row?.lastName);
                    }}
                  />
                )}
              </TableCell>
            </>
          );
        }}
      />

      <AddUserDialog
        setShow={setShow}
        show={show}
        userId={currentUserData?._id}
      />

      <WarningDialog
        isLoading={isDeleting}
        setShow={setShowDeleteDialog}
        onConfirm={() => {
          if (currentRowId) {
            handleDeleteUser({ id: currentRowId });
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
    id: "firstName",
    label: "NAME",
  },
  {
    id: "email",
    label: "EMAIL",
  },
  {
    id: "phone",
    label: "PHONE",
    hideSortIcon: true,
  },
  {
    id: "role",
    label: "ROLE",
    direction: "center",
  },
  {
    id: "available",
    label: "AVAILABLE",
    direction: "center",
  },
  {
    id: "doNotDisturbStatus",
    label: "DO NOT DISTURB",
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
