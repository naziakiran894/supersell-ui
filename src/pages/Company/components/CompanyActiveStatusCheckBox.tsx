import React, { useEffect, useState } from "react";
import { Switch } from "@mui/material";
import { useSnackbar } from "notistack";
import { useUpdateCompanyStatusMutation } from "../../../store/services";
import Translations from "../../../@core/layouts/Translations";

interface IProps {
  checked: boolean;
  rowId: string;
}

const CompanyActiveStatusCheckBox = ({ checked, rowId }: IProps) => {
  const [status, setStatus] = useState(checked);
  const [handleUpdateStatus, { isSuccess, error }] =
    useUpdateCompanyStatusMutation();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setStatus(checked);
  }, [checked]);

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(
        <Translations text={"Company status updated successfully."} />,
        {
          variant: "success",
        }
      );
    } else if (error) {
      enqueueSnackbar(<Translations text={"Something went wrong!"} />, {
        variant: "error",
      });
    }
  }, [isSuccess, error]);

  return (
    <Switch
      onChange={(e) => {
        handleUpdateStatus({
          companyId: rowId,
          companyStatus: e.target.checked,
        });
        setStatus(e.target.checked);
      }}
      checked={status}
    />
  );
};

export default CompanyActiveStatusCheckBox;
