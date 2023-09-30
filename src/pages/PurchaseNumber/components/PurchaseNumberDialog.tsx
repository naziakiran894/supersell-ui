// ** React Imports
import { Ref, useState, forwardRef, ReactElement, useEffect, useMemo } from "react";

// ** MUI Imports
import {
  Box,
  Grid,
  Card,
  FormHelperText,
  CircularProgress,
  Autocomplete,
} from "@mui/material";

import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Fade, { FadeProps } from "@mui/material/Fade";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import Icon from "../../../@core/components/icon";
import { FormLabel, Radio, RadioGroup } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useAddPurchaseNumberMutation, useGetAllTwilioAvailableNumbersQuery } from "../../../store/services";
import { useSnackbar } from "notistack";
import { IPurchaseNumber, AvailableNumber } from "../../../store/types/purchaseNumber.types";
import Translations from "../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";
import { ITimezone } from "../../../store/types/timezone.types";

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const validationSchema = Yup.object().shape({
  numberName: Yup.string().required("Name is required"),
  countryShortName: Yup.string().required("Country is required"),
  type: Yup.string().required("Type is required"),
  number: Yup.number().required("Please select a number"),
});

const initialValues: IPurchaseNumber = {
  numberName: "",
  countryShortName: "",
  countryId: "",
  type: "",
  areaCode: 0,
  number: "",
};



