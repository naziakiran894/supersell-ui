import { ILead } from "./lead.types";

export interface IMeeting {
  _id: string;
  leadId: ILead;
  meetingId: {
    _id: string;
    meetingReminders?: {
      values: string;
      beforeMeeting: string;
      sms: string;
    }[];
    meetingBasicInfo?: {
      meetingTitle: string;
      meetingSubTitle: {
        value: string;
        visible: boolean;
      };
      automaticTag: {};
    };
  };
  meetingDate: string;
  meetingDuration: number;
  meetingBasicInfo?: {
    meetingTitle: string;
    meetingSubTitle: {
      value: string;
      visible: boolean;
    };
    automaticTag: {};
  };
  meetingParticipant: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  leadEmail: string;
  extraFields: {
    elevator: string;
    rooms: number;
    condition: string;
    size: string;
  }[];
}

export interface meetingList {
  fields: {
    "EXTRA INFORMATION": {
      [key: number]: {
        keyName: string;
        order: number;
        type: string;
        value: string;
        visible: boolean;
      };
    };
    Location: {
      [key: number]: {
        keyName: string;
        value: string;
        type: string;
        order: number;
        visible: boolean;
      };
    };
  };
  meetingBasicInfo: {
    automaticTag: {
      value: string;
      visible: boolean;
    };
    meetingSubTitle: {
      value: string;
      visible: boolean;
    };
    meetingTitle: string;
  };

  meetingReminders: {
    [key: number]: {
      beforeMeeting: string;
      sms: string;
      values: string;
    };
  };
  showExtraFields: boolean;
  userId: string;
  _id: string;
}
