import React from "react";
import Reporting from "./Reporting";
import { useState } from "react";
import { DateType } from "../../@core/components/types/forms/reactDatepickerTypes";

const index = () => {
  const [startDateRange, setStartDateRange] = useState<DateType>(null);
  const [endDateRange, setEndDateRange] = useState<DateType>(null);

  return (
    <Reporting
      setEndDateRange={setEndDateRange}
      endDateRange={endDateRange}
      startDateRange={startDateRange}
      setStartDateRange={setStartDateRange}
    />
  );
};

export default index;
