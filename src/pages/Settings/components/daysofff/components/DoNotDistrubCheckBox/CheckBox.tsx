import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import MuiSwitch from "../../../../../../@core/components/muiSwitch";
import { useUpdateDayDndMutation } from "../../../../../../store/services";
import Translations from "../../../../../../@core/layouts/Translations";

interface IProps {
  rowId: string;
  checked: boolean;
}

const CheckBox = ({ rowId, checked }: IProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [doNotDisturb, setDoNotDisturb] = useState(checked);
  const [handleUpdateStatus, { isSuccess, error }] = useUpdateDayDndMutation();

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
    } else if (error) {
      enqueueSnackbar(<Translations text="Some thing wend wrong!" />, {
        variant: "error",
      });
    }
  }, [isSuccess, error]);

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
