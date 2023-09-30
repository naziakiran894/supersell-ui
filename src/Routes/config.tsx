import { ReactNode } from "react";
import APP_ROUTES from "./routes";
import LoginPage from "../pages/Login/index";
import Setpassword from "../pages/SetPassword";
import Users from "../pages/Users/index";
import Teams from "../pages/Teams/index";
import Reporting from "../pages/Reporting";
import Leads from "../pages/Leads";
import TeamSchedule from "../pages/TeamSchedule";
import EditTeamUsers from "../pages/EditTeamUsers";
import TeamSettings from "../pages/TeamSetting/index";
import Settings from "../pages/Settings";
import { userTypes } from "../store/types/globalTypes";
import ClientSettings from "../pages/ClientSettings";
import CallSchedule from "../pages/CallSchedule/index";
import Schedule from "../pages/Settings/components/schedule";
import PublicHolidays from "../pages/PublicHolidays/index";
import FieldsSettings from "../pages/FieldSettings";
import MeetingSettings from "../pages/MeetingSettings/index";
import ForgotPassword from "../pages/ForgotPassword";
import CallHistoryDetails from "../pages/CallHistoryDetails";

import ScheduledCallsTable from "../pages/CallSchedule/ScheduledCalls/index";
import Company from "../pages/Company";
import Overview from "../pages/LeadsDetails/index";
import Meetings from "../pages/Meetings";
import IntegrationList from "../pages/IntegrationList";
import IntegrationHistory from "../pages/IntegrationHistory";
import PurchaseNumber from "../pages/PurchaseNumber";
import TagsAndStatuses from "../pages/TagsAndStatuses";
import PurchaseNumberSetting from "../pages/PurchaseNumberSetting";
import { Typography } from "@mui/material";
import { PermissionKey } from "../store/types/permisssions.types";
import IntegrationSettings from "../pages/IntegrationSettings";
import PvNumberSettings from "../pages/pvNumberSettings/index";

export interface IRouteConfig {
  path: string;
  component: ReactNode;
  permission: string[];
  layout?: boolean;
  title?: string;
  icon?: string;
  loginAsClient?: true;
  permissionKey?: PermissionKey[];
}

