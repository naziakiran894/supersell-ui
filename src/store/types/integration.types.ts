import { IField } from "./fields.types";

interface DefaultSettings {
  routeToTeam: string;
  leadOwner: string;
}

interface RoutingRule {
  ruleId: number;
  fieldType: string;
  condition: string;
  fieldValue1: string;
  fieldValue2: string;
  routeToTeam: string;
  leadOwner: string;
  _id: string;
}

export interface IIntegration {
  defaultSettings: DefaultSettings;
  _id: string;
  integrationName: string;
  webhookUrl: string;
  webhookHistory: any;
  routingRules: RoutingRule[][];
  isDeleted: string;
  companyId: string;
  fields: IField;
  createdAt: string;
  latestEvent: string;
  updatedAt: string;
  __v: number;
  isActive: boolean;
}
