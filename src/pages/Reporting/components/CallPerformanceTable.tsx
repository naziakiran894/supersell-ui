import { useState } from "react";
import { TableCell, Card } from "@mui/material";
import PaginatedTable, {
  ColumnsProps,
} from "../../../@core/components/paginated-table copy";
import CallPerformanceHeader from "./CallPerformanceHeader";

interface UserCallRecord {
  USER: string;
  Calls: number;
  "# Missed calls": number;
  "Missed calls %": string;
  "avg. response time": string;
  "avg. call duration": string;
}

const userCallRecords: UserCallRecord[] = [
  {
    USER: "Sam Smith",
    Calls: 30,
    "# Missed calls": 5,
    "Missed calls %": "17%",
    "avg. response time": "1m 22s",
    "avg. call duration": "3m 55s",
  },
  {
    USER: "Total",
    Calls: 30,
    "# Missed calls": 5,
    "Missed calls %": "17%",
    "avg. response time": "1m 22s",
    "avg. call duration": "3m 55s",
  },
];

const IntegrationTable = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [currentUserData, setCurrentData] = useState<any>();

  //@ts-ignore

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card>
      <CallPerformanceHeader
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
        items={userCallRecords}
        showPagination
        setSelected={setSelected}
        selected={selected}
        // isLoading={isLoading}
        page={page}
        // count={count}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[10, 50, 100]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        renderBody={(row: UserCallRecord, index) => {
          return (
            <>
              <TableCell
                component="th"
                scope="row"
                sx={{ cursor: "pointer", textAlign: "center" }}
                onClick={() => {
                  setShow(true);
                  setCurrentData(row);
                }}
              >
                {row.USER}
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                {row.Calls}
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                {" "}
                {row["# Missed calls"]}
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                {" "}
                {row["Missed calls %"]}
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                {row["avg. response time"]}
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                {row["avg. call duration"]}
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                {""}
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                {""}
              </TableCell>
            </>
          );
        }}
        count={0}
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
    id: "calls",
    direction: "center",
    label: "CALLS",
  },
  {
    id: "missedCalls",
    direction: "center",
    label: "# MISSED CALLS",
  },
  {
    id: "missedCalls",
    direction: "center",
    label: "MISSED CALLS %",
  },
  {
    id: "responseTime",
    direction: "center",
    label: "AVG. RESPONSE TIME",
  },
  {
    id: "callDuration",
    direction: "center",
    label: "AVG. CALL DURATION",
  },

  {
    id: "empty",
    label: "",
  },

  {
    id: "empty",
    label: "",
  },
];
