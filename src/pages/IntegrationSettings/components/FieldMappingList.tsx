import React, { ChangeEvent, useRef, useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";

import { Field, IField } from "../../../store/types/fields.types";
import { useSnackbar } from "notistack";
import Translations from "../../../@core/layouts/Translations";

type IProps = {
  copySuccess: string;
  setCopySuccess: React.Dispatch<React.SetStateAction<string>>;
  fields: IField | null;
  setIntegrationName: React.Dispatch<React.SetStateAction<string>>;
  integrationName: string;
  formik: FormikProps<any>;
};

const FieldsList = ({
  copySuccess,
  fields,
  integrationName,
  formik,
}: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { values: formikValues, errors, touched, handleChange } = formik;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(copySuccess);
      enqueueSnackbar("Copied to clipboard!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m={10}>
      <Grid container display="flex" justifyContent="space-between">
        <Grid item lg={4} sm={8} display="flex" flexDirection="column">
          <label
            htmlFor=""
            style={{
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            <Translations text={"INTEGRATION NAME"} />
          </label>
          <TextField
            value={formikValues?.integrationName || ""}
            name="integrationName"
            onChange={handleChange}
            error={touched.integrationName && Boolean(errors.integrationName)}
            helperText={
              touched.integrationName && (errors.integrationName as string)
            }
            variant="outlined"
            fullWidth
            sx={{ marginTop: "10px" }}
          />
        </Grid>
        {copySuccess && (
          <Grid
            container
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginTop="30px"
            gap="20px"
          >
            <Grid item lg={"auto"} sm={10}>
              <li style={{ listStyle: "none" }}>
                <a
                  href={copySuccess}
                  style={{
                    display: "inline-block",
                    maxWidth: "1000px",
                    overflow: "hidden",
                    wordBreak: "break-word",
                    pointerEvents: "none",
                  }}
                >
                  {copySuccess}
                </a>
              </li>
            </Grid>
            <Grid item lg={1} md={1} sm={10}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={copy}
                sx={{ cursor: "pointer" }}
              >
                <Translations text={"COPY"} />
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>

      <Box mt={10}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "500",
            textTransform: "uppercase",
          }}
        >
          <Translations text={"Field Mapping"} />
        </Typography>
      </Box>

      <Grid container spacing={8} mt={8}>
        {fields !== null &&
          Object.entries(fields).map(([key, values]) => {
            if (key !== "offersAndDeals" && typeof values === "object") {
              return values?.map((item: Field, index: number) => {
                // setKeyValue(item.keyName);
                return (
                  <Grid
                    item
                    key={index}
                    lg={6}
                    sm={12}
                    display="flex"
                    alignItems="center"
                  >
                    <Typography
                      minWidth="110px"
                      variant="body2"
                      color="text.primary"
                    >
                      <Translations text={item.value} />:
                    </Typography>
                    <TextField
                      name={item.keyName}
                      value={formikValues ? formikValues[item.keyName] : ""}
                      onChange={handleChange}
                      error={
                        touched[item.keyName] && Boolean(errors[item.keyName])
                      }
                      helperText={
                        touched[item.keyName] &&
                        (errors[item.keyName] as string)
                      }
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                );
              });
            }
          })}
      </Grid>
    </Box>
  );
};

export default FieldsList;
