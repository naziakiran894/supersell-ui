import {
  Grid,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Switch,
} from "@mui/material";
import Icon from "../../../../@core/components/icon";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import Translations from "../../../../@core/layouts/Translations";

type IProps = {
  aboutItems: any;
  setAboutItems: any;
};
const OffersAndDeals = ({ aboutItems, setAboutItems }: IProps) => {
  const handleVisibility = (keyName: string) => {
    setAboutItems((prevItems: any) =>
      //@ts-ignore
      prevItems.map((item) => {
        if (item.keyName === keyName) {
          return { ...item, visible: !item.visible };
        }
        return item;
      })
    );
  };
  const { t } = useTranslation();

  return (
    <Fragment>
      <Box m={5}>
        <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>
          <Translations text="OFFERS AND DEALS" />
        </Typography>
        <Typography sx={{ fontSize: "14px", color: "#3A354199" }}>
          <Translations text="If all these fields are hidden also the module will be hidden from Lead view" />
        </Typography>
      </Box>

      <Grid container spacing={5} m={5} maxWidth={"800px"}>
        {aboutItems?.map((grid: any, index: number) => (
          <Grid
            key={index}
            item
            sm={6}
            xs={12}
            display="flex"
            alignItems="center"
            gap="10px"
          >
            <TextField
              disabled
              label={t("Title")}
              defaultValue={grid.keyName}
              variant="outlined"
              sx={{ width: "300px" }}
            />
            <IconButton
              size="small"
              onClick={() => handleVisibility(grid.keyName)}
            >
              <Icon
                icon={grid.visible ? "mdi:eye-outline" : "mdi:eye-off-outline"}
                color="black"
              />
            </IconButton>
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
};
export default OffersAndDeals;
