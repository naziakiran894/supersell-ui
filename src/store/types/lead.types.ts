import { INote } from "./../../pages/LeadsDetails/components/Notes";
import { IField } from "./fields.types";
import { ITagsAndStatuses } from "./tagsAndStatuses.types";

export interface ILead {
  scheduleCallDetails: ScheduleCallDetails;
  meetingDate: string;
  callAttemptedByUsers: { callLead: boolean }[];
  isLeadConnected: string;
  _id: string;
  firstName?: string;
  lastName?: string;
  teamId: string;
  leadOwnerId?: string;
  phone?: string;
  email?: string;
  address?: string;
  zipCode?: number;
  city?: string;
  description?: string;
  message?: string;
  category?: string;
  comment?: string;
  source?: string;
  typeOfBuilding?: string;
  buildYear?: number;
  size?: string;
  rooms?: number;
  floor?: number;
  elevator?: string;
  condition?: string;
  plot?: string;
  schedule?: string;
  timezone?: string;
  sourceId?: string;
  crmId?: string;
  tags?: ITagsAndStatuses[];
  leadExtraFields?: {
    [key: string]: number | string;
  }[];
  leadExtraInfo: any[];
  companyFieldSetting: IField[];
  leadStage?: string;
  leadStageId?: string;
  leadOwnerName?: string;
}
interface ScheduleCallDetails {
  scheduledCallDateTime: string;
}
export interface IOfferAndDeals {
  leadId: string;
  metaKey: "OFFER_DEALS" | "NOTES";
  metaValue: {
    offerAmount?: number;
    dealAmount?: number;
    sendDate?: string;
    presentationDate?: string;
    signedDate?: string;
  };
}

export interface ILeadDetails {
  address: string;
  companyFieldSetting: [];
  email: string;
  firstName: string;
  lastName: string;
  leadExtraInfo: IOfferAndDeals[] | INote[];
  leadHistory: [];
  phone: string | number;
  zip: string;
  _id: string;
}
