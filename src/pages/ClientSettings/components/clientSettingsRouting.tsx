import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormHelperText,
  TextField,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Checkbox,
} from "@mui/material";
import { FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import { ColumnsProps } from "../../../@core/components/PaginatedTable";

import { useGetCompanyRoutingListQuery } from "../../../store/services/index";

import { IFormData } from "../index";
import { ICompanyDetailsByID } from "../../../store/types/company.types";
import Translations from "../../../@core/layouts/Translations";

interface IProps {
  props: FormikProps<IFormData>;
  clientDetails: ICompanyDetailsByID;
}
interface IPermissions {
  user?: boolean;
  admin?: boolean;
  _id: string;
  keyName: string;
  role: string;
}

export type IRoutingSetting = {
  description: string;
  keyName: string;
};
const ClientSettingRouting = ({
  props,
  clientDetails,
  permissions,
  setPermission,
}: any) => {
  const { handleChange, values, touched, errors, setFieldValue } = props;

  const { data } = useGetCompanyRoutingListQuery("");
  const { t } = useTranslation();

  //@ts-ignore'
  const routingSetting: IRoutingSetting[] = data?.data;
  const Details: IPermissions[] = clientDetails.permissions;
  useEffect(() => {
    setFieldValue("assignLeadOwner", clientDetails?.routingSetting);
    setFieldValue("control", clientDetails?.defaultCountryId?.countryName);
    setFieldValue("retryLeads", clientDetails?.retryLeadsAfterVoicemail);
    setFieldValue("hangupOnVoicemail", clientDetails?.hangupOnVoicemail);
    setFieldValue("attemptRetry", clientDetails?.attemptRetriesEarly);
    setFieldValue(
      "callMarked",
      clientDetails?.callMarkedAsConversation?.active
    );
    setFieldValue(
      "callMarkedTime",
      clientDetails?.callMarkedAsConversation?.time
    );
  }, [clientDetails]);

  useEffect(() => {
    if (Details) {
      setPermission(
        Details.map((e: IPermissions) => ({
          keyName: e.keyName,
          user: e.role === "user" || e.role === "both",
          admin: e.role === "admin" || e.role === "both",
        }))
      );
    }
  }, [Details]);

  const handleUpdateUserPermission = (value: boolean, index: number) => {
    const newArray = [...permissions];

    newArray[index].user = value;
    setPermission(newArray);
  };

  const handleUpdateAdminPermission = (value: boolean, index: number) => {
    const newArray = [...permissions];

    newArray[index].admin = value;
    setPermission(newArray);
  };

  return (
    <>
      <Box>
        <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>
          <Translations text="Routing Settings" />{" "}
        </Typography>
      </Box>
      <Grid
        container
        sx={{ mt: 5 }}
        display="flex"
        justifyContent="space-between"
      >
        <Grid
          item
          md={5}
          sm={10}
          xs={10}
          mb={5}
          display="flex"
          flexWrap="wrap"
          gap="10px"
        >
          {routingSetting && (
            <FormControl
              fullWidth
              error={touched.assignLeadOwner && Boolean(errors.assignLeadOwner)}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <Translations text="Assign Lead Owner automatically" />{" "}
              </InputLabel>

              <Select
                label={t("Assign Lead Owner automatically")}
                defaultValue=""
                name="assignLeadOwner"
                value={values.assignLeadOwner}
                onChange={handleChange}
                error={
                  touched.assignLeadOwner && Boolean(errors.assignLeadOwner)
                }
              >
                {routingSetting?.map((col: IRoutingSetting, index: number) => {
                  return (
                    <MenuItem key={index} value={col.keyName}>
                      <Translations text={col.description} />
                    </MenuItem>
                  );
                })}
              </Select>

              <FormHelperText>
                {touched.assignLeadOwner && errors.assignLeadOwner}
              </FormHelperText>
            </FormControl>
          )}
        </Grid>

        <Grid
          item
          md={10}
          sm={10}
          xs={10}
          mb={5}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>
              <Translations text="Retry Leads After Voicemail" />{" "}
            </Typography>
            <Typography>
              <Translations text="Schedule retry calls to leads after leaving a voicemail message." />
            </Typography>
          </Box>
          <Switch
            value={values.retryLeads}
            inputProps={{ "aria-label": "Switch" }}
            name="retryLeads"
            checked={values.retryLeads}
            onChange={handleChange}
          />
        </Grid>
        <Grid
          item
          md={10}
          sm={10}
          xs={10}
          mb={5}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>
              <Translations text="Hangup on User/Lead Voicemail???" />{" "}
            </Typography>
            <Typography>
              <Translations text="If the system reaches an user's voicemail, it will automatically hangup." />
            </Typography>
          </Box>
          <Switch
            value={values.hangupOnVoicemail}
            inputProps={{ "aria-label": "Switch" }}
            onChange={handleChange}
            checked={values.hangupOnVoicemail}
            name="hangupOnVoicemail"
          />
        </Grid>
        <Grid
          item
          md={10}
          sm={10}
          xs={10}
          mb={5}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>
              <Translations text="Attempt Retries Early" />{" "}
            </Typography>
            <Typography>
              <Translations text="If the system reaches an user's voicemail, it will automatically hangup." />
            </Typography>
          </Box>
          <Switch
            value={values.attemptRetry}
            inputProps={{ "aria-label": "attemptRetry" }}
            name="attemptRetry"
            checked={values.attemptRetry}
            onChange={handleChange}
          />
        </Grid>
        <Grid
          item
          md={10}
          sm={10}
          xs={10}
          mb={5}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>
              <Translations text="Call will be marked as a conversation" />
              {""}
            </Typography>
            <Typography>
              <Translations text="Calls which durations is this amount of seconds or more will be marked as a conversation. Shorter calls will be marked as Voicemail" />
            </Typography>
          </Box>

          <Switch
            value={values.callMarked}
            inputProps={{ "aria-label": "callMarked" }}
            name="callMarked"
            checked={values.callMarked}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", alignItems: "center", ml: 5 }}>
        <TextField
          sx={{ width: "6.5rem" }}
          id="callMarkedTime"
          type="number"
          variant="outlined"
          onChange={handleChange}
          value={values.callMarkedTime}
        />
        <Typography sx={{ ml: "1rem" }}>
          <Translations text="Seconds" />{" "}
        </Typography>
      </Box>

      <Paper sx={{ mt: 5, p: 5 }}>
        <Typography variant="h5" sx={{ mb: "2rem" }}>
          <Translations text="Permissions & visibility" />{" "}
        </Typography>

        <TableContainer sx={{ pl: "1.5rem", pr: "1.5rem" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Translations text="DESCRIPTION" />{" "}
                </TableCell>
                <TableCell align="left">
                  <Translations text="USER" />{" "}
                </TableCell>
                <TableCell align="left">
                  <Translations text="ADMIN" />{" "}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((row: IPermissions, index: number) => (
                <TableRow
                  key={row.keyName}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Translations text={row.keyName} />
                  </TableCell>
                  <TableCell align="left">
                    <Checkbox
                      checked={row.user}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        handleUpdateUserPermission(event.target.checked, index);
                      }}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Checkbox
                      checked={row.admin}
                      onChange={(event) => {
                        handleUpdateAdminPermission(
                          event.target.checked,
                          index
                        );
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default ClientSettingRouting;

const headCells: ColumnsProps[] = [
  {
    id: "description",
    label: "DESCRIPTION",
  },
  {
    id: "user",
    label: "USER",
  },
  {
    id: "admin",
    label: "ADMIN",
  },
  {
    id: "",
    label: "",
  },
];
