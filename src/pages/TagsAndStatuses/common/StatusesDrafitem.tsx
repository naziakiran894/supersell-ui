import React from "react";
import {
  Box,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Icon from "../../../@core/components/icon";
import TagsAndStatusesDialog from "../components/TagsAndStatusesDialog";
import { IInitalValues, intialStatusValue } from "../index";
import { nanoid } from "nanoid";
import { useTranslation } from "react-i18next";

export interface IProps {
  statuses: IInitalValues[];
  setStatuses: any;
  index: number;
  data: IInitalValues;
}

const StatusesItemComponent: React.FC<IProps> = ({
  statuses,
  setStatuses,
  index,
  data,
}) => {
  const handleAddClick = () => {
    setStatuses((pre: any) => [...pre, { ...intialStatusValue, id: nanoid() }]);
  };

  const handleRemoveClick = (index: number) => {
    setStatuses(statuses.filter((_, i) => i !== index));
  };

  const handleSetStatusName = (value: string) => {
    const newArray = [...statuses];
    newArray[index] = Object.assign({}, newArray[index], { statusName: value });
    newArray[index].statusName = value;
    setStatuses(newArray);
  };

  const handleSetStatusVisibility = (value: boolean) => {
    const newArray = [...statuses];
    newArray[index] = Object.assign({}, newArray[index], { visible: value });
    setStatuses(newArray);
  };
  const { t } = useTranslation();

  const handleSetStatusStopCall = (value: boolean) => {
    const newArray = [...statuses];
    newArray[index] = Object.assign({}, newArray[index], { stopCalls: value });
    setStatuses(newArray);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "22px",
        py: 3,
      }}
    >
      <TextField
        variant="outlined"
        label={t("Status name")}
        value={data?.statusName}
        onChange={(e) => handleSetStatusName(e.target.value)}
        disabled={data?.id === "connected" || data?.id === "notConnected"}
      />
      <Box alignSelf="center">
        <TagsAndStatusesDialog
          tags={statuses}
          setTags={setStatuses}
          index={index}
          data={data}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <Box sx={{ display: "flex", justifyContent: "end", width: "68px" }}>
          {statuses?.length !== 1 && (
            <IconButton size="small" onClick={() => handleRemoveClick(index)}>
              <Icon icon="ci:remove-minus-circle" color="black" />
            </IconButton>
          )}
          <IconButton size="small" onClick={handleAddClick}>
            <Icon icon="material-symbols:add-circle-outline" color="black" />
          </IconButton>
        </Box>
        <IconButton size="small">
          <Icon icon="tabler:equal" />
        </IconButton>
        <IconButton
          size="small"
          sx={{ ml: 3 }}
          onClick={() => handleSetStatusVisibility(!data?.visible)}
        >
          <Icon
            icon={data?.visible ? "mdi:eye-outline" : "mdi:eye-off-outline"}
          />
        </IconButton>
        <FormControlLabel
          control={
            <Switch
              checked={data?.stopCalls}
              onChange={(e) => handleSetStatusStopCall(e.target.checked)}
            />
          }
          label={t("Stop calls")}
        />
      </Box>
    </Box>
  );
};
export default StatusesItemComponent;
