import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

import { TableCell, Card, Box } from "@mui/material";

import IntegrationFilters from "./IntegrationFilters";
import Icon from "../../../@core/components/icon";
import PaginatedTable, {
  ColumnsProps,
  Order,
} from "../../../@core/components/PaginatedTable";
import { DateType } from "../../../@core/components/types/forms/reactDatepickerTypes";

import { useGetIntegrationHistoryQuery } from "../../../store/services";
import { integrationHistory } from "../../../store/types/integrationHistory.types";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import dayjs from "dayjs";

const IntegrationTable = () => {
  const { integrationId } = useParams();

  const dateFormat = useSelector((state: RootState) => state.clientSetting.ClientSetting?.defaultDateTimeFormat)

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [startDateRange, setStartDateRange] = useState<DateType>(null);
  const [endDateRange, setEndDateRange] = useState<DateType>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [limit, setLimit] = useState<number>(10);
  const [pageOffSet, setPageOffSet] = useState<number>(0);
  const [orderBy, setOrderBy] = useState<string>("firstName");

  const { data, isFetching } = useGetIntegrationHistoryQuery({
    limit,
    offset: pageOffSet,
    order: order === "asc" ? 1 : -1,
    sort: orderBy,
    integrationId: integrationId,
    startDate: startDateRange ? startDateRange.toString() : null,
    endDate: endDateRange ? endDateRange.toString() : null,
  });

  const textTruncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return <>{text}</>;
    } else {
      return <>{text.slice(0, maxLength)}...</>;
    }
  };

  //@ts-ignore
  const integrationHistory: integrationHistory[] = data?.data?.list;

  //@ts-ignore
  const totalCount = data?.data?.totalCount;

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
    <>
      <IntegrationFilters
        startDateRange={startDateRange}
        setEndDateRange={setEndDateRange}
        setStartDateRange={setStartDateRange}
        endDateRange={endDateRange}
      />
      <Card sx={{ mt: 5 }}>
        <PaginatedTable
          id="name"
          hasCheckBox={false}
          columns={headCells}
          items={integrationHistory}
          showPagination
          setSelected={setSelected}
          selected={selected}
          isLoading={isFetching}
          page={page}
          count={totalCount || 0}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          renderBody={(row: integrationHistory, index) => {
            return (
              <>
                <TableCell key={row._id} component="th" scope="row">
                  {dayjs(row?.createdAt).format(
                    dateFormat || "DD.MM.YYYY hh.mm"
                  )}
                </TableCell>
                <TableCell align="left"> {row?.status} </TableCell>
                <TableCell align="left">{textTruncate(row.details, 100)}</TableCell>
              </>
            );
          }}
        />
      </Card>
    </>
  );
};
export default IntegrationTable;

const headCells: ColumnsProps[] = [
  {
    id: "date&time",
    label: "DATE & TIME",
  },
  {
    id: "status",
    label: "STATUS",
  },
  {
    id: "data",
    label: "DATA",
  },

  {
    id: "",
    label: "",
  },
];
