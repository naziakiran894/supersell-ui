import { useState } from "react";
import { TableCell, Card, Box, Typography } from "@mui/material";
import PaginatedTable, {
  ColumnsProps,
} from "../../../@core/components/paginated-table copy";
import LeadSourceHeader from "./LeadSourceHeader";

interface LeadSourcePerformance {
  source: string;
  leads: number;
  conversations: {
    count: number;
    percentage: string;
  };
  meetings: {
    count: number;
    percentage: string;
    euro: string;
  };
  offers: {
    count: number;
    percentage: string;
    euro: string;
  };
  deals: {
    count: number;
    percentage: string;
    euro: string;
  };
}

const Items = [
  {
    source: "Facebook",
    leads: 30,
    conversations: {
      count: 8,
      percentage: "27%",
    },
    meetings: {
      count: 10,
      percentage: "33%",
      euro: "25 000€",
    },
    offers: {
      count: 8,
      percentage: "27%",
      euro: "25 000€",
    },
    deals: {
      count: 5,
      percentage: "17%",
      euro: "15 000€",
    },
  },
  {
    source: "Website",
    leads: 30,
    conversations: {
      count: 8,
      percentage: "27%",
    },
    meetings: {
      count: 10,
      percentage: "33%",
      euro: "25 000€",
    },
    offers: {
      count: 8,
      percentage: "27%",
      euro: "25 000€",
    },
    deals: {
      count: 5,
      percentage: "17%",
      euro: "15 000€",
    },
  },
  {
    source: "TOTAL",
    leads: 60,
    conversations: {
      count: 16,
      percentage: "27%",
    },
    meetings: {
      count: 30,
      percentage: "66%",
      euro: "50 000€",
    },
    offers: {
      count: 16,
      percentage: "27%",
      euro: "50 000€",
    },
    deals: {
      count: 5,
      percentage: "17%",
      euro: "30 000€",
    },
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
      <LeadSourceHeader
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
        items={Items}
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
        renderBody={(row: LeadSourcePerformance, index) => {
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
                {row.source}
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                {row.leads}
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                <Box display="flex" justifyContent="space-around" columnGap={5}>
                  <Typography>{row.conversations.count}</Typography>
                </Box>
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                <Box display="flex" justifyContent="space-around" columnGap={5}>
                  <Typography>{row.meetings.count}</Typography>
                  <Typography>{row.meetings.percentage}</Typography>
                  <Typography>{row.meetings.euro}</Typography>
                </Box>
              </TableCell>

              <TableCell align="left">
                <Box
                  display="flex"
                  justifyContent="space-around"
                  columnGap={10}
                >
                  <Typography>{row.offers.count}</Typography>
                  <Typography>{row.offers.percentage}</Typography>
                  <Typography>{row.offers.euro}</Typography>
                </Box>
              </TableCell>
              <TableCell align="left" sx={{ textAlign: "center" }}>
                {/* {row?.Items.length -1? color:black:""} */}
                <Box
                  display="flex"
                  justifyContent="space-around"
                  columnGap={10}
                >
                  <Typography>{row.deals.count}</Typography>
                  <Typography>{row.deals.percentage}</Typography>
                  <Typography>{row.deals.euro}</Typography>
                </Box>
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
    id: "leadSourse",
    direction: "center",
    label: "LEAD SOURCE",
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
  },
  {
    id: "meetings",
    direction: "center",
    label: "MEETINGS",
    subtitle: ["#", "%", "€"],
  },
  {
    id: "offers",
    direction: "center",
    label: "OFFERS",
    subtitle: ["#", "%", " €"],
  },
  {
    id: "deals",
    direction: "center",
    label: "DEALS",
    subtitle: ["#", "%", " €"],
  },
  {
    id: "empty",
    label: "",
  },
];
