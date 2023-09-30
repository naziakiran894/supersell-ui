// ** MUI Imports

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Icon from "../../../@core/components/icon";
import { Grid } from "@mui/material";
import { ICartStatType } from "../Reporting";
import Translations from "../../../@core/layouts/Translations";

interface Props {
  data: ICartStatType;
}

const CardStatsCharacter = ({ data }: Props) => {
  // ** Vars
  const { title, stats, icon, bgColor, number } = data;

  return (
    <Card
      sx={{
        overflow: "visible",
        display: "flex",
        flexDirection: "row",
        width: "100%",
      }}
    >
      <Grid container>
        <Grid
          item
          xs={8}
          sx={{
            mb: 1.5,
            rowGap: 1,
            alignItems: "flex-start",
            padding: "14px",
          }}
        >
          <Typography sx={{ mb: 6.5, fontWeight: 600, fontSize: "15px" }}>
            <Translations text={title} />
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: "600" }}>
            {stats}
          </Typography>
          <Typography sx={{ mb: 6.5, fontSize: "15px" }}>{number}</Typography>
        </Grid>
        <Grid
          item
          bgcolor={bgColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          borderRadius="0px 5px 5px 0px"
          xs={4}
        >
          <Icon icon={icon} fontSize={50} />
        </Grid>
      </Grid>
    </Card>
  );
};

export default CardStatsCharacter;
