import { useState, useEffect } from "react";
import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import TagsFields from "./components/TagsPart";
import StatusesFields from "./components/StatusesPart";
import {
  useAddTagsAndStatusesMutation,
  useGetTagsAndStatusesQuery,
} from "../../store/services";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import PageLoader from "../../@core/components/loader/PageLoader";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import { nanoid } from "nanoid";
import { useTranslation } from "react-i18next";
import Translations from "../../@core/layouts/Translations";

export const INITAIAL_STAGES = [
  {
    id: "connected",
    statusName: "Connected",
    textColor: "#FFFFFF",
    backgroundColor: "#00dc00",
    visible: true,
    stopCalls: false,
  },
  {
    id: "notConnected",
    statusName: "Not Connected",
    textColor: "#FFFFFF",
    backgroundColor: "#e40000",
    visible: true,
    stopCalls: false,
  },
];

export interface IInitalValues {
  id: string;
  statusName: string;
  textColor: string;
  backgroundColor: string;
  visible: boolean;
  stopCalls: boolean;
}

export const intialTagValue = {
  id: nanoid(),
  statusName: "",
  textColor: "#000000",
  backgroundColor: "#f9f7f7",
  visible: true,
  stopCalls: false,
};

export const intialStatusValue = {
  id: nanoid(),
  statusName: "",
  textColor: "#000000",
  backgroundColor: "#f9f7f7",
  visible: true,
  stopCalls: false,
};

const TagsAndStatuses = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [tags, setTags] = useState([{ ...intialTagValue, id: nanoid() }]);
  const [statuses, setStatuses] = useState(INITAIAL_STAGES);

  const companyId = useSelector(
    (state: RootState) => state.auth.user?.companyId
  );
  const [handleAddTagsAndStatuses, { isLoading, error, isSuccess }] =
    useAddTagsAndStatusesMutation();
  const { t } = useTranslation();
  const {
    data,
    isLoading: isFetching,
    refetch,
  } = useGetTagsAndStatusesQuery(companyId);

  //@ts-ignore
  const apiData = data?.data;

  useEffect(() => {
    if (apiData) {
      setTags(apiData?.tags);
      if (apiData?.stages?.length) {
        setStatuses(apiData?.stages);
      }
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      enqueueSnackbar(<Translations text="Updated Successfully" />, {
        variant: "success",
      });
    } else if (error) {
      enqueueSnackbar(<Translations text="Something went wrong!" />, {
        variant: "error",
      });
    }
  }, [isSuccess]);

  const handleSaveChanges = async () => {
    if (companyId) {
      handleAddTagsAndStatuses({
        companyId,
        tags: tags,
        stages: statuses,
      });
    }
  };

  if (isFetching) {
    return <PageLoader />;
  }
  return (
    <>
      <Box my={5}>
        <Typography variant="h5">
          <Translations text="Tags and Stages" />
        </Typography>
        <Typography
          sx={{ fontWeight: "400", fontSize: "14px", color: "#3A354199" }}
        >
          {apiData?.companyId?.companyName}
        </Typography>
      </Box>
      <Card sx={{ display: "flex", flexDirection: "column" }}>
        <TagsFields formItems={tags} setFormItems={setTags} />
        <StatusesFields formItems={statuses} setFormItems={setStatuses} />
        <Box display="flex" flexWrap="wrap" gap="10px" m={5}>
          <Button
            disabled={isLoading}
            variant="contained"
            onClick={handleSaveChanges}
            sx={{ minWidth: "145px" }}
          >
            {isLoading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              <Translations text="SAVE CHANGES" />
            )}
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            <Translations text="CANCEL" />
          </Button>
          <Button variant="outlined">
            <Translations text="DELETE INTEGRATION" />
          </Button>
        </Box>
      </Card>
    </>
  );
};

export default TagsAndStatuses;
