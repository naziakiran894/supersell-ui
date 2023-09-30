import {
  Box,
  Typography,
  Card,
  Switch,
  Button,
  CircularProgress,
} from "@mui/material";
import OffersAndDeals from "./components/OffersAndDeals";
import AboutFields from "./components/DefaultFields/About";
import ContactFields from "./components/DefaultFields/Contact";
import CustomField from "./components/CustomField";
import DetailsFields from "./components/DefaultFields/Details";
import Icon from "../../@core/components/icon";
import { useEffect, useState } from "react";
import { Translation, useTranslation } from "react-i18next";

import {
  useGetFieldSettingQuery,
  useUpdateFieldSettingMutation,
} from "../../store/services/index";
import { useParams } from "react-router-dom";
import PageLoader from "../../@core/components/loader/PageLoader";
import WarningDialog from "../../@core/components/warningDialog/WarningDialog";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Translations from "../../@core/layouts/Translations";

export interface FormItem {
  keyName: string;
  visible: boolean;
  order: number;
  type: string;
  value: string;
  onToggleVisibility?: () => void;
}

export interface IGridItem {
  keyName: string;
  value: string;
  type: string;
  visible: boolean;
}

interface IFieldData {
  companyId: string;
  about: {
    keyName: string;
    visible: boolean;
    order: number;
    type: string;
    value: string;
  }[];
  contact: {
    keyName: string;
    visible: boolean;
    order: number;
    type: string;
    value: string;
  }[];
  details: {
    keyName: string;
    visible: boolean;
    order: number;
    type: string;
    value: string;
  }[];
  customFields: IGridItem[];
  offersAndDeals: {
    keyName: string;
    visible: boolean;
    order: number;
    type: string;
    value: string;
  }[];
  hideEmptyLeadFields: boolean;
  __v: number;
}

const INITIAL_CUSTOM_FIELDS = [{
  keyName: "",
  value: "",
  type: "",
  visible: true,
}]

const FieldsSettings = () => {
  const [hideEmptyFields, setHideEmptyFields] = useState(true);
  const [formItems, setFormItems] = useState<FormItem[]>([]);
  const [contactItems, setContactItems] = useState<FormItem[]>([]);
  const [detailsItems, setDetailsItems] = useState<FormItem[]>([]);

  const [customFields, setCustomFields] = useState<IGridItem[]>([]);
  const [aboutItems, setAboutItems] = useState<IGridItem[]>([]);
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  const companyId = useSelector(
    (state: RootState) => state.auth.user?.companyId
  );
  const companyDetails = useSelector(
    //@ts-ignore
    (state: RootState) => state.currentUser?.currentUser?.companyId?.companyName
  );

  const { data, error, isFetching, refetch } = useGetFieldSettingQuery(
    companyId ? companyId : ""
  );
  const [handleUpdateFieldSetting, { isSuccess, isLoading, error: iserror }] =
    useUpdateFieldSettingMutation();
  const { t } = useTranslation();

  //@ts-ignore
  const fieldData: IFieldData = data?.data;

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (fieldData) {
      setFormItems([...fieldData.about]);
      setContactItems([...fieldData?.contact]);
      setDetailsItems([...fieldData?.details]);
      setAboutItems([...fieldData?.offersAndDeals]);
      setHideEmptyFields(fieldData?.hideEmptyLeadFields);
      fieldData?.customFields && fieldData?.customFields?.length && setCustomFields(fieldData?.customFields);
    }
  }, [fieldData]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      enqueueSnackbar("Settings updated successfully.", { variant: "success" });
    } else if (iserror) {
      enqueueSnackbar("Some thing went wrong", { variant: "error" });
    }
  }, [isSuccess, iserror]);

  const handleReset = () => {
    if (fieldData) {
      setFormItems([...fieldData?.about]);
      setContactItems([...fieldData?.contact]);
      setDetailsItems([...fieldData?.details]);
      setAboutItems([...fieldData?.offersAndDeals]);
      setHideEmptyFields(fieldData?.hideEmptyLeadFields);
      fieldData?.customFields && fieldData?.customFields?.length && setCustomFields(fieldData?.customFields);
    }
    setShowWarningDialog(false);
  };

  const handleSubmit = () => {
    const updatedCustomFields = customFields.filter((field) => !!field.keyName)
    const settingData = {
      companyId: companyId,
      about: formItems,
      contact: contactItems,
      details: detailsItems,
      customFields: updatedCustomFields,
      offersAndDeals: aboutItems,
      hideEmptyLeadFields: hideEmptyFields,
    };
    handleUpdateFieldSetting(settingData);
  };

  if (isFetching && !isSuccess) {
    return <PageLoader />;
  }
  return (
    <>
      <Box my={5}>
        <Typography variant="h5">
          <Translations text="Fields Settings" />{" "}
        </Typography>
        <Typography
          sx={{ fontWeight: "400", fontSize: "14px", color: "#3A354199" }}
        >
          <Translations text={companyDetails} />{" "}
        </Typography>
      </Box>
      <Card sx={{ px: 5, pt: 7 }}>
        <Typography variant="body2" fontWeight={600}>
          <Translations text="DEFAULT FIELDS" />
        </Typography>
        <AboutFields formItems={formItems} setFormItems={setFormItems} />
        <ContactFields
          formItems={contactItems}
          setFormItems={setContactItems}
        />
        <DetailsFields
          formItems={detailsItems}
          setFormItems={setDetailsItems}
        />
        <CustomField
          customFields={customFields?.length ? customFields : INITIAL_CUSTOM_FIELDS}
          setCustomFields={setCustomFields}
        />
        <OffersAndDeals aboutItems={aboutItems} setAboutItems={setAboutItems} />

        <Box sx={{ m: 7, maxWidth: "750px" }}>
          <Typography fontSize="16px" fontWeight="600">
            <Translations text="Hide empty fields from user UI and emails" />
          </Typography>{" "}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography fontSize="14px" fontWeight="400">
              <Translations text="Automatically hide field labels and rows if there is no data" />
            </Typography>
            <Switch
              onChange={(e) => setHideEmptyFields(e.target.checked)}
              checked={hideEmptyFields}
            />
          </Box>
        </Box>
        <Box display="flex" gap="10px" m={5} my={10}>
          <Button
            disabled={isLoading}
            variant="contained"
            sx={{ width: "205px" }}
            onClick={() => {
              handleSubmit();
            }}
          >
            {isLoading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              <Translations text="Save Changes" />
            )}
          </Button>
          <Button onClick={() => setShowWarningDialog(true)} variant="outlined">
            <Translations text="Reset" />
          </Button>
        </Box>
      </Card>

      <WarningDialog
        content="Are you sure you want to reset form?"
        buttonText="Confirm"
        show={showWarningDialog}
        setShow={setShowWarningDialog}
        onConfirm={handleReset}
      />
    </>
  );
};

export default FieldsSettings;
