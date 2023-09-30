import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Card, Typography, Box } from "@mui/material";
import { RootState } from "../../../store";
import Icon from "../../../@core/components/icon";

import { Field } from "../../../store/types/fields.types";
import DialogAddLead from "../../../@core/components/AddLead/DialogAddLead";
import { useParams } from "react-router-dom";
import { ILead } from "../../../store/types/lead.types";
import { ICompanyDetailsByID } from "../../../store/types/company.types";
import dayjs from "dayjs";
import { Translation, useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";
import {
  useGetLeadDetailsByIdQuery,
  useGetTeamDetailsByIdQuery,
} from "../../../store/services";

interface IProps {
  leadDetails: ILead;
}

interface IField {
  label: string[];
  value: any;
}

interface ICardProps {
  title: string;
  data?: IField[];
}

const SideCards = ({ leadDetails }: IProps) => {
  const { leadId } = useParams();
  const fields = leadDetails?.companyFieldSetting[0];

  const [show, setShow] = useState(false);
  const [currentCardTitle, setCurrentCardTitle] = useState("");
  const [emptyFieldStatus, setEmptyFieldStatus] = useState(false);

  const clientTimeSetting = useSelector(
    (state: RootState) => state.clientSetting.ClientSetting
  );

  const { data, isLoading: isFetching } = useGetLeadDetailsByIdQuery(leadId);

  //@ts-ignore
  const leadData: ILead = data?.data[0];

  const { data: leadTeamDataById, isLoading: waiting } =
    useGetTeamDetailsByIdQuery(leadData?.teamId || "");
  //@ts-ignore
  let teamName: string = leadTeamDataById?.data?.teamName;

  const { t } = useTranslation();

  useEffect(() => {
    setEmptyFieldStatus(
      leadDetails?.companyFieldSetting[0]?.hideEmptyLeadFields
    );
  }, [leadDetails?.companyFieldSetting[0]?.hideEmptyLeadFields]);

  const cardData = (values: any, key: string) => {
    if (
      key === "customFields" &&
      values?.filter((field: Field) => field.visible)?.length > 0
    ) {
      return values
        ?.filter((field: Field) => field.visible)
        ?.map((e: Field) => {
          let val = "";
          leadDetails?.leadExtraFields?.length &&
            leadDetails?.leadExtraFields?.forEach((obj) => {
              for (let key in obj) {
                if (key === e.keyName) {
                  val = obj[e.keyName] as string;
                }
              }
            });

          return {
            label: [e.value],
            value:
              e.type === "date" || e.type === "dateAndTime"
                ? val
                  ? dayjs(val).format(clientTimeSetting?.defaultDateTimeFormat)
                  : null
                : val,
          };
        });
    } else if (key != "customFields") {
      return values
        ?.filter((field: Field) => field.visible)
        ?.map((e: Field) => {
          return {
            label: [e.value],
            value:
              e?.keyName in leadDetails ? (leadDetails as any)[e.keyName] : "",
          };
        });
    }
  };

  const DetailCard = ({ title, data }: ICardProps) => {
    let name: string = title.toUpperCase();
    return (
      <Card
        sx={{
          p: 5,
          mb: 4,
          backgroundColor: "white",
        }}
      >
        <Box mb={4} display="flex" justifyContent="space-between">
          <Typography
            variant="caption"
            sx={{
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            {t(name)}
            {/* <Translations text={name} /> */}
            {/* {title.replace(/([a-z])([A-Z])/g, "$1 $2")} */}
          </Typography>
          <Icon
            onClick={() => {
              setCurrentCardTitle(title);
              setShow(true);
            }}
            style={{ cursor: "pointer" }}
            icon="mdi:pencil-outline"
            color="gray"
          />
        </Box>

        {data &&
          data?.length > 0 &&
          data?.map((item, index) => {
            return !emptyFieldStatus ? (
              <>
                <Box
                  key={index}
                  sx={{
                    mb: 4,
                    key: { index },
                    columnGap: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: 16,
                      color: "text.secondary",
                    }}
                  >
                    {t(item?.label)}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: 16,
                        color: "text.secondary",
                      }}
                    >
                      {/* {clientTimeSetting?.defaultDateTimeFormat === "other"} */}
                      <Translations text={item?.value} />
                    </Typography>
                  </Box>
                </Box>
              </>
            ) : (
              emptyFieldStatus && item?.value && (
                <Box
                  key={index}
                  sx={{
                    mb: 4,
                    key: { index },
                    columnGap: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: 16,
                      color: "text.secondary",
                    }}
                  >
                    <Translations text={item?.value} /> :
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: 16,
                        color: "text.secondary",
                      }}
                    >
                      <Translations text={item?.value} />
                    </Typography>
                  </Box>
                </Box>
              )
            );
          })}
        {title === "about" && (
          <>
            {" "}
            <Box
              sx={{
                mb: 4,
                columnGap: 2,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: "text.secondary",
                }}
              >
                {t("Team")}:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: 16,
                    color: "text.secondary",
                  }}
                >
                  {/* {clientTimeSetting?.defaultDateTimeFormat === "other"} */}
                  {teamName}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                mb: 4,
                columnGap: 2,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: "text.secondary",
                }}
              >
                {t("Lead Owner")}:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: 16,
                    color: "text.secondary",
                  }}
                >
                  {leadDetails.leadOwnerName}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Card>
    );
  };

  return (
    <Container>
      {fields &&
        Object.entries(fields).map(([key, values], index) => {
          if (key !== "offersAndDeals" && typeof values === "object") {
            const data = cardData(values, key);
            if (data) {
              return <DetailCard key={index} title={key} data={data} />;
            }
          }
        })}
      <DialogAddLead
        title={currentCardTitle}
        setShow={setShow}
        show={show}
        leadId={leadId}
      />
    </Container>
  );
};

export default SideCards;
