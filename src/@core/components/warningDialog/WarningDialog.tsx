import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import Fade, { FadeProps } from "@mui/material/Fade";
import { Ref, forwardRef, ReactElement } from "react";
import Translations from "../../layouts/Translations";

interface IWarningDialog {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  buttonText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  content?: string;
  name?: string;
}

const WarningDialog = ({
  show,
  setShow,
  onConfirm,
  buttonText = "Delete",
  isLoading,
  content = "Are you sure you want to delete?",
  name,
}: IWarningDialog) => {
  return (
    <Dialog
      fullWidth
      open={show}
      maxWidth="xs"
      scroll="body"
      onClose={() => setShow(false)}
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
        <Grid
          container
          textAlign="center"
          justifyContent="center
        "
        >
          <Grid item sm={12}>
            <Typography>
              <Translations text={content} />
            </Typography>
            <Typography alignItems="center" fontWeight={600}>
              {name}
            </Typography>
          </Grid>
          <Grid
            mt={5}
            item
            sm={12}
            sx={{ display: "flex", justifyContent: "center", gap: 4 }}
          >
            <Button variant="outlined" onClick={() => setShow(false)}>
              <Translations text="Cancel" />
            </Button>
            <Button
              disabled={isLoading}
              sx={{ minWidth: "100px" }}
              onClick={onConfirm}
              variant="contained"
            >
              {isLoading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                <Translations text={buttonText} />
              )}
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default WarningDialog;
