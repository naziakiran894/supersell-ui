export type IPermissions = {
  _id: string;
  keyName: string;
  role: string;
};


export interface IUserPermissions {
  "Control their own schedule"?: boolean;
  "Downloads"?: boolean;
  "Reporting"?: boolean;
  "Meetings"?: boolean;
  "Own + teams leads"?: boolean;
  "View all leads"?: boolean;
  "Listen others recordings"?: boolean;
  "Fields"?: boolean;
  "Tags & Stages"?: boolean;
  "Meeting settings"?: boolean;
  "Team settings"?: boolean;
}


export type PermissionKey =
| "Control their own schedule"
| "Downloads"
| "Reporting"
| "Meetings"
| "Own + teams leads"
| "View all leads"
| "Listen others recordings"
| "Fields"
| "Tags & Stages"
| "Meeting settings"
| "Team settings";