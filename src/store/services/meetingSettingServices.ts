import { IMeetingSettings } from "../types/meetingSettings.types";

export const updateMeetingService = (build: any) => {
  return build.mutation({
    query: (payload: IMeetingSettings) => ({
      url: `/api/lead/${payload._id}`,
      method: "PUT",
      data: payload,
    }),
    invalidatesTags: [{ type: "meetingSettings", _id: "meetingSettingsId" }],
  });
};

// for meeting setting
export const getMeetingSetting = (build: any) => {
  return build.query({
    query: () => ({
      url: `/api/meeting`,
      method: "GET",
    }),

    providesTags: (result: any) =>
      result
        ? [
            ...result?.data?.meetings?.map(({ _id }: { _id: string }) => {
              return { type: "meetingSettings" as const, _id };
            }),
            { type: "meetingSettings", _id: "meetingSettingsId" },
          ]
        : [{ type: "meetingSettings", _id: "meetingSettingsId" }],
  });
};

export const addMeetingSetting = (build: any) => {
  return build.mutation({
    query: (payload: IMeetingSettings) => ({
      url: `/api/meeting/`,
      method: "POST",
      data: payload,
    }),
    invalidatesTags: [{ type: "meetingSettings", _id: "meetingSettingsId" }],
  });
};

export const deleteMeetingSettingService = (build: any) => {
  return build.mutation({
    query: (id: string) => ({
      url: `/api/meeting/${id}`,
      method: "DELETE",
    }),

    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "meetingSettings", _id: id },
    ],
  });
};
