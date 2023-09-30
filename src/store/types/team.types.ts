export interface IPartialUser {
  email: string;
  firstName: string;
  _id: string;
}
export interface ITeam {
  company: unknown;
  _id: string;
  teamName: string;
  doNotDisturbStatus: boolean;
  isDeleted: string;
  teamSchedule: any[];
  available: boolean;
  companyId: string;
  callRecording?: boolean;
  callRoutingType?: "round_robin" | "simultaneous";
  users?: IPartialUser[];
  timezone?: string;
}

export interface ITeamList {
  _id: string;
  teamName: string;
}

interface IPriority {
  userId: string;
  priority: string | number;
}

export interface ITeamUsers extends ITeam {
  teamUsers?: IPriority[];
  team?: Partial<ITeam>;
}
