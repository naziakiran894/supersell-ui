// ** React Imports
import { Ref, useState, forwardRef, ReactElement } from "react";

// ** MUI Imports

import {
  Box,
  Card,
  Dialog,
  Button,
  IconButton,
  Typography,
  Checkbox,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
} from "@mui/material";

import Fade, { FadeProps } from "@mui/material/Fade";

import { Formik } from "formik";
import Icon from "../../../../../@core/components/icon";

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

import { IAvailability, ITableData } from "../components/TableBasic";
import Translations from "../../../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";
//for table
const columns: GridColDef[] = [{ field: "Days", headerName: "DAYS" }];
interface IDay {
  id: number;
  day: string;
}

interface IProps {
  tableData: ITableData[];
  setTableData: any;
  index: number;
}

const days: IDay[] = [
  { id: 1, day: "Monday" },
  { id: 2, day: "Tuesday" },
  { id: 3, day: "Wednesday" },
  { id: 4, day: "Thursday" },
  { id: 5, day: "Friday" },
  { id: 6, day: "Saturday" },
  { id: 7, day: "Sunday" },
];

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const ScheduleModal: React.FC<IProps> = ({
  tableData,
  setTableData,
  index,
}) => {
  // ** States
  const [show, setShow] = useState<boolean>(false);
  const { t } = useTranslation();
  const handleClick = (values: { days: any }) => {
    const newData = [...tableData];
    const selectedIndexData = {
      onCall: newData[index].onCall,
      availability: newData[index].availability.map(
        (data: IAvailability) => data
      ),
    };
    days
      .filter((day) => values.days.includes(day.id))
      .forEach((e, i) => {
        const cIndex = tableData.findIndex(
          (r: ITableData, i: number) => r.day === e.day
        );
        if (cIndex !== -1) {
          newData[cIndex] = { ...newData[cIndex], ...selectedIndexData };
        }
        setTableData(newData);
        setShow(false);
      });
  };
  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setShow(true)}
      >
        <Translations text={"Copy"} />
      </Button>
      <Card>
        <Formik initialValues={{ days: [] }} onSubmit={(values) => {}}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <Dialog
                fullWidth
                open={show}
                maxWidth="xs"
                scroll="body"
                onClose={() => setShow(false)}
                TransitionComponent={Transition}
                // onBackdropClick={() => setShow(false)}
              >
                <DialogContent
                  sx={{
                    position: "relative",
                    pb: (theme) => `${theme.spacing(8)} !important`,
                    px: (theme) => [
                      `${theme.spacing(5)} !important`,
                      `${theme.spacing(15)} !important`,
                    ],
                    pt: (theme) => [
                      `${theme.spacing(8)} !important`,
                      `${theme.spacing(12.5)} !important`,
                    ],
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setShow(false)}
                    sx={{ position: "absolute", right: "1rem", top: "1rem" }}
                  >
                    <Icon icon="mdi:close" />
                  </IconButton>
                  <Box
                    sx={{
                      mb: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h5" sx={{ mb: 3 }}>
                      <Translations text={"Use same times also"} />
                    </Typography>
                    <Box>
                      <FormGroup>
                        {days?.map((e: IDay, index: number) => {
                          return (
                            <FormControlLabel
                              key={index}
                              control={
                                <Checkbox
                                  checked={values.days.includes(e.id as never)}
                                  onChange={(event) => {
                                    const isChecked = event.target.checked;
                                    let newDays = [...values.days];
                                    if (isChecked) {
                                      newDays.push(e.id as never);
                                    } else {
                                      newDays = newDays.filter(
                                        (day) => day !== e.id
                                      );
                                    }
                                    handleChange({
                                      target: { name: "days", value: newDays },
                                    });
                                  }}
                                />
                              }
                              label={t(e.day)}
                            />
                          );
                        })}
                      </FormGroup>
                    </Box>
                  </Box>
                </DialogContent>
                <DialogActions
                  sx={{
                    justifyContent: "center",
                    px: (theme) => [
                      `${theme.spacing(5)} !important`,
                      `${theme.spacing(15)} !important`,
                    ],
                    pb: (theme) => [
                      `${theme.spacing(8)} !important`,
                      `${theme.spacing(12.5)} !important`,
                    ],
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{ mr: 1 }}
                    onClick={() => handleClick(values)}
                    type="submit"
                  >
                    <Translations text={"Save"} />
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setShow(false);
                    }}
                  >
                    <Translations text={"Cancel"} />
                  </Button>
                </DialogActions>
              </Dialog>
            </form>
          )}
        </Formik>
      </Card>
    </>
  );
};

export default ScheduleModal;
