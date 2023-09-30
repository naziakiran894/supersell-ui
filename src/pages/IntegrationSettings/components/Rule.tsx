import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { IRoutingRule } from "..";
import Icon from "../../../@core/components/icon";
import { Field } from "../../../store/types/fields.types";
import { useMemo } from "react";
import { useGetTeamUserListQuery } from "../../../store/services";
import { IUserList } from "../../../store/types/user.types";
import { ITeamList } from "../../../store/types/team.types";
import Translations from "../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";
import { nanoid } from "nanoid";

type IRuleProps = {
  element: IRoutingRule[];
  index: number;
  routingRules: IRoutingRule[][];
  setRoutingRules: React.Dispatch<React.SetStateAction<IRoutingRule[][]>>;
  teams: ITeamList[];
  dropdownFields: Field[];
};

const fieldComparison = [
  {
    key: "Is equal to",
    value: "equalTo",
  },
  {
    key: "Is between",
    value: "between",
  },
  {
    key: "Is greater than",
    value: "greaterThan",
  },
  {
    key: "Contains",
    value: "contains",
  },
];

const RoutingRule = ({
  element,
  index,
  setRoutingRules,
  routingRules,
  teams,
  dropdownFields,
}: IRuleProps) => {
  const selectedTeam = useMemo(() => {
    let team = null;
    routingRules.map((rules) =>
      rules.map((rule) => {
        if (!!rule.routeToTeam) {
          team = rule.routeToTeam;
        }
      })
    );
    return team;
  }, [routingRules]);
  const { data: apiData, isLoading } = useGetTeamUserListQuery(selectedTeam, {
    skip: !selectedTeam,
  });

  //@ts-ignores
  const users: IUserList[] = apiData?.data?.list;
  const { t } = useTranslation();

  const handleAddGrid = () => {
    const newArray = [...routingRules];
    newArray.push([
      {
        ruleId: nanoid(),
        fieldType: "",
        condition: "",
        fieldValue1: "",
        fieldValue2: "",
        routeToTeam: "",
        leadOwner: "",
      },
    ]);
    setRoutingRules(newArray);
  };

  const handleAddAndCond = (outerIndex: number, innerIndex: number) => {
    const newArray = JSON.parse(JSON.stringify(routingRules));
    const innerArray = newArray[outerIndex];
    const ruleId = innerArray.find(
      (rule: { ruleId: string }) => rule.ruleId
    ).ruleId;
    innerArray.push({
      ruleId: ruleId,
      fieldType: "",
      condition: "",
      fieldValue1: "",
      fieldValue2: "",
      routeToTeam: "",
      leadOwner: "",
    });
    setRoutingRules(newArray);
  };

  const handleChangeField = (
    value: string,
    index: number,
    innerIndex: number
  ) => {
    const newArray = JSON.parse(JSON.stringify(routingRules));
    newArray[index][innerIndex].fieldType = value;
    setRoutingRules(newArray);
  };

  const handleChangeFieldOne = (
    value: string,
    index: number,
    innerIndex: number
  ) => {
    const newArray = JSON.parse(JSON.stringify(routingRules));
    newArray[index][innerIndex].condition = value;
    setRoutingRules(newArray);
  };
  const handleChangeValue = (
    value: string,
    index: number,
    innerIndex: number
  ) => {
    const newArray = JSON.parse(JSON.stringify(routingRules));
    newArray[index][innerIndex].fieldValue1 = value;
    setRoutingRules(newArray);
  };
  const handleChangeValueTwo = (
    value: string,
    index: number,
    innerIndex: number
  ) => {
    const newArray = JSON.parse(JSON.stringify(routingRules));
    newArray[index][innerIndex].fieldValue2 = value;
    setRoutingRules(newArray);
  };
  const handleChangeRouteToTeam = (
    value: string,
    index: number,
    innerIndex: number
  ) => {
    const newArray = JSON.parse(JSON.stringify(routingRules));
    newArray[index][innerIndex].routeToTeam = value;
    newArray[index][innerIndex].leadOwner = null;
    setRoutingRules(newArray);
  };

  const handleChangeLeadOwner = (
    value: string,
    index: number,
    innerIndex: number
  ) => {
    const newArray = JSON.parse(JSON.stringify(routingRules));
    newArray[index][innerIndex].leadOwner = value;
    setRoutingRules(newArray);
  };

  const handleDeleteGrid = (index: number) => {
    const newGrids = [...routingRules];

    if (newGrids.length > 1) {
      newGrids.splice(index, 1);
      setRoutingRules(newGrids);
    }
  };

  const renderDropDownField = useMemo(
    () =>
      dropdownFields?.map((e: any, index: number) => {
        return (
          <MenuItem key={index} value={e.keyName}>
            {e.value}
          </MenuItem>
        );
      }),
    [dropdownFields]
  );

  return (
    <Grid item key={index} sm={12}>
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: "600",
          mb: 4,
        }}
      >
        <Translations text="Rule #" />
        {index + 1}
      </Typography>

      <Grid container spacing={5} mt={5}>
        {element?.map((item, innerIndex: number) => {
          return (
            <Grid item key={innerIndex} sm={12}>
              <Box display="flex" alignItems="start   " gap={5} flexWrap="wrap">
                <FormControl>
                  <InputLabel id="demo-simple-select-outlined-label">
                    <Translations text="Field" />
                  </InputLabel>
                  <Select
                    sx={{ width: "162px" }}
                    label={t("Field")}
                    value={item.fieldType}
                    onChange={(e) =>
                      handleChangeField(e.target.value, index, innerIndex)
                    }
                    id="demo-simple-select-outlined"
                    labelId="demo-simple-select-outlined-label"
                  >
                    {renderDropDownField}
                  </Select>
                </FormControl>

                <FormControl>
                  <InputLabel id="demo-simple-select-outlined-label">
                    <Translations text="Field 1" />
                  </InputLabel>
                  <Select
                    sx={{ width: "162px" }}
                    label={t("Field 1")}
                    value={item.condition}
                    onChange={(e) =>
                      handleChangeFieldOne(e.target.value, index, innerIndex)
                    }
                    id="demo-simple-select-outlined"
                    labelId="demo-simple-select-outlined-label"
                  >
                    {fieldComparison.map((item, i: number) => (
                      <MenuItem key={i} value={item.value}>
                        {item.key}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label={`value ${item.condition === "between" ? "1" : ""}`}
                  variant="outlined"
                  value={item.fieldValue1 || ""}
                  onChange={(e) =>
                    handleChangeValue(e.target.value, index, innerIndex)
                  }
                  sx={{ width: "162px" }}
                />

                {item.condition === "between" && (
                  <TextField
                    label={t("value 2")}
                    variant="outlined"
                    value={item.fieldValue2}
                    onChange={(e) =>
                      handleChangeValueTwo(e.target.value, index, innerIndex)
                    }
                    sx={{ width: "162px" }}
                  />
                )}
                {innerIndex === element.length - 1 && (
                  <>
                    <Autocomplete
                      sx={{ width: "162px" }}
                      value={
                        teams?.find(
                          (team) => team?._id === item?.routeToTeam
                        ) || null
                      }
                      onChange={(e, value) => {
                        handleChangeRouteToTeam(
                          value?._id || "",
                          index,
                          innerIndex
                        );
                      }}
                      options={teams || []}
                      getOptionLabel={(option) => option?.teamName}
                      renderInput={(params) => (
                        <TextField {...params} label={t("Route to team")} />
                      )}
                    />

                    <Autocomplete
                      value={
                        users?.find(
                          (user) => user?.userId === item?.leadOwner
                        ) || null
                      }
                      onChange={(e, value) =>
                        handleChangeLeadOwner(
                          value?.userId || "",
                          index,
                          innerIndex
                        )
                      }
                      options={users || []}
                      getOptionLabel={(option) =>
                        option ? `${option?.firstName} ${option?.lastName}` : ""
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("Lead owner")}
                          sx={{ width: "169px" }}
                        />
                      )}
                    />
                  </>
                )}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px",
                    marginTop: "10px",
                  }}
                >
                  <Icon
                    icon="ci:remove-minus-circle"
                    onClick={() => handleDeleteGrid(index)}
                    style={{ cursor: "pointer" }}
                  />
                  <Icon
                    icon="material-symbols:add-circle-outline"
                    onClick={handleAddGrid}
                    style={{ cursor: "pointer" }}
                  />
                  {innerIndex === element.length - 1 && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ cursor: "pointer", mt: "5px" }}
                      onClick={() => {
                        handleAddAndCond(index, innerIndex);
                      }}
                    >
                      <Translations text={"AND"} />
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default RoutingRule;