export const routesConfig: IRouteConfig[] = [
  {
    path: APP_ROUTES.login,
    component: <LoginPage />,
    layout: false,
    permission: [],
  },
  {
    path: APP_ROUTES.home,
    component: <LoginPage />,
    layout: false,
    permission: [],
  },
  {
    path: APP_ROUTES.forgetPassword,
    component: <ForgotPassword />,
    layout: false,
    permission: [],
  },
  {
    path: APP_ROUTES.setPassword,
    component: <Setpassword />,
    layout: false,
    permission: [],
  },
  {
    path: APP_ROUTES.reporting,
    component: <Reporting />,
    layout: true,
    loginAsClient: true,
    permission: [userTypes.SUPER_ADMIN],
    permissionKey: ["Reporting"],
  },
  {
    path: APP_ROUTES.leads,
    component: <Leads />,
    layout: true,
    permission: [userTypes.SUPER_ADMIN, userTypes.ADMIN, userTypes.USER],
  },
  {
    path: APP_ROUTES.account,
    component: <Settings />,
    layout: true,
    permission: [userTypes.SUPER_ADMIN, userTypes.ADMIN, userTypes.USER],
  },
  {
    path: APP_ROUTES.schedule,
    component: <Settings />,
    layout: true,
    loginAsClient: true,
    permission: [],
    permissionKey: ["Control their own schedule"],
  },
  {
    path: APP_ROUTES.dayOff,
    component: <Settings />,
    layout: true,
    permission: [userTypes.SUPER_ADMIN, userTypes.ADMIN, userTypes.USER],
  },
  {
    path: APP_ROUTES.numbers,
    component: <PurchaseNumber />,
    layout: true,
    permission: [],
    loginAsClient: true,
  },
  {
    path: `${APP_ROUTES.purchaseNumberSetting}/:id`,
    component: <PurchaseNumberSetting />,
    // component: <PvNumberSettings />,
    layout: true,
    loginAsClient: true,
    permission: [userTypes.SUPER_ADMIN, userTypes.ADMIN, userTypes.USER],
  },
  {
    path: `${APP_ROUTES.PvNumberSettings}/:id`,
    component: <PvNumberSettings />,
    layout: true,
    loginAsClient: true,
    permission: [userTypes.SUPER_ADMIN, userTypes.ADMIN, userTypes.USER],
  },

  {
    path: `${APP_ROUTES.schedule}/:id`,
    component: <Schedule />,
    layout: true,
    loginAsClient: true,
    permission: [userTypes.SUPER_ADMIN, userTypes.ADMIN],
  },
  {
    path: APP_ROUTES.leadsDetails,
    component: <Overview />,
    layout: true,
    permission: [userTypes.SUPER_ADMIN, userTypes.ADMIN, userTypes.USER],
  },
  {
    path: `${APP_ROUTES.leadsDetails}/:leadId`,
    component: <Overview />,
    layout: true,
    permission: [userTypes.SUPER_ADMIN, userTypes.ADMIN, userTypes.USER],
  },
  {
    path: APP_ROUTES.addMeeting,
    component: <Overview />,
    layout: true,
    permission: [userTypes.SUPER_ADMIN, userTypes.ADMIN, userTypes.USER],
  },

  {
    path: APP_ROUTES.callHistory,
    component: <CallSchedule />,
    layout: true,

    permission: [userTypes.SUPER_ADMIN, userTypes.ADMIN, userTypes.USER],
  },
  {
    path: `${APP_ROUTES.callHistory}/:callId`,
    component: <CallHistoryDetails />,
    layout: true,
    permission: [userTypes.SUPER_ADMIN, userTypes.ADMIN, userTypes.USER],
  },
  {
    path: APP_ROUTES.scheduledCalls,
    component: <CallSchedule />,
    layout: true,
    loginAsClient: true,
    permission: [userTypes.SUPER_ADMIN, userTypes.ADMIN, userTypes.USER],
  },

  {
    path: APP_ROUTES.meetings,
    component: <Meetings />,
    layout: true,
    permission: [userTypes.SUPER_ADMIN, userTypes.ADMIN, userTypes.USER],
  },
  {
    path: APP_ROUTES.teams,
    component: <Teams />,
    layout: true,
    loginAsClient: true,
    permission: [
      userTypes.SUPER_ADMIN,
      userTypes.ADMIN,
      userTypes.LOGIN_AS_CLIENT,
    ],
  },
  {
    path: APP_ROUTES.fields,
    component: <FieldsSettings />,
    layout: true,
    permission: [],
    loginAsClient: true,
    permissionKey: ["Fields"],
  },
  {
    path: APP_ROUTES.tagAndStatuses,
    component: <TagsAndStatuses />,
    layout: true,
    permission: [],
    loginAsClient: true,
    permissionKey: ["Tags & Stages"],
  },
  {
    path: APP_ROUTES.meetingSettings,
    component: <MeetingSettings />,
    layout: true,
    permission: [],
    loginAsClient: true,
    permissionKey: ["Meeting settings"],
  },
  {
    path: APP_ROUTES.integrations,
    component: <IntegrationList />,
    layout: true,
    permission: [userTypes.ADMIN],
    loginAsClient: true,
  },
  {
    path: `${APP_ROUTES.integrationHistory}/:integrationId`,
    component: <IntegrationHistory />,
    layout: true,
    permission: [userTypes.ADMIN],
    loginAsClient: true,
  },
  {
    path: APP_ROUTES.publicHolidays,
    component: <PublicHolidays />,
    layout: true,
    loginAsClient: true,
    permission: [
      userTypes.SUPER_ADMIN,
      userTypes.ADMIN,
      userTypes.LOGIN_AS_CLIENT,
    ],
  },

  {
    path: APP_ROUTES.scheduleCallSettings,
    component: <ScheduledCallsTable />,
    layout: true,
    loginAsClient: true,
    permission: [userTypes.USER, userTypes.ADMIN, userTypes.SUPER_ADMIN],
  },
  {
    path: APP_ROUTES.dayOff,
    component: <Settings />,
    layout: true,
    permission: [userTypes.USER],
  },

  {
    path: `${APP_ROUTES.teamSettings}/:teamId`,
    component: <TeamSettings />,
    layout: true,
    permission: [
      userTypes.SUPER_ADMIN,
      userTypes.LOGIN_AS_CLIENT,
      userTypes.ADMIN,
    ],
    loginAsClient: true,
    permissionKey:[ "Team settings"],
  },
  {
    path: APP_ROUTES.integrationSetting,
    component: <IntegrationSettings />,
    layout: true,
    permission: [],
    loginAsClient: true,
  },
  {
    path: `${APP_ROUTES.integrationSetting}/:integrationId`,
    component: <IntegrationSettings />,
    layout: true,
    permission: [],
    loginAsClient: true,
  },
  {
    path: `${APP_ROUTES.editTeamUser}/:teamId`,
    component: <EditTeamUsers />,
    layout: true,
    loginAsClient: true,
    permission: [
      userTypes.SUPER_ADMIN,
      userTypes.LOGIN_AS_CLIENT,
      userTypes.ADMIN,
    ],
  },
  {
    path: `${APP_ROUTES.teamSchedule}/:teamId`,
    component: <TeamSchedule />,
    layout: true,
    loginAsClient: true,
    permission: [
      userTypes.SUPER_ADMIN,
      userTypes.LOGIN_AS_CLIENT,
      userTypes.ADMIN,
    ],
  },
  {
    path: APP_ROUTES.clientSettings,
    component: <ClientSettings />,
    layout: true,
    permission: [],
    loginAsClient: true,
  },
  {
    path: APP_ROUTES.users,
    component: <Users />,
    layout: true,
    loginAsClient: true,
    permission: [
      userTypes.SUPER_ADMIN,
      userTypes.LOGIN_AS_CLIENT,
      userTypes.ADMIN,
    ],
  },
  {
    path: APP_ROUTES.clients,
    component: <Company />,
    layout: true,
    permission: [userTypes.SUPER_ADMIN, userTypes.LOGIN_AS_CLIENT],
  },
  {
    path: APP_ROUTES.notFound,
    component: <Typography>Page Not Found</Typography>,
    layout: true,
    permission: [
      userTypes.SUPER_ADMIN,
      userTypes.LOGIN_AS_CLIENT,
      userTypes.ADMIN,
      userTypes.USER,
    ],
  },
];
