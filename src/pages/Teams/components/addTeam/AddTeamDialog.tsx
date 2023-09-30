import { Ref, useState, forwardRef, ReactElement, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import {
  Box,
  Dialog,
  Button,
  IconButton,
  Typography,
  DialogContent,
  DialogActions,
  Card,
  CircularProgress,
} from "@mui/material";
import Fade, { FadeProps } from "@mui/material/Fade";
import Icon from "../../../../@core/components/icon/index";
import AddTeamForm from "./AddTeamForm";
import {
  useAddTeamMutation,
  useUpdateTeamMutation,
  useGetTeamDetailsByIdQuery,
} from "../../../../store/services";
import PageLoader from "../../../../@core/components/loader/PageLoader";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { userTypes } from "../../../../store/types/globalTypes";
import Translations from "../../../../@core/layouts/Translations";

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

export interface IAddTeam {
  company: string;
  teamName: string;
  doNotDisturb: boolean;
  doNotDisturbStatus: boolean;
  companyId: string;
  show: boolean;
  setShow: any;
  userId?: string;
  values: boolean;
  timeZone: string;
}

interface IProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  show: boolean;
  companyId?: string;
}

const DialogEditUserInfo = ({ setShow, show, companyId }: IProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [
    handleUpdateTeam,
    { isSuccess: isUpdated, isLoading: isUpdating, error: updatedError },
  ] = useUpdateTeamMutation();
  const [handleAddTeam, { isLoading, isSuccess, error }] = useAddTeamMutation();
  const { data, isLoading: isFetching } = useGetTeamDetailsByIdQuery(
    companyId ? companyId : ""
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const addTeamSchema = Yup.object({
    company:
      user?.roleName === userTypes.SUPER_ADMIN
        ? Yup.string().required("Company is required")
        : Yup.string(),
    teamName: Yup.string().required("Name is required"),
    timeZone: Yup.string().required("Time zone is required"),
  });

  //@ts-ignore
  const teamDetails = data?.data;

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(<Translations text="Team added successfully." />, {
        variant: "success",
      });
      setShow(false);
    } else if (error) {
      //@ts-ignore
      enqueueSnackbar(error.data.data.error, { variant: "error" });
    } else if (isUpdated) {
      enqueueSnackbar(<Translations text="Team updated successfully." />, {
        variant: "success",
      });
      setShow(false);
    } else if (updatedError) {
      //@ts-ignore
      enqueueSnackbar(<Translations text="Something went wrong!" />, {
        variant: "error",
      });
    }
  }, [isSuccess, error, isUpdated, updatedError]);

  return (
    <>
      <Card>
        <Dialog
          fullWidth
          open={show}
          maxWidth="md"
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
            <IconButton
              size="small"
              onClick={() => setShow(false)}
              sx={{ position: "absolute", right: "1rem", top: "1rem" }}
            >
              <Icon icon="mdi:close" />
            </IconButton>
            <Box sx={{ mb: 8, textAlign: "center" }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                {teamDetails?._id ? "EDIT TEAM" : "ADD TEAM"}
              </Typography>
            </Box>
            {isFetching && companyId ? (
              <PageLoader />
            ) : (
              <Formik
                initialValues={{
                  teamName: "",
                  company: "",
                  timeZone: "",
                  doNotDisturb: false,
                }}
                validationSchema={addTeamSchema}
                onSubmit={(values) => {
                  if (companyId) {
                    handleUpdateTeam({
                      _id: companyId,
                      teamName: values.teamName,
                      companyId: values.company,
                      doNotDisturbStatus: values.doNotDisturb,
                      timezone: values.timeZone,
                    });
                  } else {
                    handleAddTeam({
                      teamName: values.teamName,
                      companyId: values.company,
                      doNotDisturbStatus: values.doNotDisturb,
                      timezone: values.timeZone,
                    });
                  }
                }}
              >
                {(props) => {
                  const { handleSubmit } = props;
                  return (
                    <form onSubmit={handleSubmit}>
                      <AddTeamForm
                        teamDetails={teamDetails || null}
                        //@ts-ignore
                        props={props}
                      />

                      <DialogActions
                        sx={{
                          justifyContent: "center",
                          pt: "2rem",
                          px: (theme) => [
                            `${theme.spacing(5)} !important`,
                            `${theme.spacing(15)} !important`,
                          ],
                          pb: (theme) => [
                            `${theme.spacing(8)} !important`,
                            `${theme.spacing(12.5)} !important`,
                          ],
                        }}
                      >
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={isLoading}
                          sx={{ mr: 1 }}
                        >
                          {isLoading || isUpdating ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                            />
                          ) : teamDetails?._id ? (
                            "Update"
                          ) : (
                            "Save"
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
                  );
                }}
              </Formik>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
};

export default DialogEditUserInfo;
