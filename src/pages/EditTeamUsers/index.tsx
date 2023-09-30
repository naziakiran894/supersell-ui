import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import Tabs from "./components/Tabs";
import PaginatedTable, { Order } from "../../@core/components/PaginatedTable";

import {
  useGetTeamUsersQuery,
  useUpdateTeamUsersMutation,
} from "../../store/services";
import { useGetAllTeamsQuery } from "../../store/services";
import { ITeam, ITeamUsers } from "../../store/types/team.types";
import useDebounce from "../../hooks/useDebounce";

import PageLoader from "../../@core/components/loader/PageLoader";
import { useSnackbar } from "notistack";
import UserTable from "./components/EditTeamUsersTable";
import { ITeamList } from "../../store/types/team.types";
import Translations from "../../@core/layouts/Translations";

export interface ITeamUserType {
  firstName: string;
  lastName: string;
  phone: string;
  priority: string;
  teamUser: any[];
  user: any;
  _id: string;
  belongsToTeam: boolean;
}

export interface ISelectedUser {
  userId: string;
  belongsToTeam?: boolean;
  priority: string;
}

const Users = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const urlParams = new URLSearchParams(window.location.search);
  const companyId = urlParams.get("companyId");

  const [teamDetails, setTeamDetails] = useState<Partial<ITeam>>({});
  const [teamUser, setTeamUsers] = useState<ITeamUserType[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [pageOffSet, setPageOffSet] = useState<number>(0);
  const [query, setQuery] = useState("");
  const [teamName, setTeamName] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("firstName");
  const [isTouch, setIsTouch] = useState<boolean>(false);

  const [updateData, setUpdatedData] = useState<ITeamUserType[]>([]);
  const [allTeamUsers, setAllTeamUsers] = useState(false);

  const debouncedSearchTerm = useDebounce(query, 500);

  const {
    data,
    isLoading: isLoadingData,
    isFetching,
    refetch,
  } = useGetTeamUsersQuery({
    teamId,
    companyId: companyId ? companyId : "",
    limit,
    order: order === "asc" ? 1 : -1,
    sort: orderBy,
    offset: pageOffSet,
    searchQuery: debouncedSearchTerm.length >= 2 ? query : "",
  });

  const [handleUpdateUser, { isLoading, isSuccess, error }] =
    useUpdateTeamUsersMutation();

  //@ts-ignore
  const teamData: ITeamUsers = data?.data?.list;
  //@ts-ignore
  const totalCount = data?.data?.totalCount;
  const { data: teamsdata } = useGetAllTeamsQuery("");
  //@ts-ignore
  const teams: ITeamList[] = teamsdata?.data;

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(
        <Translations text={"Team users updated successfully."} />,
        {
          variant: "success",
        }
      );
      refetch();
    } else if (error) {
      enqueueSnackbar(<Translations text={"Something went wrong!"} />, {
        variant: "error",
      });
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (teamData?.team?._id) {
      setTeamDetails(teamData?.team);
    }
    if (teamData?.teamUsers) {
      setTeamUsers(
        teamData?.teamUsers?.map((e: any) => {
          return {
            ...e,
            belongsToTeam: e?.user?.belongsToTeam || false,
            priority: e?.user?.priority || "",
          };
        })
      );
    }
  }, [teamData]);


  const handleUpdate = () => {
    setIsTouch(true);
    const newArray = teamUser?.map((item) => {
      const userIndex = updateData?.findIndex((e) => e._id === item._id);

      if (userIndex !== -1) {
        return updateData[userIndex];
      } else {
        return item;
      }
    });

    const hasPriorityInEveryIndex = newArray?.every((e) => "priority" in e && e.priority);

    if (teamId && hasPriorityInEveryIndex) {
      const payload = {
        teamId: teamId,
        callRecording: teamDetails.callRecording,
        callRoutingType: teamDetails.callRoutingType,
        addAllUsers: allTeamUsers,
        teamUsers: updateData.map((e) => ({
          userId: e._id,
          belongsToTeam: e.belongsToTeam,
          priority: e.priority,
        })),
      };

      handleUpdateUser(payload);
    }
  };

  if (isLoadingData) {
    return <PageLoader />;
  }

  return (
    <Grid container display="flex" flexDirection="column" gap={6}>
      <Grid item xs={12} display="flex" flexDirection="column" gap={4}>
        <Typography variant="h4">
          <Translations text={"Users"} />
        </Typography>
        <Typography variant="h5" sx={{ color: " gray" }}>
          {teamDetails?.teamName || ""}
        </Typography>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-outlined-label">
            <Translations text="Use same settings as team" />
          </InputLabel>
          <Select
            label="Use same settings as team"
            id="demo-simple-select-outlined"
            labelId="demo-simple-select-outlined-label"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value as string)}
            sx={{ maxWidth: "400px" }}
          >
            <MenuItem value="">None</MenuItem>
            {teams?.map((item, index) => (
              <MenuItem key={index} value={item._id}>
                {item.teamName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} display="flex" flexDirection="column" gap={4}>
        <Typography variant="h6">
          <Translations text="Call Routing" />
        </Typography>
      </Grid>
      <Box>
        <Tabs
          teamDetails={teamDetails}
          setAllTeamUsers={setAllTeamUsers}
          teamAllUsers={allTeamUsers}
          setTeamDetails={setTeamDetails}
        />
      </Box>
      <UserTable
        teamUser={teamUser}
        setTeamUsers={setTeamUsers}
        setLimit={setLimit}
        limit={limit}
        offset={offset}
        setOffset={setOffset}
        setPageOffSet={setPageOffSet}
        pageOffSet={pageOffSet}
        totalCount={totalCount}
        setQuery={setQuery}
        query={query}
        isLoading={isFetching}
        setUpdatedData={setUpdatedData}
        updatedData={updateData}
        setOrder={setOrder}
        order={order}
        setOrderBy={setOrderBy}
        orderBy={orderBy}
        isTouch={isTouch}
        setIsTouch={setIsTouch}
      />

      <Grid sx={{ display: "flex", gap: "5px", margin: "40px 0px" }}>
        <Button disabled={isLoading} variant="contained" onClick={handleUpdate}>
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            <Translations text={"Save Changes"} />
          )}
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          <Translations text="Cancel" />
        </Button>
      </Grid>
    </Grid>
  );
};

export default Users;
