import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import MuiSwitch from "../../../../@core/components/muiSwitch";
import { useUpdateDoNotDisturbStatusMutation } from "../../../../store/services";
import Translations from "../../../../@core/layouts/Translations";

interface IProps {
  rowId: string;
  checked: boolean;
}

const CheckBox = ({ rowId, checked }: IProps) => {
  const [doNotDisturb, setDoNotDisturb] = useState(checked);
  const { enqueueSnackbar } = useSnackbar();

  const [handleUpdateStatus, { isSuccess }] =
    useUpdateDoNotDisturbStatusMutation();
  useEffect(() => {
    setDoNotDisturb(checked);
  }, [checked]);

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(
        <Translations text="Do not disturb status update successfully." />,
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
