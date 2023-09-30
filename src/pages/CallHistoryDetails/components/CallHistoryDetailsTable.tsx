import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Card, TableCell, Typography } from "@mui/material";

import PaginatedTable, {
  Order,
  ColumnsProps,
} from "../../../@core/components/PaginatedTable";
import { useGetCallHistoryServiceQuery } from "../../../store/services";
import CallStatus from "../../../@core/components/callStatus";

const CallHistoryDetailsTable = () => {
  const { callId } = useParams();

  const [order, setOrder] = useState<Order>("asc");
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [pageOffSet, setPageOffSet] = useState<number>(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState<string>("firstName");

  const { data, isFetching: isLoading } = useGetCallHistoryServiceQuery({
    limit,
    offset: pageOffSet,
    searchQuery: "",
    order: order === "asc" ? 1 : -1,
  });

  //@ts-ignore
  const callHistory: ICallHistory[] = data?.data?.list || [];

  const currentHistory = callHistory?.find((item) => item?._id === callId);

  useEffect(() => {
    setOffset(0);
    setPageOffSet(0);
  }, [order]);

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
        showPagination
        setSelected={setSelected}
        selected={selected}
        page={offset}
        rowsPerPage={limit}
        items={currentHistory?.callAttemptedByUsers}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        setOrder={setOrder}
        order={order}
        setOrderBy={setOrderBy}
        orderBy={orderBy}
        renderBody={(row: any, index) => {
          return (
            <>
              <TableCell width="180px" component="th" align="center">
                <Typography variant="subtitle2">
                  {row?.firstName || "Unknown User"}
                </Typography>
              </TableCell>
              <TableCell width="300px" component="th" align="center">
                <Typography variant="subtitle2" color="text.primary">
                  {/* {row?.callStatus} */}
                  <CallStatus callstatusValue={row?.callStatus} />
                </Typography>
              </TableCell>
              <TableCell width="150px" component="th" align="center">
                <Typography variant="subtitle2" color="text.primary">
                  {row?.priority}
                </Typography>
              </TableCell>
              <TableCell component="th" align="center"></TableCell>
            </>
          );
        }}
        count={0}
      />
    </Card>
  );
};

export default CallHistoryDetailsTable;

const headCells: ColumnsProps[] = [
  {
    id: "user",
    label: "USER",
    direction: "center",
  },
  {
    id: "Status",
    label: "STATUS",
    direction: "center",
  },
  {
    id: "priority",
    label: "PRIORITY",
    direction: "center",
  },
  {
    id: "",
    label: "",
  },
];
