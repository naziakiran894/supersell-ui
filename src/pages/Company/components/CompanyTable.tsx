import { useState, useEffect } from "react";
import {
  TableCell,
  Card,
  Typography,
  Switch,
  Button,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";

import CompanyStatusCheckbox from "./CompanyActiveStatusCheckBox";
import Icon from "../../../@core/components/icon";
import PaginatedTable, {
  ColumnsProps,
} from "../../../@core/components/PaginatedTable";
import {
  useDeleteCompanyMutation,
  useGetCompanyListQuery,
  useLoginAsClientMutation,
} from "../../../store/services";
import WarningDialog from "../../../@core/components/warningDialog/WarningDialog";
import { ICompanyType } from "../../../store/types/company.types";
import { useNavigate } from "react-router";
import AddCompanyDialog from "./AddCompanyDialog";
import CompanyHeader from "./CompanyHeader";
import useDebounce from "../../../hooks/useDebounce";
import APP_ROUTES from "../../../Routes/routes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { userTypes } from "../../../store/types/globalTypes";
import { setIsLoading } from "../../../store/slices/PermissionsSlice";
import Translations from "../../../@core/layouts/Translations";

const CompanyTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [pageOffSet, setPageOffSet] = useState(0);

  const [show, setShow] = useState<boolean>(false);
  const [companyId, setCompanyId] = useState("");

  const [showDialog, setShowDialog] = useState(false);
  const [currentRowId, setCurrentRowId] = useState("");
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [showLoginDia, setShowLoginDia] = useState(false);

  const debouncedSearchTerm = useDebounce(query, 500);

  const {
    data = [],
    isLoading,
    refetch,
  } = useGetCompanyListQuery({
    offset: pageOffSet,
    limit: limit,
    query: debouncedSearchTerm.length >= 2 ? query : "",
  });

  const [
    handleDeleteLead,
    { isLoading: isDeleting, isSuccess: isDeleted, error },
  ] = useDeleteCompanyMutation();

  const [
    handleLoginAsClient,
    { isSuccess: loginSuccess, error: loginError, isLoading: isUpdating },
  ] = useLoginAsClientMutation();

  //@ts-ignore
  const loginClientError = loginError?.data?.data?.error;
  //@ts-ignore
  const companyList: ICompanyType[] = data?.data?.list;
  //@ts-ignore
  const totalCount = data?.data?.totalCount;

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isDeleted) {
      setShowDialog(false);
      enqueueSnackbar(<Translations text={"Deleted Successfully"} />, {
        variant: "success",
      });
    } else if (error) {
      enqueueSnackbar(<Translations text={"Something went wrong!"} />, {
        variant: "error",
      });
    }
  }, [isDeleted, error]);

  useEffect(() => {
    if (loginSuccess) {
      enqueueSnackbar(`You are logged in as ${name}`, { variant: "success" });
      dispatch(setIsLoading(true));
      navigate(APP_ROUTES.leads);
    } else if (loginClientError) {
      enqueueSnackbar(loginClientError, { variant: "error" });
    }
  }, [loginSuccess, loginClientError]);

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
      <CompanyHeader value={query} setValue={setQuery} />
      <PaginatedTable
        id="name"
        hasCheckBox={false}
        columns={headCells}
        items={companyList}
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
        renderBody={(row: ICompanyType, index) => {
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
                  setShow(true);
                  setCompanyId(row._id);
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#3A3541",
                    fontWeight: 500,
                  }}
                >
                  {row.companyName}
                </Typography>
              </TableCell>
              <TableCell align="left">{row.email}</TableCell>
              <TableCell align="center"> {row.phone}</TableCell>
              <TableCell align="center">{row.userCount}</TableCell>
              <TableCell align="center">
                <CompanyStatusCheckbox
                  checked={row.companyStatus}
                  rowId={row._id}
                />
              </TableCell>
              <TableCell align="center">
                <Box display="flex" columnGap={2}>
                  <Button
                    onClick={() => {
                      setCurrentRowId(row._id);
                      setShowLoginDia(true);
                      setName(row?.companyName);
                    }}
                    variant="outlined"
                    color="secondary"
                    sx={{ width: "max-content" }}
                  >
                    <Translations text={"LOGIN AS CLIENT"} />
                  </Button>
                  {/* <Button
                    onClick={() => navigate(`${APP_ROUTES.fields}/${row._id}`)}
                    variant="outlined"
                    color="secondary"
                  >
                    SETTINGS
                  </Button> */}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => {
                  setCurrentRowId(row._id);
                  setShowDialog(true);
                  setName(row?.companyName);
                }}
                sx={{ cursor: "pointer" }}
              >
                <Icon icon="mdi:rubbish-bin" />
              </TableCell>
            </>
          );
        }}
      />
      <AddCompanyDialog setShow={setShow} show={show} companyId={companyId} />

      {showDialog && (
        <WarningDialog
          content="Are you sure you want to delete client?"
          isLoading={isDeleting}
          setShow={setShowDialog}
          onConfirm={() => {
            if (currentRowId) {
              handleDeleteLead(currentRowId);
            }
          }}
          show={showDialog}
          name={name}
        />
      )}
      <WarningDialog
        content="Are you sure you want to login as client?"
        isLoading={isUpdating}
        setShow={setShowLoginDia}
        onConfirm={() => {
          if (currentRowId) {
            handleLoginAsClient(currentRowId);
          }
        }}
        buttonText="Confirm"
        show={showLoginDia}
        name={name}
      />
    </Card>
  );
};
export default CompanyTable;

const headCells: ColumnsProps[] = [
  {
    id: "client",
    label: "CLIENT",
  },
  {
    id: "email",
    label: "EMAIL",
  },
  {
    id: "primaryPhone",
    label: "PRIMARY PHONE",
    direction: "center",
  },
  {
    id: "users",
    label: "USERS",
    direction: "center",
  },
  {
    id: "active",
    label: "ACTIVE",
    direction: "center",
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
