import React from "react";
import {
  Box,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { nanoid } from "nanoid";

import Icon from "../../../@core/components/icon";
import TagsAndStatusesDialog from "../components/TagsAndStatusesDialog";
import { IInitalValues, intialTagValue } from "../index";
import { useTranslation } from "react-i18next";

export interface IProps {
  tags: IInitalValues[];
  setTags: any;
  index: number;
  data: IInitalValues;
}

const TagsItemComponent: React.FC<IProps> = ({
  tags,
  setTags,
  index,
  data,
}) => {
  const handleAddClick = () => {
    setTags((pre: any) => [...pre, { ...intialTagValue, id: nanoid() }]);
  };

  const handleRemoveClick = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  const { t } = useTranslation();
  const handleSetTagName = (value: string) => {
    const newArray = [...tags];
    newArray[index] = Object.assign({}, newArray[index], { statusName: value });
    setTags(newArray);
  };

  const handleSetTagVisibility = (value: boolean) => {
    const newArray = [...tags];
    newArray[index] = Object.assign({}, newArray[index], { visible: value });
    setTags(newArray);
  };

  const handleSetTagStopCall = (value: boolean) => {
    const newArray = [...tags];
    newArray[index] = Object.assign({}, newArray[index], { stopCalls: value });
    setTags(newArray);
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
        onChange={(e) => handleSetTagName(e.target.value)}
      />
      <Box alignSelf="center">
        <TagsAndStatusesDialog
          tags={tags}
          setTags={setTags}
          index={index}
          data={data}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "end", width: "68px" }}>
          {tags?.length !== 1 && (
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
          onClick={() => handleSetTagVisibility(!data?.visible)}
        >
          <Icon
            icon={data?.visible ? "mdi:eye-outline" : "mdi:eye-off-outline"}
          />
        </IconButton>
        <FormControlLabel
          control={
            <Switch
              checked={data?.stopCalls}
              onChange={(e) => handleSetTagStopCall(e.target.checked)}
            />
          }
          label={t("Stop calls")}
        />
      </Box>
    </Box>
  );
};
export default TagsItemComponent;
