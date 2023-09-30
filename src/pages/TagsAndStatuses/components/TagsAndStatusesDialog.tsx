import { Ref, useState, forwardRef, ReactElement, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Dialog,
  Button,
  IconButton,
  Typography,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Fade, { FadeProps } from "@mui/material/Fade";
import Icon from "../../../@core/components/icon";
import { ChromePicker } from "react-color";
import { IProps } from "../common/TagsDragitem";
import Translations from "../../../@core/layouts/Translations";
interface IButtonColor {
  backgroundColor: string;
  textColor: string;
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const TagsAndStatusesDialog = ({ tags, setTags, index, data }: IProps) => {
  const [show, setShow] = useState<boolean>(false);
  const [primaryColor, setPrimaryColor] = useState("#f9f7f7");
  const [secondaryColor, setSecondaryColor] = useState("#000000");

  const handlePrimaryColorChange = (color: {
    hex: React.SetStateAction<string>;
  }) => {
    setPrimaryColor(color.hex);
  };

  const handleSecondaryColorChange = (color: {
    hex: React.SetStateAction<string>;
  }) => {
    setSecondaryColor(color.hex);
  };

  const handleSave = () => {
    const newArray = [...tags];
    newArray[index] = Object.assign({}, newArray[index], {
      backgroundColor: primaryColor,
    });
    newArray[index] = Object.assign({}, newArray[index], {
      textColor: secondaryColor,
    });
    setTags(newArray);
    handleCancel();
  };

  const handleCancel = () => {
    setShow(false);
  };

  useEffect(() => {
    setPrimaryColor(data?.backgroundColor);
    setSecondaryColor(data?.textColor);
  }, [data]);

  return (
    <>
      <Button
        sx={{
          minWidth: "195px",
          padding: "15px",
          height: "35px",
          "&:hover": {
            backgroundColor: data?.backgroundColor,
          },
          color: data?.textColor,
          backgroundColor: data?.backgroundColor,
        }}
        onClick={() => setShow(true)}
      >
        <Translations text={"edit colors"} />
        <Icon
          icon="material-symbols:edit-outline-rounded"
          style={{ height: "18px", marginLeft: "10px" }}
        />
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
              pb: (theme: { spacing: (arg0: number) => any }) =>
                `${theme.spacing(8)} !important`,
              px: (theme: { spacing: (arg0: number) => any }) => [
                `${theme.spacing(5)} !important`,
                `${theme.spacing(15)} !important`,
              ],
              pt: (theme: { spacing: (arg0: number) => any }) => [
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
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                <Translations text="COLOR PICKER" />
              </Typography>
            </Box>
            <Grid container>
              <Grid
                item
                md={8}
                sm={12}
                xs={12}
                display="flex"
                flexDirection="column"
                gap="20px"
                sx={{ my: 5 }}
              >
                <Typography
                  variant="h5"
                  color="black"
                  sx={{
                    my: 10,
                    "@media (max-width: 600px)": {
                      my: 0,
                    },
                  }}
                >
                  <Translations text="Selected Colors" />
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    gap: "20px",
                    "@media (max-width: 600px)": {
                      flexDirection: "row",
                      flexWrap: "wrap",
                    },
                  }}
                >
                  <Box>
                    <Typography sx={{ my: "8px" }}>
                      <Translations text="PRIMARY" />
                    </Typography>

                    <Box
                      style={{
                        width: "100px",
                        height: "100px",
                        backgroundColor: primaryColor,
                      }}
                    ></Box>
                  </Box>
                  <Box>
                    <Typography sx={{ my: "8px" }}>
                      <Translations text="SECONDARY" />
                    </Typography>
                    <Box
                      style={{
                        width: "100px",
                        height: "100px",
                        backgroundColor: secondaryColor,
                      }}
                    ></Box>
                  </Box>
                </Box>
              </Grid>
              <Box>
                <Grid
                  item
                  md={12}
                  sm={12}
                  xs={12}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Typography sx={{ mb: 3 }}>Primary Color</Typography>
                  <ChromePicker
                    color={primaryColor}
                    onChange={handlePrimaryColorChange}
                  />
                </Grid>
                <Grid
                  item
                  md={12}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Typography sx={{ mb: 3 }}>Secondary Color</Typography>
                  <ChromePicker
                    color={secondaryColor}
                    onChange={handleSecondaryColorChange}
                  />
                </Grid>
              </Box>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "center",
              px: (theme: { spacing: (arg0: number) => any }) => [
                `${theme.spacing(5)} !important`,
                `${theme.spacing(15)} !important`,
              ],
              pb: (theme: { spacing: (arg0: number) => any }) => [
                `${theme.spacing(8)} !important`,
                `${theme.spacing(12.5)} !important`,
              ],
            }}
          >
            <Button variant="contained" sx={{ mr: 1 }} onClick={handleSave}>
              <Translations text="SAVE" />
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              <Translations text="Cancel" />
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </>
  );
};

export default TagsAndStatusesDialog;
