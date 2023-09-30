import { Link, useNavigate, useParams } from "react-router-dom";
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
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import PaginatedTable, {
  Order,
  ColumnsProps,
} from "../../../@core/components/PaginatedTable";

import { useGetCallHistoryServiceQuery } from "../../../store/services";
import { ICallHistory } from "../../../store/types/callHistory.types";
import dayjs from "dayjs";
import CallStatus from "../../../@core/components/callStatus";

const CallHistoryTable = () => {
  const { callId } = useParams();

  const clientSettings = useSelector(
    (state: RootState) => state.clientSetting.ClientSetting
  );

  const [order, setOrder] = useState<Order>("asc");
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [pageOffSet, setPageOffSet] = useState<number>(0);
  const [selected, setSelected] = useState<string[]>([]);

  const { data, isFetching: isLoading } = useGetCallHistoryServiceQuery({
    limit,
    offset: pageOffSet,
    searchQuery: "",
    order: order === "asc" ? 1 : -1,
  });

  //@ts-ignore
  const callHistory: ICallHistory[] = data?.data?.list || [];

  const currentHistory =
    callHistory?.find((item) => item?._id === callId) || [];

  useEffect(() => {
    setOffset(0);
    setPageOffSet(0);
  }, [order]);

  // const downloadUrl = data?.downloadUrl;

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

  return (
    <Card>
      <PaginatedTable
        id="name"
        hasCheckBox={false}
        columns={headCells}
        items={[currentHistory]}
        showPagination={false}
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
        renderBody={(row: ICallHistory, index) => {
          return (
            <>
              <TableCell width="100px" component="th" align="center">
                {row.callDirection === "outbound" ? (
                  <Icon color="secondary" icon="mdi:arrow-top-right" />
                ) : (
                  <Icon icon="mdi:arrow-bottom-left" />
                )}
              </TableCell>
              <TableCell width="250px" component="th" align="left">
                <Typography variant="subtitle2" color="text.primary">
                  {" "}
                  {dayjs(row?.updatedAt).format(
                    clientSettings?.defaultDateTimeFormat || "DD.MM.YYYY hh.mm"
                  )}
                </Typography>
              </TableCell>
              <TableCell width="200px" component="th" align="left">
                <Typography variant="body1" color="text.primary">
                  {/* {row?.callStatus} */}
                  <CallStatus callstatusValue={row?.callStatus} />
                </Typography>
              </TableCell>
              <TableCell width="250px" component="th" align="left">
                <Typography variant="body1" color="text.primary">
                  {row?.callHistorySource}
                </Typography>
              </TableCell>
              <TableCell width="200px" component="th" align="left">
                <Typography variant="body1" color="text.primary">
                  {row.leadName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {row.leadPhone}
                </Typography>
              </TableCell>
              <TableCell component="th" align="center">
                <Typography variant="body1" color="text.primary">
                  {row.callerName || ''}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {row?.teamName}
                </Typography>
              </TableCell>
            </>
          );
        }}
        count={0}
      />
    </Card>
  );
};

export default CallHistoryTable;

const headCells: ColumnsProps[] = [
  {
    id: "",
    label: "",
  },
  {
    id: "dateAndTime",
    label: "DATE & TIME",
    direction: "left",
    hideSortIcon: true,
  },
  {
    id: "status",
    label: "STATUS",
    direction: "left",
    hideSortIcon: true,
  },
  {
    id: "from",
    label: "FROM",
    direction: "left",
    hideSortIcon: true,
  },
  {
    id: "lead",
    label: "LEAD",
    direction: "left",
    hideSortIcon: true,
  },
  {
    id: "userTeam",
    label: "USER & TEAM",
    hideSortIcon: true,
    direction: "center",
  },
  {
    id: "",
    label: "",
  },
];
