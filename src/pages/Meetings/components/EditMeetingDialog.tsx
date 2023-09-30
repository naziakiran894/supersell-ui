import { Dialog, IconButton, DialogContent, Card } from "@mui/material";
import Icon from "../../../@core/components/icon/index";

import { Field } from "../../../store/types/fields.types";
import AddMeetingForm from "../../LeadsDetails/components/AddMeeting/AddMeetingForm";
import { useGetMeetingDetailsByIdQuery } from "../../../store/services";
import { ILead } from "../../../store/types/lead.types";
import { IMeeting } from "../../../store/types/meeting.types";
import PageLoader from "../../../@core/components/loader/PageLoader";

export interface IAddMeetings extends Field {
  selectmeeting: string;
  date: any;
  ourcompany: string;
  customer: string;
  timeZone?: string;
  duration?: string;
  [key: string]: string | any;
}

interface IProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  show: boolean;
  meetingId: string;
}

const DialogEditMettings = ({ setShow, show, meetingId }: IProps) => {
  const { data, isLoading } = useGetMeetingDetailsByIdQuery(meetingId);

  //@ts-ignore
  const leadDetails: ILead = data?.data?.leadId;
  //@ts-ignore
  const meetingDetails: IMeeting = data?.data;

  return (
    <>
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
          {isLoading ? (
            <PageLoader />
          ) : (
            <AddMeetingForm
              setShow={setShow}
              leadDetails={leadDetails}
              meetingDetails={meetingDetails}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogEditMettings;
