import { Ref, useState, forwardRef, ReactElement, useEffect } from "react";
import {
  Card,
  Dialog,
  Button,
  DialogActions,
  CircularProgress,
} from "@mui/material";

import Fade, { FadeProps } from "@mui/material/Fade";
import PageLoader from "../loader/PageLoader";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { ITimezone } from "../../../store/types/timezone.types";
import { RootState } from "../../../store";
import {
  useAddHolidayMutation,
  useGetHolidayByIdQuery,
  useUpdateHolidayMutation,
} from "../../../store/services/index";
import AddHolidayForm from "../../../pages/PublicHolidays/components/AddHolidayForm";

import Icon from "../icon/index";
import { userTypes } from "../../../store/types/globalTypes";

import { useSnackbar } from "notistack";
import Translations from "../../layouts/Translations";

type FormProps = {
  onSubmit: (data: FormData) => void;
};

export interface FormData {
  datePick: any;
  title: string;
  date: Date | null;
  doNotDisturb: boolean;
  country?: String;
  dnd: boolean;
}
export interface IHolidayDetails {
  countryId: {
    _id: string;
    countryName: string;
  };
  doNotDisturb: boolean;
  holidayDate: "" | null;
  holidayName: "" | null;
  isDeleted: "" | null;
  userId: "" | null;
  _id: "" | null;
  companyAdminId: "" | null;
}

interface IAddHolidayProp {
  show: boolean;
  setShow: any;
  holidayId?: string;
}
const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const CustomDayOff = ({ setShow, show, holidayId }: IAddHolidayProp) => {
  const user = useSelector((state: RootState) => state?.auth.user);

  const [handleAddHoliday, { isSuccess, isLoading, error }] =
    useAddHolidayMutation();

  const [
    handleUpdateHoliday,
    { isSuccess: isUpdated, isLoading: isUpdating, error: updateErr },
  ] = useUpdateHolidayMutation();

  const { data, isLoading: isFetching } = useGetHolidayByIdQuery(
    holidayId ? holidayId : ""
  );

  //@ts-ignore
  const holidayDetails: IHolidayDetails = data?.data;

  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    datePick: Yup.date()
      .typeError("Please enter a valid date")
      .required("Date is required"),
    country:
      user?.roleName === userTypes.SUPER_ADMIN
        ? Yup.string().required("Country is required")
        : Yup.string(),
  });

  const handleSubmit = (values: FormData) => {
    const date = new Date(values?.datePick?.$d);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let newDate = `${year}-${month}-${day}`;

    const data = {
      holidayName: values.title,
      holidayDate: newDate,
      doNotDisturb: values.dnd,
      countryId: values.country,
    };

    if (holidayId) {
      handleUpdateHoliday({ ...data, _id: holidayId });
    } else {
      user?.roleName !== userTypes.SUPER_ADMIN && delete data.countryId;
      handleAddHoliday(data);
    }
  };
  useEffect(() => {
    if (isSuccess || isUpdated) {
      enqueueSnackbar(
        `Off day ${isUpdated ? "updated" : "added"} successfully!`,
        { variant: "success" }
      );
      setShow(false);
    } else if (error || updateErr) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  }, [isSuccess, error, isUpdated, updateErr]);

  return (
    <>
      <Card>
        <Dialog
          fullWidth
          open={show}
          maxWidth="md"
          scroll="body"
          onClose={() => setShow(false)}
          TransitionComponent={Transition}
          onBackdropClick={() => setShow(false)}
        >
          {isFetching && holidayId ? (
            <PageLoader />
          ) : (
            <Formik
              initialValues={{
                title: "",
                datePick: null,
                country: "",
                dnd: false,
              }}
              validationSchema={validationSchema}
              onSubmit={(values: any) => {
                handleSubmit(values);
              }}
            >
              {(props) => {
                const { handleSubmit } = props;
                return (
                  <form onSubmit={handleSubmit}>
                    <AddHolidayForm
                      holidayDetails={holidayId ? holidayDetails : null}
                      //@ts-ignore
                      props={props}
                      setShow={setShow}
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
                        sx={{ mr: 1 }}
                        type="submit"
                        disabled={isLoading || isUpdating}
                      >
                        {isLoading || isUpdating ? (
                          <CircularProgress size={20} sx={{ color: "white" }} />
                        ) : (
                          <Translations text={"Save"} />
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
        </Dialog>
      </Card>
    </>
  );
};

export default CustomDayOff;
