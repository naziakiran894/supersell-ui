import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../helpers/intercepter";
import {
  userLogin,
  setPasswordService,
  forgotPasswordService,
  GoogleLoginService,
  loginAsClient,
} from "./authService";

import {
  addUserService,
  getAllUsersService,
  deleteUserService,
  getUserDetailsById,
  updateUserService,
  updateDoNotDisturbStatusService,
  getCurrentUserById,
} from "./userService";

import {
  addTeamService,
  getAllTeamsService,
  deleteTeamService,
  getTeamDetailsById,
  updateTeamService,
  getTeamsListService,
  updateDoNotDisturbStatusTeamService,
} from "./teamService";

import {
  addLeadService,
  getAllLeadService,
  deleteLeadService,
  getLeadDetailsById,
  updateLeadService,
  addNoteService,
  addOfferService,
  deleteNoteService,
  addLeadTagsService,
  downloadLeadService,
  setStageService,
  getLeadHistory,
} from "./leadService";

import {
  getMeetingSetting,
  addMeetingSetting,
  deleteMeetingSettingService,
} from "./meetingSettingServices";

import { getTeamSettingsById, addTeamSettings } from "./teamSettings";

import {
  addIntegrationService,
  getIntegrationDetailsById,
  updateIntegrationService,
} from "./integrationServices ";

import {
  addCompanyService,
  getAllCompanyService,
  deleteCompanyService,
  getCompanyDetailsById,
  updateCompanyService,
  updateCompanyStatus,
  updateCompanyDetailsById,
  getCompanyRoutingList,
} from "./companyServices";

import {
  getUserRoleService,
  getCompaniesService,
  getTimezoneService,
  getPermissionsService,
  getLeadRoutingService,
} from "./commanApiService";

import { getSchedule, updateSchedule } from "./scheduleService";

import { getTeamSchedule, updateTeamSchedule } from "./teamScheduleService";

import {
  getAllHolidays,
  getHolidayByYear,
  addHolidayService,
  deleteHoliday,
  updateDoNotDisturbCustomHolidayService,
  getHolidayById,
  updateHolidayService,
} from "./holidayService";

import {
  getDaysOffService,
  deleteDaysService,
  updateDaysOffService,
  addDaysOffService,
  getDaysDetailsById,
  updateDoNotDisturbDayOffService,
  updateAllDaysOffService,
} from "./daysOffServices";

import { getTeamUsersById, updateTeamUsersService } from "./teamUser";

import {
  getFieldSettingService,
  updateFieldSettingService,
} from "./fieldSettingService";

import {
  addTagsAndStatuses,
  getTagsAndStatuses,
} from "./tagsAndStatusesServices";

import {
  addPurchaseNumberService,
  getAllPurchaseNumberService,
  deletePurchaseNumberService,
  getAllTwilioAvailableNumbers
} from "./purchaseNumberService";

import {
  getNumberSettingByIdService,
  getAllNumbersService,
  getUserListService,
  addNumberSettingService,
  getUserRoutingService,
  getTeamUserListService,
} from "./purchaseNumberSettingService";

import {
  addScheduleCallService,
  getAllScheduleCallService,
  getScheduleCallById,
  updateScheduleCallService,
  getScheduleCallByLeadIdService,
  downloadScheduleService,
  deleteScheduleCallService,
} from "./scheduleCallService";

import {
  addMeetingService,
  getMeetingDetailsByIdService,
  getMeetingDetailsByLeadIdService,
  getAllMeetingService,
  deleteMeetingService,
  updateMeetingService,
  getMeetingFilterService,
  downloadMeetingService,
} from "./leadMeetingServices";

import {
  addIntegrationSettingService,
  getIntegrationDetailsByCompanyId,
  getIntegrationById,
  deleteIntegrationService,
  integrationStatus,
} from "./IntegrationSettingService";
import { getReporting, getGraph } from "./ReportingService";

