import { Dayjs } from "dayjs";

// export interface IRetry {
//   attemptValue: number;
//   attemptType: string;
// }

// export interface IFollowUpData {
//   type: "call" | "sms";
//   value: number;
//   minOrHour: "min" | "hour";
//   callType: "regular" | "schedule";
//   sms?: boolean;
//   smsText?: string;
//   phone: boolean;
//   time: Dayjs | null;
// }

// export interface IFollowUpSetting {
//   day: string;
//   data: IFollowUpData[];
// }

export interface IRetry {
  attemptValue: number;
  attemptType: string;
}

export interface IFollowUpData {
  type: "call" | "sms";
  value: number;
  minOrHour: "min" | "hour";
  callType: "regular" | "schedule";
  sms?: boolean;
  smsText?: string;
  phone: boolean;
  time: Dayjs | null;
  id: string;
}

export interface IFollowUpSetting {
  day: string;
  data: IFollowUpData[];
}

interface UserRetries {
  active: boolean;
  noOfRetries: number;
  retries: IRetry[];
  followUpSettings: IFollowUpSetting[];
}

interface LeadRoutingSettings {
  outboundLeadOwnerRouting: string;
  outboundCallRoutingType: string;
  inboundCallRoutingExistingNumber: string;
  inboundCallRoutingTypeExistingNumber: string;
  _id: string;
}

interface Team {
  _id: string;
  teamName: string;
  doNotDisturbStatus: boolean;
}

export interface ITeamSettings {
  _id: string;
  callerIdForUser: string;
  callerIdForLead: string;
  whisperText: string;
  whisperLanguage: string;
  userRetries: UserRetries;
  sendSMSToLeadIfTeamOffline: {
    active?: boolean;
    sms?: string;
  };
  followUpSettings: IFollowUpSetting[];
  followUpRules: IFollowUpSetting[];
  leadRoutingSettings: LeadRoutingSettings;
  fallbackTeam: string;
  rescheduleCallIfTeamIsOffline: boolean;
  outboundIntegrationUrl: string;
  __v: number;
  team: Team;
}
