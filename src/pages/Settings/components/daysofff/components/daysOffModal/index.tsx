import { Ref, useState, useEffect, forwardRef, ReactElement } from "react";
import { FormikProps } from "formik";
import {
  Box,
  Card,
  Dialog,
  Button,
  IconButton,
  Typography,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import Fade, { FadeProps } from "@mui/material/Fade";
import Icon from "../../../../../../@core/components/icon/index";
import { Formik } from "formik";
import PageLoader from "../../../../../../@core/components/loader/PageLoader";
import * as Yup from "yup";
import {
  useAddDaysOffMutation,
  useUpdateDaysOffMutation,
  useGetDaysDetailsByIdQuery,
} from "../../../../../../store/services";
import AddDaysOffForm from "./AddDaysOffForm";
// import { IDaysOff } from "../../../../../../store/types/daysoff.types";
import { Translation, useTranslation } from "react-i18next";
import Translations from "../../../../../../@core/layouts/Translations";

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

interface IProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  show: boolean;
  holidayId: string;
}

const addTeamSchema = Yup.object({
  holidayName: Yup.string().required("Day is required"),
  date: Yup.date()
    .typeError("Please enter a valid date")
    .required("Date is required"),
});

const daysOffModal = ({ setShow, show, holidayId }: IProps) => {
  const [
    handleUpdateDays,
    { isSuccess: isUpdated, isLoading: isUpdating, error: updatedError },
  ] = useUpdateDaysOffMutation();

  const { data, isLoading: isFetching } = useGetDaysDetailsByIdQuery(
    holidayId ? holidayId : ""
  );
  const { t } = useTranslation();

  const [handleAddDays, { isLoading, isSuccess, error }] =
    useAddDaysOffMutation();

  //@ts-ignore
  const holidayDetails = data?.data;

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(<Translations text="Days added successfully" />, {
        variant: "success",
      });
      setShow(false);
    } else if (error) {
      //@ts-ignore
      enqueueSnackbar(<Translations text="Something went wrong." />, {
        variant: "error",
      });
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (isUpdated) {
      enqueueSnackbar(<Translations text="Days updated successfully" />, {
        variant: "success",
      });
      setShow(false);
    } else if (updatedError) {
      //@ts-ignore
      enqueueSnackbar(<Translations text="Something went wrong." />, {
        variant: "error",
      });
    }
  }, [isUpdated, updatedError]);

  return (
    <>
      <Card>
        <Dialog
          fullWidth
          open={show}
          maxWidth="md"
          scroll="body"
          onClose={() => setShow(false)}
          onBackdropClick={() => setShow(false)}
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
            <Box sx={{ mb: 2, textAlign: "center" }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                <Translations
                  text={
                    holidayDetails?._id
                      ? "EDIT CUSTOM DAY OFF"
                      : "ADD CUSTOM DAY OFF"
                  }
                />
              </Typography>
            </Box>

            {isFetching ? (
              <PageLoader />
            ) : (
              <Formik
                initialValues={{
                  holidayName: "",
                  date: null,
                  doNotDisturb: false,
                }}
                validationSchema={addTeamSchema}
                onSubmit={(values) => {
                  if (holidayId) {
                    handleUpdateDays({
                      _id: holidayId,
                      holidayName: values.holidayName,
                      holidayDate: values.date,
                      doNotDisturb: values.doNotDisturb,
                    });
                  } else {
                    handleAddDays({
                      holidayName: values.holidayName,
                      holidayDate: values.date,
                      doNotDisturb: values.doNotDisturb,
                    });
                  }
                }}
              >
                {(props) => {
                  const { handleSubmit } = props;
                  return (
                    <form onSubmit={handleSubmit}>
                      <AddDaysOffForm
                        holidayDetails={holidayId ? holidayDetails : null}
                        //@ts-ignore
                        props={props}
                      />

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
                          type="submit"
                          disabled={isLoading}
                          sx={{ mr: 1 }}
                        >
                          {isLoading || isUpdating ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                            />
                           
                          ) : holidayDetails?._id ? (
                            <Translations text="Update" />
                          ) : (
                            <Translations text="Save" />
                          )}
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => setShow(false)}
                        >
                          <Translations text="Cancel" />
                        </Button>
                      </DialogActions>
                    </form>
                  );
                }}
              </Formik>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
};

export default daysOffModal;
