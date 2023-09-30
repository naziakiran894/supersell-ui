// ** Type import
import { VerticalNavItemsType } from "../../layouts/types";
import APP_ROUTES from "../../../Routes/routes";
import { userTypes } from "../../../store/types/globalTypes";
const superAdminNavigation = (): VerticalNavItemsType => {
  return [
    {
      title: "Leads",
      icon: "mdi:user-multiple",
      path: APP_ROUTES.leads,
      permissions: [],
      permissionKey: ["Own + teams leads", "View all leads"],
    },
    {
      title: "Call History",
      path: APP_ROUTES.callHistory,
      icon: "mdi:history",
      permissions: [
        userTypes.SUPER_ADMIN,
        userTypes.ADMIN,
        userTypes.LOGIN_AS_CLIENT,
        userTypes.USER,
      ],
    },
    {
      title: "Scheduled Calls",
      path: APP_ROUTES.scheduledCalls,
      icon: "mdi:clock-outline",
      permissions: [
        userTypes.SUPER_ADMIN,
        userTypes.ADMIN,
        userTypes.LOGIN_AS_CLIENT,
        userTypes.USER,
      ],
    },
    {
      title: "Meetings",
      icon: "mdi:calendar-blank",
      path: APP_ROUTES.meetings,
      permissionKey: ["Meetings"],
      loginAsClient: true,
      permissions: [userTypes.SUPER_ADMIN],
    },
    {
      title: "Reporting",
      icon: "mdi:poll",
      path: APP_ROUTES.reporting,
      loginAsClient: true,
      permissionKey: ["Reporting"],
      permissions: [userTypes.SUPER_ADMIN],
    },
    {
      title: "Clients",
      icon: "mdi:accounts-group",
      path: APP_ROUTES.clients,
      permissions: [userTypes.SUPER_ADMIN],
    },

    {
      sectionTitle: "COMPANY SETTINGS",
      loginAsClient: true,
      permissions: [
        userTypes.SUPER_ADMIN,
        userTypes.ADMIN,
        userTypes.LOGIN_AS_CLIENT,
      ],
    },
    {
      title: "Users",
      path: APP_ROUTES.users,
      icon: "mdi:account-cog",
      loginAsClient: true,
      permissions: [
        userTypes.SUPER_ADMIN,
        userTypes.ADMIN,
        userTypes.LOGIN_AS_CLIENT,
      ],
    },
    {
      title: "Teams",
      icon: "mdi:accounts-group",
      path: APP_ROUTES.teams,
      loginAsClient: true,
      permissions: [
        userTypes.SUPER_ADMIN,
        userTypes.ADMIN,
        userTypes.LOGIN_AS_CLIENT,
      ],
    },
    {
      title: "Public Holidays",
      icon: "mdi:phone-off",
      path: APP_ROUTES.publicHolidays,
      loginAsClient: true,
      permissions: [
        userTypes.SUPER_ADMIN,
        userTypes.ADMIN,
        userTypes.LOGIN_AS_CLIENT,
      ],
    },
    {
      sectionTitle: "SUPER ADMIN",
      permissions: [],
      loginAsClient: true,
    },
    {
      title: "Client Settings",
      icon: "mdi:cog-outline",
      loginAsClient: true,
      path: APP_ROUTES.clientSettings,
      permissions: [],
    },
    {
      title: "Fields",
      icon: "mdi:format-align-justify",
      path: APP_ROUTES.fields,
      loginAsClient: true,
      permissionKey: ["Fields"],
      permissions: [],
    },
    {
      title: "Tags & Stages",
      icon: "mdi:palette-swatch",
      loginAsClient: true,
      permissionKey: ["Tags & Stages"],
      path: APP_ROUTES.tagAndStatuses,
      permissions: [],
    },

    {
      title: "Meetings",
      icon: "mdi:calendar-blank",
      loginAsClient: true,
      permissionKey: ["Meeting settings"],
      path: APP_ROUTES.meetingSettings,
      permissions: [],
    },
    {
      title: "Numbers",
      icon: "mdi:pound",
      loginAsClient: true,
      path: APP_ROUTES.numbers,
      permissions: [],
    },
    {
      title: "Integrations",
      icon: "mdi:compare-horizontal",
      loginAsClient: true,
      path: APP_ROUTES.integrations,
      permissions: [],
    },

    {
      sectionTitle: "MY SETTINGS",
      permissions: [userTypes.USER, userTypes.ADMIN],
    },
    {
      title: "My Schedule",
      icon: "mdi:calendar-check",
      path: APP_ROUTES.schedule,
      permissions: [],
      loginAsClient: true,
      permissionKey: ["Control their own schedule"],
    },
    {
      title: "Days Off",
      icon: "mdi:phone-off",
      path: APP_ROUTES.dayOff,
      permissions: [userTypes.ADMIN, userTypes.LOGIN_AS_CLIENT, userTypes.USER],
    },
    {
      title: "Account",
      icon: "mdi:account",
      path: APP_ROUTES.account,
      permissions: [userTypes.ADMIN, userTypes.LOGIN_AS_CLIENT, userTypes.USER],
    },
  ];
};

export default superAdminNavigation;
