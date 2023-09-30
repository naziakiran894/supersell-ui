import { useParams } from "react-router-dom";
import { useGetMeetingDetailsByLeadIdQuery } from "../../../../store/services";
import AddMeetingForm from "./AddMeetingForm";
import { ILead } from "../../../../store/types/lead.types";
import { Card } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

interface IProps {
  leadDetails: ILead;
}

const index = ({ leadDetails }: IProps) => {
  const { leadId } = useParams();
  useGetMeetingDetailsByLeadIdQuery(leadId);

  //@ts-ignore
  const meetingDetails = useSelector(
    (state: RootState) => state?.leadMeeting?.meeting
  );

  return (
    <Card>
      <AddMeetingForm
        leadDetails={leadDetails}
        meetingDetails={meetingDetails}
      />
    </Card>
  );
};

export default index;
