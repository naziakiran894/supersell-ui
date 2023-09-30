import { Field } from "./fields.types";

export interface IMeetingSettings {
  companyId: any;
  address: string;
  city: string;
  contactedSalesPersonId: null | string;
  createdAt: string;
  details: string;
  email: string;
  date: number;
  firstName: string;
  isDeleted: "n";
  isLeadConnected: "n";
  isLeadOwner: "n";
  lastName: string;
  phone: string;
  tags: string[];
  updatedAt: string;
  zip: string;
  __v: number;
  _id: string;
}
export interface IMeetings {
  address: string;
  city: string;
  contactedSalesPersonId: null | string;
  createdAt: string;
  details: string;
  email: string;
  date: number;
  firstName: string;
  isDeleted: "n";
  isLeadConnected: "n";
  isLeadOwner: "n";
  lastName: string;
  phone: string;
  tags: string[];
  updatedAt: string;
  zip: string;
  __v: number;
  _id: string;
}

export interface IMeetingSettingsApiData {
  meetingTitle: string;
  _id: string;
  userId: string;
  showExtraFields: boolean;
  meetingBasicInfo: {
    meetingTitle: string;
    meetingSubTitle: {
      value: string;
      visible: boolean;
    };
    automaticTag: {
      value: string;
      visible: boolean;
    };
  };
  fields: {
    [key: string]: Field[];
  };
  meetingReminders: {
    values: string;
    beforeMeeting: string;
    sms: string;
    id: string
  }[];
  dummy?: string;
}

export interface IMeetingSettingRes {
  company: string;
  meetings: IMeetingSettingsApiData[];
}
