import React, { useEffect, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Paper,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  CircularProgress,
  TableSortLabel,
  Typography,
} from "@mui/material";

import Icon from "../../../../@core/components/icon";

import ScheduleModal from "../scheduleModal";
import { RootState } from "../../../../store";
import Translations from "../../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";
interface ITableProps {
  col: string[];
  tableData: ITableData[];
  isLoading: boolean;
  setTableData: React.Dispatch<SetStateAction<ITableData[]>>;
}
export interface IAvailability {
  startTime: string;
  endTime: string;
}
export interface ITableData {
  day: string;
  onCall: boolean;
  availability: IAvailability[];
}
const TeamScheduleTable: React.FC<ITableProps> = ({
  col,
  setTableData,
  tableData,
  isLoading,
}) => {
  const handleAddOnCall = (e: any, row: any) => {
    const cIndex = tableData.findIndex((r) => r.day === row.day);
    if (cIndex !== -1) {
      const newData = [...tableData];
      newData[cIndex].onCall = e.target.checked;

      setTableData(newData);
    }
  };

  const { t } = useTranslation();
  const timePickerOpt = () => {
    const arr = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 4; j++) {
        let opt = `${/^\d$/.test(i.toString()) ? "0" + i : i}:${
          /^\d$/.test((j * 15).toString()) ? `0${j * 15}` : j * 15
        }`;
        arr.push(opt);
      }
    }

    return arr;
  };

  const handleAddAvailibility = (index: number) => {
    const cIndex = tableData.findIndex((r, i) => i === index);
    if (cIndex !== -1) {
      const newData = [...tableData];
      newData[cIndex].availability = [
        ...newData[cIndex].availability,
        {
          startTime: "",
          endTime: "",
        },
      ];

      setTableData(newData);
    }
  };

  const handleStartTimeChange = (e: any, row: any, innerIndex: number) => {
    const cIndex = tableData.findIndex((r) => r.day === row.day);
    if (cIndex !== -1) {
      const newData = [...tableData];
      let arr = newData[cIndex].availability;
      let a = newData[cIndex].availability[innerIndex];
      if (e.target.value === "0") {
        arr = [
          {
            startTime: "0",
            endTime: "",
          },
        ];
        newData[cIndex].availability = arr;
      }
      a = { ...a, startTime: e.target.value };
      newData[cIndex].availability[innerIndex] = a;

      setTableData(newData);
    }
  };

  const handleEndTimeChange = (e: any, row: any, innerIndex: number) => {
    const cIndex = tableData.findIndex((r) => r.day === row.day);
    if (cIndex !== -1) {
      const newData = [...tableData];
      let a = newData[cIndex].availability[innerIndex];
      a = { ...a, endTime: e.target.value };
      newData[cIndex].availability[innerIndex] = a;

      setTableData(newData);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          mt: 6,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>
          <Translations text="Loading" />
          ...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        "&.MuiGrid-root": {
          overflowX: "scroll",
        },
      }}
    >
      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table sx={{ borderCollapse: "unset" }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: "#F9FAFC" }}>
            <TableRow>
              {col.map((e: string, index: number) => {
                return (
                  <TableCell
                    sx={{ padding: "16px", paddingRight: "0" }}
                    key={index}
                    align="center"
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <TableSortLabel
                        sx={{ width: "100%", placeContent: "center" }}
                      >
                        {" "}
                        {e} 
                        
                      </TableSortLabel>
                      {e && (
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
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row: ITableData, index: number) => {
              return (
                <TableRow key={index} style={{ padding: "0px" }}>
                  <>
                    <TableCell component="th" scope="row" align="center">
                      {row.day}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <MuiSwitch
                        onChange={(e: any) => {
                          handleAddOnCall(e, row);
                        }}
                        value={tableData[index].onCall}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <Box
                        display="flex"
                        alignItems="center"
                        flexDirection="column"
                        gap="18px"
                      >
                        {tableData[index].availability.map(
                          (td: any, ind: number) => {
                            return (
                              <FormControl
                                key={ind}
                                size="small"
                                sx={{ width: "124px", margin: "0px" }}
                              >
                                <InputLabel
                                  id="demo-simple-select-outlined-label"
                                  style={{ padding: "0px" }}
                                >
                                  <Translations text="Time" />
                                </InputLabel>
                                <Select
                                  onChange={(e) => {
                                    handleStartTimeChange(e, row, ind);
                                  }}
                                  label={t("Time")}
                                  value={td.startTime}
                                  id="demo-simple-select-outlined"
                                  labelId="demo-simple-select-outlined-label"
                                >
                                  <MenuItem value={"0"}><Translations text="All Day" /></MenuItem>

                                  {timePickerOpt().map((e, i) => (
                                    <MenuItem key={i} value={e}>
                                        {e} 
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            );
                          }
                        )}
                      </Box>
                    </TableCell>
                    {tableData[index].availability[0]?.startTime !== "0" ? (
                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Box
                          display="flex"
                          alignItems="left"
                          flexDirection="column"
                          gap="18px"
                        >
                          {tableData[index].availability.map(
                            (td: any, ind: number) => {
                              return (
                                <Box
                                  key={ind}
                                  display="flex"
                                  alignItems="center"
                                  flexDirection="row"
                                >
                                  <FormControl
                                    key={ind}
                                    size="small"
                                    sx={{ width: "124px", margin: "0px" }}
                                  >
                                    <InputLabel
                                      id="demo-simple-select-outlined-label"
                                      style={{ padding: "0px" }}
                                    >
                                      {t("Time")}
                                    </InputLabel>
                                    <Select
                                      onChange={(e) => {
                                        handleEndTimeChange(e, row, ind);
                                      }}
                                      label={t("Time")}
                                      value={td.endTime}
                                      id="demo-simple-select-outlined"
                                      labelId="demo-simple-select-outlined-label"
                                    >
                                      <MenuItem value="">
                                        <em> {t("None")}</em>
                                      </MenuItem>

                                      {timePickerOpt().map((e, i) => (
                                        <MenuItem key={i} value={e}>
                                            {e} 
                                          {/* {e} */}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  {tableData[index].availability.length - 1 ===
                                    ind && (
                                    <Icon
                                      style={{ margin: "15px 5px" }}
                                      icon="mdi:circles-add"
                                      onClick={() => {
                                        handleAddAvailibility(index);
                                      }}
                                    />
                                  )}
                                </Box>
                              );
                            }
                          )}
                        </Box>
                      </TableCell>
                    ) : (
                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                      ></TableCell>
                    )}

                    <TableCell component="th" scope="row" align="center">
                      <ScheduleModal
                        index={index}
                        setTableData={setTableData}
                        tableData={tableData}
                      />
                    </TableCell>
                  </>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeamScheduleTable;

const MuiSwitch = ({ value, onChange }: { value: boolean; onChange: any }) => {
  return (
    <>
      <Switch checked={value} onChange={onChange} />
      <span style={{ marginLeft: "4px" }}>
        {value ? <Translations text="Yes" /> : <Translations text="No" />}
      </span>
    </>
  );
};
