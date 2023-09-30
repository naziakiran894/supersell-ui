import React, { useState, ChangeEvent, useMemo, MouseEvent } from "react";
import {
  Paper,
  Table,
  TableRow,
  TableHead,
  TablePagination,
  TableBody,
  TableCell,
  TableContainer,
  SxProps,
  Box,
  CircularProgress,
  TableSortLabel,
  Typography,
  Checkbox,
} from "@mui/material";
import Translations from "../../layouts/Translations";
import { useTranslation } from "react-i18next";

export interface ColumnsProps {
  id: string;
  label: string;
  direction?: "right" | "center" | "left";
  colSpan?: number;
  sx?: SxProps;
  hideSortIcon?: boolean;
  subtitle?: string;
}
export type Order = "asc" | "desc";

type PaginatedTableProps<T> = {
  id: string;
  items: any;
  columns: ColumnsProps[];
  checkAll?: boolean;
  isLoading?: boolean;
  renderBody: (item: T, index: number) => React.ReactNode;
  showPagination?: boolean;
  hasCheckBox?: boolean;
  setSelected: any;
  selected: string[];
  page: number;
  count: number;
  rowsPerPage: number;
  order?: Order;
  setOrder?: React.Dispatch<React.SetStateAction<Order>>;
  setOrderBy?: React.Dispatch<React.SetStateAction<string>>;
  orderBy?: string;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | null,
    page: number
  ) => void;
  rowsPerPageOptions?: (
    | number
    | {
        value: number;
        label: string;
      }
  )[];
  onRowsPerPageChange?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
};

function PaginatedTable<T>({
  id,
  items,
  columns,
  isLoading,
  renderBody,
  showPagination,
  hasCheckBox = true,
  page,
  count,
  rowsPerPage,
  setSelected,
  selected,
  onPageChange,
  rowsPerPageOptions,
  onRowsPerPageChange,
  order,
  setOrder,
  orderBy,
  setOrderBy,
}: PaginatedTableProps<T>) {
  const { t } = useTranslation();
  const onRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    if (setOrder && setOrderBy) {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    }
  };

  const createSortHandler = (property: string) => {
    onRequestSort(property);
  };

  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleSelectClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = items?.map((n: any) => n._id);
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  //needed in future

  // //@ts-ignore
  // const tableItems = useMemo(
  //   () =>
  //     stableSort(items, getComparator(order, orderBy))?.slice(
  //       page * rowsPerPage,
  //       page * rowsPerPage + rowsPerPage
  //     ),
  //   [items]
  // );

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ width: "100%", boxShadow: "none" }}
      >
        <Table sx={{ borderCollapse: "unset" }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: "#F9FAFC" }}>
            <TableRow>
              {hasCheckBox && (
                <TableCell padding="checkbox">
                  <Checkbox
                    onChange={handleSelectClick}
                    checked={
                      items?.length > 0 && selected?.length === items?.length
                    }
                    indeterminate={
                      selected?.length > 0 && selected?.length < items?.length
                    }
                  />
                </TableCell>
              )}

              {columns?.map((col: ColumnsProps, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <TableCell
                      sx={{ padding: "16px", paddingRight: "0" }}
                      align={col.direction || "left"}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <TableSortLabel
                          hideSortIcon={col.hideSortIcon ? true : false}
                          active={orderBy === col.id}
                          direction={orderBy === col.id ? order : "asc"}
                          onClick={() => {
                            !col.hideSortIcon
                              ? createSortHandler(col.id)
                              : false;
                          }}
                          sx={{
                            width: "100%",
                            placeContent: `${col.direction || "left"}`,
                          }}
                        >
                          <Translations text={col.label} />
                        </TableSortLabel>
                        {col.label && index !== columns.length - 1 && (
                          <Box
                            sx={{
                              justifySelf: "flex-end",
                              width: "2px",
                              height: "20px",
                              background: "lightgrey",
                            }}
                          ></Box>
                        )}
                      </Box>
                    </TableCell>
                  </React.Fragment>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* @ts-ignore */}
            {items?.map((item: T & { _id: string }, index) => {
              const labelId = `enhanced-table-checkbox-${id}`;
              const isItemSelected = isSelected(item?._id);
              return (
                <TableRow
                  selected={isItemSelected}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={item._id}
                  role="checkbox"
                >
                  {hasCheckBox && (
                    <TableCell
                      padding="checkbox"
                      onClick={() => {
                        handleClick(item?._id);
                      }}
                    >
                      <Checkbox
                        key={id}
                        checked={selected.indexOf(item._id) !== -1}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                  )}
                  {renderBody(item, index)}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {!items?.length && (
          <Box display="flex" justifyContent="center" mt={7}>
            <Typography variant="h6">
              <Translations text="No Data Found" />
            </Typography>
          </Box>
        )}
      </TableContainer>
      {showPagination && (
        <TablePagination
          page={page || 0}
          component="div"
          count={count || 0}
          labelRowsPerPage={t("Row per page")}
          rowsPerPage={rowsPerPage || 0}
          onPageChange={onPageChange}
          rowsPerPageOptions={rowsPerPageOptions}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </>
  );
}

export default PaginatedTable;
