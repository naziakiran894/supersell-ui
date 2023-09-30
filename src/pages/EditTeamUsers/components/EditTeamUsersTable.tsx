import { useState } from "react";
import {
  Switch,
  TableCell,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  FormHelperText,
} from "@mui/material";

import EditTeamUsersHead from "./EditTeamUsersHeader";
import PaginatedTable, {
  ColumnsProps,
} from "../../../@core/components/PaginatedTable";

import { ISelectedUser, ITeamUserType } from "..";
import { Order } from "../../../@core/components/paginated-table copy";
import Translations from "../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";

interface ITableData {
  teamUser: ITeamUserType[];
  setTeamUsers: React.Dispatch<React.SetStateAction<ITeamUserType[]>>;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  offset: number;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  query: string;
  pageOffSet: number;
  setPageOffSet: React.Dispatch<React.SetStateAction<number>>;
  totalCount: number;
  isLoading: boolean;
  setUpdatedData: React.Dispatch<React.SetStateAction<ITeamUserType[]>>;
  updatedData: ITeamUserType[];
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
  order: Order;
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
  orderBy: string;
  isTouch: boolean;
  setIsTouch: React.Dispatch<React.SetStateAction<boolean>>
}

const UserTable = ({
  teamUser,
  setTeamUsers,
  setOffset,
  offset,
  limit,
  setLimit,
  setQuery,
  query,
  pageOffSet,
  setPageOffSet,
  totalCount,
  isLoading,
  updatedData,
  setUpdatedData,
  setOrder,
  order,
  setOrderBy,
  orderBy,
  isTouch,
  setIsTouch,
}: ITableData) => {
  const [selected, setSelected] = useState<string[]>([]);
  const { t } = useTranslation();

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

  const handleSetUserPriority = (e: any, row: ITeamUserType) => {
    const cIndex = teamUser.findIndex((r: ITeamUserType) => r._id === row._id);
    const newUpdateData = [...updatedData];

    const rowIndex = newUpdateData.findIndex(
      (r: ITeamUserType) => r._id === row._id
    );

    if (rowIndex !== -1) {
      newUpdateData[rowIndex] = {
        ...newUpdateData[rowIndex],
        priority: e.target.value,
      };
    } else {
      newUpdateData.push({ ...row, priority: e.target.value });
    }

    if (cIndex !== -1) {
      const newData = [...teamUser];
      const updatedUser = { ...newData[cIndex], priority: e.target.value };
      newData[cIndex] = updatedUser;
      setTeamUsers(newData);
    }
    setUpdatedData(newUpdateData);
  };

  const handleUpdateUserStatus = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: ITeamUserType,
    cIndex: number
  ) => {
    const newData = [...teamUser];
    const newUpdateData = [...updatedData];

    const rowIndex = newUpdateData.findIndex(
      (r: ITeamUserType) => r._id === row._id
    );

    if (rowIndex !== -1) {
      newUpdateData[rowIndex] = {
        ...newUpdateData[rowIndex],
        belongsToTeam: e.target.checked,
      };
    } else {
      newUpdateData.push({ ...row, belongsToTeam: e.target.checked });
    }

    if (cIndex !== -1) {
      const updatedUser = {
        ...newData[cIndex],
        belongsToTeam: e.target.checked,
      };
      newData[cIndex] = updatedUser;

      setTeamUsers(newData);
    }
    setUpdatedData(newUpdateData);
  };

  return (
    <Grid container>
      <Card sx={{ maxWidth: "1000px", width: "100%" }}>
        <Grid item md={12} sm={5} xs={5}>
          <EditTeamUsersHead setValue={setQuery} value={query} />
        </Grid>
        <Grid item md={12}>
          <PaginatedTable
            id="name"
            hasCheckBox={false}
            columns={headCells}
            items={teamUser}
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
            setOrder={setOrder}
            order={order}
            setOrderBy={setOrderBy}
            orderBy={orderBy}
            renderBody={(row: any, index) => {
              const updatedIndex = updatedData?.findIndex(
                (r: ITeamUserType) => r._id === row._id
              );
              return (
                <>
                  <TableCell
                    sx={{ minWidth: 150 }}
                    component="th"
                    id={"labelId"}
                    scope="row"
                    align="center"
                    padding="none"
                  >
                    <FormControl
                      error={Boolean(
                        isTouch && !updatedData[updatedIndex]?.priority && !row?.priority
                      )}
                      sx={{ width: "125px" }}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        <Translations text="Priority" />
                      </InputLabel>
                      <Select
                        label={t("Priority")}
                        value={
                          updatedIndex !== -1
                            ? updatedData[updatedIndex].priority || ""
                            : row?.priority || ""
                        }
                        onChange={(e) => {
                          handleSetUserPriority(e, row);
                        }}
                        id="demo-simple-select-outlined"
                        labelId="demo-simple-select-outlined-label"
                      >
                        {Array(10)
                          .fill("")
                          .map((e, i) => {
                            return (
                              <MenuItem key={i} value={i + 1}>
                                {i + 1}
                              </MenuItem>
                            );
                          })}
                      </Select>{
                        Boolean(
                         isTouch && !updatedData[updatedIndex]?.priority && !row?.priority
                        ) && <FormHelperText>Required</FormHelperText>
                      }
                    
                    </FormControl>
                  </TableCell>
                  <TableCell align="left" sx={{ minWidth: 200 }}>
                    {(row?.firstName || "") + " " + (row?.lastName || "")}
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 100 }}>
                    <MuiSwitch
                      checked={
                        updatedIndex !== -1
                          ? updatedData[updatedIndex]?.belongsToTeam || false
                          : row?.belongsToTeam || false
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleUpdateUserStatus(e, row, index);
                      }}
                    />
                  </TableCell>
                  <TableCell align="left" sx={{ minWidth: 200 }}>
                    {row.phone}
                  </TableCell>
                </>
              );
            }}
          />
        </Grid>
      </Card>
    </Grid>
  );
};

const headCells: ColumnsProps[] = [
  {
    id: "priority",
    label: "PRIORITY",
    direction: "center",
  },
  {
    id: "users",
    label: "USERS",
  },
  {
    id: "belongsToTeam",
    label: "BELONGS TO TEAM",
    direction: "center",
  },
  {
    id: "phone",
    label: "PHONE",
  },
];

export default UserTable;

interface ISwitchProp {
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  checked: boolean;
}
const MuiSwitch = ({ onChange, checked }: ISwitchProp) => {
  return (
    <>
      <Switch checked={checked} onChange={onChange} />
      {checked ? "Yes" : "No"}
    </>
  );
};
