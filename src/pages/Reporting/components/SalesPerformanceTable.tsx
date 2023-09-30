import { useEffect, useState } from "react";
import { TableCell, Card, Box, Typography } from "@mui/material";
import PaginatedTable, {
  ColumnsProps,
  Order,
} from "../../../@core/components/paginated-table copy";
import SalesPerformanceHeader from "../components/SalesPerformanceHeader";
import { useGetAllLeadSourcePerformanceQuery } from "../../../store/services";

interface LeadSourcePerformance {
  _id: string;
  integrationName: string;
  totalLeads: number;
  totalConnectedLeads: number;
  totalLeadMeetings: number;
  conversationPercentage: number;
  meetingConversationPercentage: number;
  offers: number;
  deals: number;
}

const IntegrationTable = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [currentUserData, setCurrentData] = useState<any>();
  const [order, setOrder] = useState<Order>("asc");
  const [pageOffSet, setPageOffSet] = useState<number>(0);
  const [orderBy, setOrderBy] = useState<string>("firstName");
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const { data, isLoading, isFetching, refetch } =
    useGetAllLeadSourcePerformanceQuery({
      limit,
      offset: pageOffSet,
      order: order === "asc" ? 1 : -1,
      sort: orderBy,
    });

  //@ts-ignore
  // const data = data?.data;
  console.log(data, "apidata");

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

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card>
      <SalesPerformanceHeader
        toggle={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleFilter={function (val: string): void {
          throw new Error("Function not implemented.");
        }}
        value={""}
      />
      <PaginatedTable
        id="name"
        hasCheckBox={false}
        columns={headCells}
        //@ts-ignore
        items={Array.isArray(data?.data) ? data?.data : []}
        showPagination
        setSelected={setSelected}
        selected={selected}
        isLoading={isLoading}
        page={offset}
        //@ts-ignore
        count={data?.data?.totalCount}
        rowsPerPage={limit}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[10, 50, 100]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        setOrder={setOrder}
        order={order}
        setOrderBy={setOrderBy}
        orderBy={orderBy}
        renderBody={(row: LeadSourcePerformance, index) => {
          return (
            <>
              <TableCell
                key={index}
                component="th"
                scope="row"
                sx={{ cursor: "pointer", textAlign: "center" }}
                onClick={() => {
                  setShow(true);
                  setCurrentData(row);
                }}
              >
                {row?.integrationName}
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                {row?.totalLeads}
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                <Box display="flex" justifyContent="space-around" columnGap={5}>
                  <Typography>{row?.totalConnectedLeads}</Typography>
                  <Typography>
                    {Math.floor(row.conversationPercentage)}%
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                <Box display="flex" justifyContent="space-around" columnGap={5}>
                  <Typography>{row?.totalLeadMeetings}</Typography>
                  <Typography>
                    {Math.floor(row.meetingConversationPercentage)}%
                  </Typography>
                </Box>
              </TableCell>

              <TableCell align="left">
                <Box
                  display="flex"
                  justifyContent="space-around"
                  columnGap={10}
                >
                  <Typography> </Typography>
                  <Typography>{Math.floor(row.offers)}%</Typography>
                  <Typography> </Typography>
                </Box>
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                {/* {row?.Items.length -1? color:black:""} */}
                <Box
                  display="flex"
                  justifyContent="space-around"
                  columnGap={10}
                >
                  <Typography> </Typography>
                  <Typography>{Math.floor(row.deals)}%</Typography>
                  <Typography> </Typography>
                </Box>
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                {""}
              </TableCell>
            </>
          );
        }}
      />
    </Card>
  );
};
export default IntegrationTable;

const headCells: ColumnsProps[] = [
  {
    id: "user",
    direction: "center",
    label: "USER",
  },
  {
    id: "leads",
    direction: "center",
    label: "LEADS",
  },
  {
    id: "conversations",
    direction: "center",
    label: "CONVERSATIONS",
    subtitle: ["#", "%"],
  },
  {
    id: "meetings",
    direction: "center",
    label: "MEETINGS",
    subtitle: ["#", "%(PREVIOUS)"],
  },
  {
    id: "offers",
    direction: "center",
    label: "OFFERS",
    subtitle: ["#", "%(PREVIOUS)", " €"],
  },
  {
    id: "deals",
    direction: "center",
    label: "DEALS",
    subtitle: ["#", "%(PREVIOUS)", " €"],
  },
  {
    id: "empty",
    label: "",
  },
];
