import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import MuiSwitch from "../../../../@core/components/muiSwitch";
import { useUpdateDoNotDisturbCustomHolidayMutation } from "../../../../store/services";
import Translations from "../../../../@core/layouts/Translations";

interface IProps {
  rowId: string;
  checked: boolean;
}

const CheckBox = ({ rowId, checked }: IProps) => {
  const [doNotDisturb, setDoNotDisturb] = useState(checked);

  useEffect(() => {
    setDoNotDisturb(checked);
  }, [checked]);

  const [handleUpdateStatus, { isSuccess }] =
    useUpdateDoNotDisturbCustomHolidayMutation();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(
        <Translations text={"Do not disturb status update successfully."} />,
        {
          variant: "success",
        }
      );
    }
  }, [isSuccess]);

  return (
    <MuiSwitch
      onChange={(e) => {
        handleUpdateStatus({ id: rowId, doNotDisturbStatus: e.target.checked });
        setDoNotDisturb(e.target.checked);
      }}
      value={doNotDisturb}
    />
  );
};

export default CheckBox;
