import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import MuiSwitch from "../../../@core/components/muiSwitch";
import { useUpdateIntegrationListStatusMutation } from "../../../store/services";
import Translations from "../../../@core/layouts/Translations";

interface IProps {
  rowId: string;
  checked: boolean;
}

const CheckBox = ({ rowId, checked }: IProps) => {
  const [isActive, setIsActive] = useState(checked);
  const [handleUpdateStatus, { isSuccess }] =
    useUpdateIntegrationListStatusMutation();

  useEffect(() => {
    setIsActive(checked);
  }, [checked]);

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
        handleUpdateStatus({ id: rowId, isActive: e.target.checked });
        setIsActive(e.target.checked);
      }}
      value={isActive}
    />
  );
};

export default CheckBox;
