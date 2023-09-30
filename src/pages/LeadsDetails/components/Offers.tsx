import React, { ChangeEvent, useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useAddOfferMutation } from "../../../store/services/index";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { ILead, IOfferAndDeals } from "../../../store/types/lead.types";
import LeadDetails from "./LeadDetails";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
7;
import { Translation, useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";

interface IProps {
  leadDetails: ILead;
}

const Offers = ({ leadDetails }: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { leadId } = useParams();

  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [dealAmount, setDealAmount] = useState<number>(0);
  const [sentDate, setSentDate] = useState<Dayjs | null>(null);
  const [presentationDate, setPresentationDate] = useState<Dayjs | null>(null);
  const [signedDate, setSignedDate] = useState<Dayjs | null>(null);

  const [handleAddOffer, { isSuccess, error }] = useAddOfferMutation();

  const fields = useSelector(
    (state: RootState) => state?.fields?.fields?.offersAndDeals
  );

  const clientTimeSetting = useSelector(
    (state: RootState) => state.clientSetting.ClientSetting
  );

  const { t } = useTranslation();

  const handleSubmit = () => {
    if (leadId) {
      handleAddOffer({
        leadId: leadId,
        metaKey: "OFFER_DEALS",
        metaValue: {
          offerAmount: offerAmount,
          dealAmount: dealAmount,
          sendDate: sentDate ? sentDate.format("DD-MM-YYYY") : "",
          presentationDate: presentationDate
            ? presentationDate.format("DD-MM-YYYY")
            : "",
          signedDate: signedDate ? signedDate.format("DD-MM-YYYY") : "",
        },
      });
    }
  };

  useEffect(() => {
    if (leadDetails?.leadExtraInfo?.length > 0) {
      const cIndex = leadDetails?.leadExtraInfo.findIndex(
        (e) => e.metaKey === "OFFER_DEALS"
      );

      if (cIndex !== -1) {
        const cValue = leadDetails?.leadExtraInfo[cIndex];
        setOfferAmount(cValue?.metaValue?.offerAmount || 0);
        setDealAmount(cValue?.metaValue?.dealAmount || 0);
        setPresentationDate(
          cValue?.metaValue?.presentationDate
            ? dayjs(cValue?.metaValue?.presentationDate, "DD-MM-YYYY")
            : null
        );
        setSentDate(
          cValue?.metaValue?.sendDate
            ? dayjs(cValue?.metaValue?.sendDate, "DD-MM-YYYY")
            : null
        );
        setSignedDate(
          cValue?.metaValue?.signedDate
            ? dayjs(cValue?.metaValue?.signedDate, "DD-MM-YYYY")
            : null
        );
      }
    }
  }, [LeadDetails]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(<Translations text="Something went wrong!" />, {
        variant: "error",
      });
      return;
    }
    if (isSuccess) {
      enqueueSnackbar(<Translations text="Offer & Deals Updated" />, {
        variant: "success",
      });
      return;
    }
  }, [error, isSuccess]);

  useEffect(() => {
    if (sentDate || presentationDate || signedDate) {
      handleSubmit();
    }
  }, [sentDate, presentationDate, signedDate]);

  const formatOfferAmount = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  return (
    <>
      <Grid container spacing={5}>
        {fields && fields[0]?.visible && (
          <Grid item xs={5}>
            <FormControl>
              <InputLabel htmlFor="outlined-adornment-amount">
                {t("Offer Amount")}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                endAdornment={
                  <InputAdornment position="end">
                    {clientTimeSetting?.defaultCurrency === "USD" ? "$" : "€"}
                  </InputAdornment>
                }
                label={t("Offer Amount")}
                value={offerAmount ? formatOfferAmount(offerAmount) : null}
                onChange={(
                  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  setOfferAmount(parseInt(e.target.value.replace(/\D/g, "")));
                }}
                onBlur={handleSubmit}
              />
            </FormControl>
          </Grid>
        )}
        {fields && fields[1]?.visible && (
          <Grid item xs={7}>
            <FormControl>
              <DatePicker
                label={t("Offer Sent")}
                format={
                  clientTimeSetting?.defaultDateTimeFormat || "DD.MM.YYYY hh.mm"
                }
                value={sentDate ? dayjs(sentDate) : null}
                onChange={(newValue) => {
                  setSentDate(newValue);
                }}
              />
            </FormControl>
          </Grid>
        )}
        {fields && fields[2]?.visible && (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <DatePicker
                label={t("Offer Presentation")}
                format={
                  clientTimeSetting?.defaultDateTimeFormat || "DD.MM.YYYY hh.mm"
                }
                value={presentationDate}
                onChange={(newValue) => {
                  setPresentationDate(newValue);
                }}
              />
            </FormControl>
          </Grid>
        )}

        {fields && fields[3]?.visible && (
          <Grid item xs={5}>
            <FormControl>
              <InputLabel htmlFor="outlined-adornment-amount">
                {t("Deal Amount")}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                endAdornment={
                  <InputAdornment position="end">
                    {clientTimeSetting?.defaultCurrency === "USD" ? "$" : "€"}
                  </InputAdornment>
                }
                label={t("Deal Amount")}
                value={dealAmount ? formatOfferAmount(dealAmount) : ""}
                onChange={(
                  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  setDealAmount(parseInt(e.target.value.replace(/\D/g, "")));
                }}
                onBlur={() => {
                  handleSubmit();
                }}
              />
            </FormControl>
          </Grid>
        )}
        {fields && fields[4]?.visible && (
          <Grid item xs={7}>
            <FormControl>
              <DatePicker
                label={t("Contract Signed")}
                format={
                  clientTimeSetting?.defaultDateTimeFormat || "DD.MM.YYYY hh.mm"
                }
                // format="DD.MM.YYYY"
                value={signedDate ? dayjs(signedDate) : null}
                onChange={(newValue) => {
                  setSignedDate(newValue);
                }}
              />
            </FormControl>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Offers;
