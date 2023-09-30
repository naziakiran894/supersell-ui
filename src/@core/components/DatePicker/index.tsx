import * as React from "react";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as Yup from "yup";
import { FormControl, FormHelperText } from "@mui/material";
import { Form } from "formik";
import { Formik, Field } from "formik";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
});

export default function ControlledComponent() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  function handleSubmit(values: any) {
    throw new Error("Function not implemented.");
  }

  const clientTimeSetting = useSelector(
    (state: RootState) => state.clientSetting.ClientSetting
  );

  return (
    <Formik
      initialValues={{
        title: "",
        date: new Date(),
        country: "",
        doNotDisturb: false,
      }}
      validationSchema={validationSchema}
      onSubmit={(values: any) => {
        values.preventDefault();
        // handleSubmit(values):(e?: React.FormEvent<HTMLFormElement> | undefined) => void;
      }}
    >
      {({ errors, touched, values, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <FormControl>
            <DatePicker
              value={value ? dayjs(value) : null}
              onChange={(newValue) => setValue(newValue)}
              format={
                clientTimeSetting?.defaultDateTimeFormat || "DD.MM.YYYY hh.mm"
              }
            />
            <FormHelperText>
              {touched.country && (errors.country as string)}
            </FormHelperText>
          </FormControl>
        </form>
      )}
    </Formik>
  );
}
