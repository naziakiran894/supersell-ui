import {
  Grid,
  FormControl,
  Typography,
  Card,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import {
  useGetAllTeamsQuery,
  useGetTagsAndStatusesQuery,
  useGetUsersListQuery,
} from "../../../store/services";
import { ITeamList } from "../../../store/types/team.types";
import { IUserList } from "../../../store/types/user.types";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ITagsAndStatuses } from "../../../store/types/tagsAndStatuses.types";
import PickersRange from "../../../@core/components/RangeDatePicker";
import { DateType } from "../../../@core/components/types/forms/reactDatepickerTypes";
import { useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";

interface IProps {
  teamName: string;
  setTeamName: React.Dispatch<React.SetStateAction<string>>;
  setLeadOwner: React.Dispatch<React.SetStateAction<string>>;
  leadOwner: string;
  setStage: React.Dispatch<React.SetStateAction<string>>;
  stage: string;
  setTags: React.Dispatch<React.SetStateAction<string>>;
  tags: string;
  setStartDateRange: React.Dispatch<React.SetStateAction<DateType>>;
  startDateRange: DateType;
  setEndDateRange: React.Dispatch<React.SetStateAction<DateType>>;
  endDateRange: DateType;
}

const LeadsFilters = ({
  teamName,
  setTeamName,
  setLeadOwner,
  leadOwner,
  setStage,
  stage,
  setTags,
  tags,
  setStartDateRange,
  startDateRange,
  setEndDateRange,
  endDateRange,
}: IProps) => {
  const { data } = useGetAllTeamsQuery("");
  const { data: apiData } = useGetUsersListQuery("");

  //@ts-ignore
  const teams: ITeamList[] = data?.data;
  //@ts-ignore
  const users: IUserList[] = apiData?.data;

  const companyId = useSelector(
    (state: RootState) => state.auth.user?.companyId
  );
  const { t } = useTranslation();

  const { data: tagsStages } = useGetTagsAndStatusesQuery(companyId);

  //@ts-ignore
  const tagsList: ITagsAndStatuses[] = tagsStages?.data?.tags;

  //@ts-ignore
  const stagesList: ITagsAndStatuses[] = tagsStages?.data?.stages;

  return (
    <Grid container display="flex" flexDirection="column" my={5}>
      <Card sx={{ display: "flex", flexDirection: "column", padding: "20px" }}>
        <Box>
          <Typography variant="h5">
            <Translations text="Filters" />
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" flexWrap="wrap">
          <Grid item md={2.2} sm={5} xs={12} mt={5}>
            <FormControl fullWidth>
              <Autocomplete
                value={teams?.find((item) => item?._id === teamName) || null}
                onChange={(e, value) => {
                  setTeamName(value?._id || "");
                }}
                options={teams || []}
                getOptionLabel={(option) => option?.teamName}
                renderInput={(params) => (
                  <TextField
                    name="Select Team"
                    {...params}
                    label={t("Select Team")}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item md={2.2} sm={5} xs={12} mt={5}>
            <FormControl fullWidth>
              <Autocomplete
                value={users?.find((item) => item?._id === leadOwner) || null}
                onChange={(e, value) => {
                  setLeadOwner(value?._id || "");
                }}
                options={users || []}
                getOptionLabel={(option) => option?.firstName || ""}
                renderInput={(params) => (
                  <TextField
                    name="Select Owner"
                    {...params}
                    label={t("Select Owner")}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item md={2.2} sm={5} xs={12} mt={5}>
            <FormControl fullWidth>
              <Autocomplete
                value={stagesList?.find((item) => item?.id === stage) || null}
                onChange={(e, value) => {
                  setStage(value?.id || "");
                }}
                options={stagesList || []}
                getOptionLabel={(option) => option?.statusName}
                renderInput={(params) => (
                  <TextField
                    name="Select Stage"
                    {...params}
                    label={t("Select Stage")}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item md={2.2} sm={5} xs={12} mt={5}>
            <FormControl fullWidth>
              <Autocomplete
                value={tagsList?.find((item) => item?.id === tags) || null}
                onChange={(e, value) => {
                  setTags(value?.id || "");
                }}
                options={tagsList || []}
                getOptionLabel={(option) => option?.statusName}
                renderInput={(params) => (
                  <TextField
                    name="Select Tag"
                    {...params}
                    label={t("Select Tag")}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item md={2.2} sm={5} xs={12} mt={5}>
            <PickersRange
              startDateRange={startDateRange}
              setStartDateRange={setStartDateRange}
              setEndDateRange={setEndDateRange}
              endDateRange={endDateRange}
            />
          </Grid>
        </Box>
      </Card>
    </Grid>
  );
};

export default LeadsFilters;