import { getIntegrationHistoryService } from "./integrationHistoryService";
import {
  downloadCallHistoryService,
  getCallHistoryService,
} from "./callHistoryService";
import { getAllLeadSourcePerformance } from "./SalesPerformanceService";

//@ts-ignore
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const appSlice = createApi({
  reducerPath: "app",
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),

  tagTypes: [
    "users",
    "teams",
    "schedule",
    "holiday",
    "companies",
    "leads",
    "daysOff",
    "meetings",
    "integrations",
    "permissions",
    "teamSettings",
    "purchaseNumber",
    "tags",
    "callSchedule",
    "leadMeetings",
    "meetingSettings",
    "integrations",
    "allLeadSourcePerformance",
    "getReporting",
  ],

  endpoints: (build) => ({
    GoogleLogin: GoogleLoginService(build),
    userLogin: userLogin(build),
    setPassword: setPasswordService(build),
    forgotPassword: forgotPasswordService(build),
    loginAsClient: loginAsClient(build),

    addUser: addUserService(build),
    updateUser: updateUserService(build),
    getUserList: getAllUsersService(build),
    deleteUser: deleteUserService(build),
    getUserDetailById: getUserDetailsById(build),
    getCurrentUserById: getCurrentUserById(build),
    updateDoNotDisturbStatus: updateDoNotDisturbStatusService(build),

    addTeam: addTeamService(build),
    updateTeam: updateTeamService(build),
    getTeamList: getAllTeamsService(build),
    deleteTeam: deleteTeamService(build),
    getTeamDetailsById: getTeamDetailsById(build),
    getAllTeams: getTeamsListService(build),
    updateDoNotDisturbTeamStatus: updateDoNotDisturbStatusTeamService(build),

    addLead: addLeadService(build),
    updateLead: updateLeadService(build),
    getLeadList: getAllLeadService(build),
    deleteLead: deleteLeadService(build),
    getLeadDetailsById: getLeadDetailsById(build),
    addNote: addNoteService(build),
    deleteNote: deleteNoteService(build),
    addOffer: addOfferService(build),
    addLeadTags: addLeadTagsService(build),
    downloadLead: downloadLeadService(build),
    setStage: setStageService(build),
    getLeadHistory: getLeadHistory(build),

    addMeeting: addMeetingService(build),
    getMeetingDetailsById: getMeetingDetailsByIdService(build),
    getMeetingDetailsByLeadId: getMeetingDetailsByLeadIdService(build),

    getMeetingFilter: getMeetingFilterService(build),

    updateMeeting: updateMeetingService(build),
    getMeetingList: getAllMeetingService(build),
    deleteMeeting: deleteMeetingService(build),
    downloadMeeting: downloadMeetingService(build),

    getMeetingSetting: getMeetingSetting(build),
    addMeetingSetting: addMeetingSetting(build),
    deleteMeetingSetting: deleteMeetingSettingService(build),

    addIntegration: addIntegrationService(build),
    updateIntegration: updateIntegrationService(build),
    deleteIntegration: deleteIntegrationService(build),
    getIntegrationDetailsById: getIntegrationDetailsById(build),
    // updateDoNotDisturbIntegrationStatus: updateDoNotDisturbStatusIntegrationService(build),

    addCompany: addCompanyService(build),
    updateCompany: updateCompanyService(build),
    getCompanyList: getAllCompanyService(build),
    deleteCompany: deleteCompanyService(build),
    getCompanyDetailsById: getCompanyDetailsById(build),
    updateCompanyStatus: updateCompanyStatus(build),
    updateCompanyDetailsById: updateCompanyDetailsById(build),
    getCompanyRoutingList: getCompanyRoutingList(build),

    getDaysOff: getDaysOffService(build),
    deleteDays: deleteDaysService(build),
    updateDaysOff: updateDaysOffService(build),
    addDaysOff: addDaysOffService(build),
    updateAllDaysOff: updateAllDaysOffService(build),
    getDaysDetailsById: getDaysDetailsById(build),
    updateDayDnd: updateDoNotDisturbDayOffService(build),

    getSchedule: getSchedule(build),
    updateSchedule: updateSchedule(build),

    getTagsAndStatuses: getTagsAndStatuses(build),
    addTagsAndStatuses: addTagsAndStatuses(build),

    getTeamSchedule: getTeamSchedule(build),
    updateTeamSchedule: updateTeamSchedule(build),

    getTeamUsers: getTeamUsersById(build),
    updateTeamUsers: updateTeamUsersService(build),

    getCompanies: getCompaniesService(build),
    getUserRoles: getUserRoleService(build),
    getPermissions: getPermissionsService(build),
    getTimezones: getTimezoneService(build),
    getLeadRoutingService: getLeadRoutingService(build),

    getAllHolidays: getAllHolidays(build),
    getHolidayByYear: getHolidayByYear(build),
    addHoliday: addHolidayService(build),
    deleteHoliday: deleteHoliday(build),
    getHolidayById: getHolidayById(build),
    updateHoliday: updateHolidayService(build),
    updateDoNotDisturbCustomHoliday:
      updateDoNotDisturbCustomHolidayService(build),

    updateFieldSetting: updateFieldSettingService(build),
    getFieldSetting: getFieldSettingService(build),

    getTeamSettingsById: getTeamSettingsById(build),
    addTeamSettings: addTeamSettings(build),

    addPurchaseNumber: addPurchaseNumberService(build),
    getAllPurchaseNumber: getAllPurchaseNumberService(build),
    deletePurchaseNumber: deletePurchaseNumberService(build),
    getAllTwilioAvailableNumbers: getAllTwilioAvailableNumbers(build),
    // updatePurchaseNumber: updatePurchaseNumberService(build),

    getNumberSettingById: getNumberSettingByIdService(build),
    getAllNumbers: getAllNumbersService(build),
    getAllLeadSourcePerformance: getAllLeadSourcePerformance(build),

    getUsersList: getUserListService(build),
    addNumberSetting: addNumberSettingService(build),
    getUserRouting: getUserRoutingService(build),
    getTeamUserList: getTeamUserListService(build),

    addScheduleCall: addScheduleCallService(build),
    getAllScheduleCall: getAllScheduleCallService(build),
    getScheduleCallById: getScheduleCallById(build),
    updateScheduleCall: updateScheduleCallService(build),
    getScheduleCallByLeadId: getScheduleCallByLeadIdService(build),
    downloadScheduleService: downloadScheduleService(build),
    deleteScheduleCallService: deleteScheduleCallService(build),

    addIntegrationSetting: addIntegrationSettingService(build),
    getIntegrationDetailsByCompanyId: getIntegrationDetailsByCompanyId(build),
    getIntegrationById: getIntegrationById(build),
    updateIntegrationListStatus: integrationStatus(build),

    getIntegrationHistory: getIntegrationHistoryService(build),
    getCallHistoryService: getCallHistoryService(build),
    downloadCallHistory: downloadCallHistoryService(build),

    getReporting: getReporting(build),
    getGraph: getGraph(build),
  }),
});
export default appSlice;
export const {
  useGoogleLoginMutation,
  useUserLoginMutation,
  useSetPasswordMutation,
  useForgotPasswordMutation,
  useLoginAsClientMutation,

  useUpdateUserMutation,
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUserListQuery,
  useUpdateDoNotDisturbStatusMutation,
  useGetUserDetailByIdQuery,
  useGetCurrentUserByIdMutation,

  useUpdateTeamMutation,
  useAddTeamMutation,
  useDeleteTeamMutation,
  useGetTeamListQuery,
  useGetTeamDetailsByIdQuery,
  useUpdateDoNotDisturbTeamStatusMutation,
  useGetAllTeamsQuery,

  useGetLeadListQuery,
  useUpdateLeadMutation,
  useAddLeadMutation,
  useDeleteLeadMutation,
  useGetLeadDetailsByIdQuery,
  useAddNoteMutation,
  useAddOfferMutation,
  useDeleteNoteMutation,
  useAddLeadTagsMutation,
  useDownloadLeadMutation,
  useSetStageMutation,
  useGetLeadHistoryQuery,

  useGetMeetingListQuery,
  useUpdateMeetingMutation,
  useAddMeetingMutation,
  useDeleteMeetingMutation,
  useGetMeetingDetailsByIdQuery,
  useGetMeetingDetailsByLeadIdQuery,
  useGetMeetingFilterQuery,
  useDownloadMeetingMutation,

  useUpdateIntegrationMutation,
  useAddIntegrationMutation,
  useDeleteIntegrationMutation,
  useGetIntegrationDetailsByIdQuery,

  useUpdateCompanyMutation,
  useAddCompanyMutation,
  useDeleteCompanyMutation,
  useGetCompanyListQuery,
  useGetCompanyDetailsByIdQuery,
  useUpdateCompanyStatusMutation,
  useUpdateCompanyDetailsByIdMutation,
  useGetCompanyRoutingListQuery,

  useGetTimezonesMutation,
  useGetCompaniesMutation,
  useGetUserRolesMutation,
  useGetPermissionsMutation,
  useGetLeadRoutingServiceQuery,

  useDeleteDaysMutation,
  useGetDaysOffQuery,
  useAddDaysOffMutation,
  useUpdateDaysOffMutation,
  useUpdateDayDndMutation,
  useGetDaysDetailsByIdQuery,
  useUpdateAllDaysOffMutation,

  useGetScheduleQuery,
  useUpdateScheduleMutation,

  useGetTagsAndStatusesQuery,
  useAddTagsAndStatusesMutation,

  useGetMeetingSettingQuery,
  useAddMeetingSettingMutation,
  useDeleteMeetingSettingMutation,

  useGetTeamUsersQuery,
  useUpdateTeamUsersMutation,

  useGetTeamScheduleQuery,
  useUpdateTeamScheduleMutation,

  useGetAllHolidaysQuery,
  useGetHolidayByYearQuery,
  useAddHolidayMutation,
  useDeleteHolidayMutation,
  useUpdateDoNotDisturbCustomHolidayMutation,
  useGetHolidayByIdQuery,
  useUpdateHolidayMutation,

  useGetFieldSettingQuery,
  useUpdateFieldSettingMutation,

  useGetTeamSettingsByIdQuery,
  useAddTeamSettingsMutation,

  useAddPurchaseNumberMutation,
  useGetAllPurchaseNumberQuery,
  useDeletePurchaseNumberMutation,
  useGetAllTwilioAvailableNumbersQuery,

  useGetNumberSettingByIdQuery,
  useGetAllNumbersQuery,
  useGetUsersListQuery,
  useAddNumberSettingMutation,
  useGetUserRoutingQuery,
  useGetTeamUserListQuery,

  useAddScheduleCallMutation,
  useGetAllScheduleCallQuery,
  useGetScheduleCallByIdQuery,
  useUpdateScheduleCallMutation,
  useGetScheduleCallByLeadIdQuery,
  useDownloadScheduleServiceMutation,
  useDeleteScheduleCallServiceMutation,

  useAddIntegrationSettingMutation,
  useGetIntegrationDetailsByCompanyIdQuery,
  useGetIntegrationByIdQuery,

  useGetIntegrationHistoryQuery,
  useUpdateIntegrationListStatusMutation,

  useGetCallHistoryServiceQuery,
  useDownloadCallHistoryMutation,

  useGetAllLeadSourcePerformanceQuery,
  useGetReportingQuery,
  useGetGraphQuery,
} = appSlice;
