import { ILead } from "./lead.types";

interface CallStatus {
  name: string;
  userId: string;
  callStatus: string;
  priority: number;
  firstName?: string;
}

interface TeamInfo {
  _id: string;
  teamName: string;
  doNotDisturbStatus: boolean;
  callRoutingType: string;
  callRecording: boolean;
  addAllUsers: boolean;
  companyId: string;
  createdBy: string;
  isDeleted: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleId: string;
  companyId: string;
  verificationCode: null;
  verified: string;
  stripeSubscriptionId: null;
  stripeCustomerId: null;
  userStatus: string;
  createdBy: null;
  timezone: string;
  isTrial: string;
  language: string;
  notifyVia: string;
  sendWelcomeEmail: boolean;
  doNotDisturbStatus: boolean;
  otp: string;
  isDeleted: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// interface History {
//   _id: string;
//   leadId: string;
//   teamId: string;
//   companyId: string;
//   contactedSalesPersonId: "";
//   callStatus: string;
//   callAttemptedByUsers: CallStatus;
//   createdAt: string;
//   callDirection: string;
//   integrationId: string;
//   callDuration: string;
//   caller: string;
//   __v: number;
//   teamInfo: TeamInfo[];
//   leadInfo: ILead[]; // Replace 'any' with the appropriate type if available
//   userDetails: UserDetails[];
// }

export interface ICallHistory {
  callDirection: string;
  _id: string;
  createdAt: string;
  callStatus: string;
  updatedAt: string;
  teamName: string;
  leadPhone: string;
  leadName: string;
  callAttemptedByUsers: CallStatus[];
  callerName: string;
  callHistorySource?: string;
}
