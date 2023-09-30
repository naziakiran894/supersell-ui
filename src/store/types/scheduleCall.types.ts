import { ILead } from "./lead.types";
import { IUser } from "./user.types";

export type ICallSchedule = {
  followUp: number;
  role: any;
  scheduledFor?: string;
  _id: string;
  scheduledCallDateTime?: string;
  noteToCall?: string;
  teamId?: string | null;
  userId?: string;
  companyId?: string;
  lead?: ILead;
  user?: IUser;
  createdBy: string;
  team?: string;
  __v: number;
};
