import { Autocomplete, Box, Grid, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";
import { IRoutingRule } from "..";
import { Field } from "../../../store/types/fields.types";
import { useGetAllTeamsQuery } from "../../../store/services";
import { useGetTeamUserListQuery } from "../../../store/services";
import { IUserList } from "../../../store/types/user.types";
import { ITeamList } from "../../../store/types/team.types";
import Translations from "../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";
import Rule from "./Rule";

type IProps = {
  formik: FormikProps<any>;
  routingRules: IRoutingRule[][];
  setRoutingRules: React.Dispatch<React.SetStateAction<IRoutingRule[][]>>;
  dropdownFields: Field[];
  isSubmitting: boolean;
};

const RoutingRules = ({
  routingRules,
  setRoutingRules,
  dropdownFields,
  formik,
}: IProps) => {
  const { values, errors, touched, setFieldValue } = formik;

  const { data } = useGetAllTeamsQuery("");

  const { t } = useTranslation();

  const { data: noRuleTeamData, isLoading: noRuleTeamisLoading } =
    useGetTeamUserListQuery(values.noRulesMatchToTeam, {
      skip: !values.noRulesMatchToTeam,
    });

  //@ts-ignore
  const rulesUser: IUserList[] = noRuleTeamData?.data?.list;
  //@ts-ignore
  const teams: ITeamList[] = data?.data;

  return (
    <Box m={10}>
      <Box mt={10}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "500",
            textTransform: "uppercase",
          }}
        >
          <Translations text="routing rules" />
        </Typography>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: "400",
          }}
        >
          <Translations text="Rules will be processed in order and processing stops after first match is found" />{" "}
        </Typography>

        <Grid container spacing={5} mt={5}>
          {routingRules?.map((element, index: number) => {
            return (
              <Rule
                element={element}
                index={index}
                teams={teams}
                setRoutingRules={setRoutingRules}
                routingRules={routingRules}
                dropdownFields={dropdownFields}
              />
            );
          })}
        </Grid>
      </Box>
      <Box>
        <Typography
          variant="body2"
          mt={4}
          color="text.primary"
          fontWeight={600}
        >
          <Translations text={"If no rules match route to team:"} />
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
            marginTop: "20px",
          }}
        >
          <Autocomplete
            sx={{ width: "162px" }}
            value={
              teams?.find((team) => team?._id === values?.noRulesMatchToTeam) ||
              null
            }
            onChange={(e, value) => {
              setFieldValue("noRulesMatchToTeam", value?._id);
            }}
            options={teams || []}
            getOptionLabel={(option) => option?.teamName}
            renderInput={(params) => (
              <TextField
                error={
                  touched.noRulesMatchToTeam &&
                  Boolean(errors.noRulesMatchToTeam)
                }
                helperText={
                  touched.noRulesMatchToTeam &&
                  (errors.noRulesMatchToTeam as string)
                }
                {...params}
                label={t("Route to team")}
              />
            )}
          />

          <Autocomplete
            value={
              rulesUser?.find(
                (user) => user?.userId === values?.noRulesMatchToLead
              ) || null
            }
            onChange={(e, value) =>
              setFieldValue("noRulesMatchToLead", value?.userId)
            }
            options={rulesUser || []}
            getOptionLabel={(option) =>
              option ? `${option?.firstName} ${option?.lastName}` : ""
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("Lead owner")}
                sx={{ width: "165px" }}
              />
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RoutingRules;