const PurchaseNumberDialog = () => {
  const timezoneList = useSelector((state: RootState) => state?.timeZones.timezone);
  const { enqueueSnackbar } = useSnackbar();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: values => {
      handleAddNumber({
        numberName: values.numberName,
        countryId: values.countryId,
        type: values.type,
        areaCode: values.areaCode,
        number: values.number,
      });
    }
  });

  //dissabled for now
  // const { data } = useGetAllTwilioAvailableNumbersQuery(
  //   { countryCode: formik.values.countryShortName, areaCode: formik.values.areaCode },
  //   { skip: (!formik.values.countryShortName) }
  // )


  const countryShortName = useMemo(() => timezoneList?.find(
    (item: ITimezone) => item?.countryShortName === formik.values.countryShortName
  ) || null, [timezoneList, formik.values.countryShortName])

  //@ts-ignore
  // const availableNumbers: AvailableNumber[] = data?.data || []

  const availableNumbers = [
    {
      "friendlyName": "(320) 361-6260",
      "phoneNumber": "+13203616260",
    },
  ]

  const [show, setShow] = useState<boolean>(false);

  const [handleAddNumber, { isLoading, isSuccess, error }] =
    useAddPurchaseNumberMutation();


  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(<Translations text={"Team added successfully."} />, {
        variant: "success",
      });
      setShow(false);
    } else if (error) {
      //@ts-ignore
      enqueueSnackbar(error.data.data.error, { variant: "error" });
    }
  }, [isSuccess, error]);
  const { t } = useTranslation();

  console.log('availableNumbers', availableNumbers)

  return (
    <>
      <Button
        sx={{ mb: 2, backgroundColor: "none" }}
        variant="contained"
        onClick={() => setShow(true)}
      >
        <Translations text="PURCHASE NUMBER" />
      </Button>
      <Card>
        <Dialog
          fullWidth
          open={show}
          maxWidth="md"
          scroll="body"
          onClose={() => setShow(false)}
          TransitionComponent={Transition}
          onBackdropClick={() => setShow(false)}
        >
          <DialogContent
            sx={{
              position: "relative",
              pb: (theme) => `${theme.spacing(8)} !important`,
              px: (theme) => [
                `${theme.spacing(5)} !important`,

                `${theme.spacing(15)} !important`,
              ],
              pt: (theme) => [
                `${theme.spacing(8)} !important`,
                `${theme.spacing(12.5)} !important`,
              ],
            }}
          >
            <IconButton
              size="small"
              onClick={() => setShow(false)}
              sx={{ position: "absolute", right: "1rem", top: "1rem" }}
            >
              <Icon icon="mdi:close" />
            </IconButton>
            <Box sx={{ mb: 8, textAlign: "center" }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                <Translations text="PURCHASE NUMBER" />
              </Typography>
            </Box>

            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={6} sx={{ my: 5 }}>
                <Grid item sm={12} xs={12}>
                  <TextField
                    name="numberName"
                    fullWidth
                    label={t("Name of the number")}
                    value={formik.values.numberName}
                    onChange={(e) => formik.handleChange({
                      target: {
                        name: "numberName",
                        value: e.target.value,
                      },
                    })}
                    error={formik.touched.numberName && !!formik.errors.numberName}
                    helperText={formik.touched.numberName && formik.errors.numberName}
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <FormControl
                    fullWidth
                    error={formik.touched.countryShortName && Boolean(formik.errors.countryShortName)}
                  >
                    {formik.values.countryShortName && (
                      <InputLabel
                        id="countryShortName"
                        error={
                          formik.touched.countryShortName && Boolean(formik.errors.countryShortName)
                        }
                        shrink
                      >
                        <Translations text="Country" />
                      </InputLabel>
                    )}
                    <Autocomplete
                      options={timezoneList || []}
                      getOptionLabel={(option) => option?.countryName}
                      value={countryShortName}
                      onChange={(e, value) => {
                        formik.handleChange({
                          target: {
                            name: "countryShortName",
                            value: value?.countryShortName || "",
                          },
                        });
                        formik.handleChange({
                          target: {
                            name: "countryId",
                            value: value?._id || "",
                          },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("Country")}
                          error={
                            formik.touched.countryShortName && Boolean(formik.errors.countryShortName)
                          }
                        />
                      )}
                    />
                    {formik.touched.countryShortName && (
                      <FormHelperText>{formik.errors.countryShortName}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <TextField
                    name="type"
                    fullWidth
                    label={t("Type")}
                    onChange={(e) => formik.handleChange({
                      target: {
                        name: "type",
                        value: e.target.value,
                      },
                    })}
                    value={formik.values.type}
                    error={formik.touched.type && !!formik.errors.type}
                    helperText={formik.values.type && formik.errors.type}
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <TextField
                    name="areaCode"
                    fullWidth
                    label={t("Area code")}
                    onChange={(e) => formik.handleChange({
                      target: {
                        name: "areaCode",
                        value: e.target.value,
                      },
                    })}
                    value={formik.values.areaCode}
                    error={formik.touched.areaCode && !!formik.errors.areaCode}
                  />
                </Grid>
              </Grid>
              <Grid item container spacing={2}>
                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel
                      sx={{ color: "black !important", my: "10px" }}
                    >
                      <Translations text="Available Numbers" />
                    </FormLabel>

                    <RadioGroup aria-labelledby="number">
                      <Grid container spacing={2}>
                        {availableNumbers.map((number: AvailableNumber) => (
                          <Grid item xs={4} key={number.phoneNumber}>
                            <FormControlLabel
                              value={number.phoneNumber}
                              control={<Radio />}
                              onClick={(e) => formik.handleChange({
                                target: {
                                  name: "number",
                                  value: number.phoneNumber,
                                },
                              })}
                              label={number.phoneNumber}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </RadioGroup>
                    {formik.errors.number && formik.values.number && (
                      <div style={{ color: "red" }}>{formik.errors.number}</div>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <DialogActions
                sx={{
                  justifyContent: "center",
                  px: (theme) => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(15)} !important`,
                  ],
                  pb: (theme) => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(12.5)} !important`,
                  ],
                  pt: (theme) => [
                    `${theme.spacing(4)} !important`,
                    `${theme.spacing(12)} !important`,
                  ],
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isLoading}
                  sx={{ mr: 1 }}
                >
                  {isLoading ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    <Translations text="PURCHASE" />
                  )}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setShow(false)}
                >
                  <Translations text="Cancel" />
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
};

export default PurchaseNumberDialog;
