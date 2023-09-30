import { IValues } from "../../pages/PurchaseNumberSetting";

export const getNumberSettingByIdService = (build: any) => {
  return build.query({
    query: (id: string) => ({
      url: `/api/twilio-number-setting/${id}`,
      method: "GET",
    }),
  });
};

export const getAllNumbersService = (build: any) => {
  return build.query({
    query: () => ({
      url: `/api/twilio-number/list/numbers`,
      method: "GET",
    }),
  });
};

export const getUserListService = (build: any) => {
  return build.query({
    query: () => ({
      url: `/api/user/list/all`,
      method: "GET",
    }),
  });
};

export const getTeamUserListService = (build: any) => {
  return build.query({
    query: (selectedTeam: string) => ({
      url: `/api/teamuser/${selectedTeam}/users-belongs-to-team`,
      method: "GET",
    }),
  });
};

export const addNumberSettingService = (build: any) => {
  return build.mutation({
    query: (payload: any) => ({
      url: `/api/twilio-number-setting/`,
      method: "POST",
      data: payload,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  });
};

export const getUserRoutingService = (build: any) => {
  return build.query({
    query: () => ({
      url: `/api/lead/lead-owner/routing/setting/list`,
      method: "GET",
    }),
  });
};
