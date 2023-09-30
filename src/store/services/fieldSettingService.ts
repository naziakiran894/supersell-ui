import { getFields } from "../slices/fieldsSlice";

export const getFieldSettingService = (build: any) => {
  return build.query({
    query: (companyId: string) => {
      if (typeof companyId === "undefined") {
        return { skipToken: true };
      }
      return {
        url: `/api/company-field-setting/${companyId}`,
        method: "GET",
      };
    },
    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      const { data } = await queryFulfilled;
      dispatch(getFields(data));
    },
  });
};

export const updateFieldSettingService = (build: any) => {
  return build.mutation({
    query: (payload: any) => ({
      url: `/api/company-field-setting/`,
      method: "POST",
      data: payload,
    }),
    invalidatesTags: [{ type: "meetingSettings", _id: "meetingSettingsId" }],
  });
};
