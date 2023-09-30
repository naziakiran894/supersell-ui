import { useState, forwardRef, useEffect } from "react";
import TextField from "@mui/material/TextField";

import format from "date-fns/format";
import addDays from "date-fns/addDays";
import DatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from "react-datepicker";
import { DateType } from "../types/forms/reactDatepickerTypes";
import DatePickerWrapper from "../DatePickerWrapper";
import { InputAdornment } from "@mui/material";
import Icon from "../icon";
import { useTranslation } from "react-i18next";
import fi from "date-fns/locale/fi";

interface PickerProps {
  label?: string;
  end: Date | number;
  start: Date | number;
}

type PickersRangeProps = {
  startDateRange: DateType;
  setStartDateRange: React.Dispatch<React.SetStateAction<DateType>>;
  endDateRange: DateType;
  setEndDateRange: React.Dispatch<React.SetStateAction<DateType>>;
};

const PickersRange = ({
  startDateRange,
  setStartDateRange,
  setEndDateRange,
  endDateRange,
}: PickersRangeProps) => {
  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates;
    setStartDateRange(start);
    setEndDateRange(end);
  };
  const { t, i18n } = useTranslation();

  console.log(i18n.language, "language");

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const startDate =
      props.start !== null ? format(props.start, "MM/dd/yyyy") : "";
    const endDate =
      props.end !== null ? ` - ${format(props.end, "MM/dd/yyyy")}` : "";

    const value = `${startDate}${endDate !== null ? endDate : ""}`;

    const handleClearDate = () => {
      setStartDateRange(null);
      setEndDateRange(null);
    };

    useEffect(() => {
      if (i18n.language === "fn") {
        registerLocale("fi", fi);
      }
    }, [i18n.language]);

    return (
      <TextField
        fullWidth
        // select
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {(startDateRange || endDateRange) && (
                <Icon
                  onClick={handleClearDate}
                  cursor="pointer"
                  icon="mdi:window-close"
                />
              )}
            </InputAdornment>
          ),
        }}
        inputRef={ref}
        label={props.label || ""}
        {...props}
        value={value}
      />
    );
  });

  return (
    <DatePickerWrapper>
      <DatePicker
        selectsRange
        calendarStartDay={1}
        monthsShown={2}
        endDate={endDateRange}
        selected={startDateRange}
        startDate={startDateRange}
        shouldCloseOnSelect={false}
        locale={i18n.language === "fn" ? "fi" : "en"}
        id="date-range-picker-monthPickerPropss"
        onChange={handleOnChangeRange}
        customInput={
          <CustomInput
            label={t("Date Range")}
            end={endDateRange as Date | number}
            start={startDateRange as Date | number}
          />
        }
      />
    </DatePickerWrapper>
  );
};

export default PickersRange;
