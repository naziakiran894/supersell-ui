import { downloadCsv } from "../helpers/downloadCsv";
import { getLeadMeeting } from "../slices/leadMeetingSlice";

interface IQueryParams {
  limit?: number;
  offset?: number;
  searchQuery?: string;
  order?: 1 | -1;
  sort?: string;
  teamId: string;
  leadOwnerId: string;
  meetingId: string;
  startDate?: string;
  endDate?: string;
}

export const getAllMeetingService = (build: any) => {
  return build.query({
    query: ({
      limit,
      offset,
      searchQuery,
      sort,
      order,
      teamId,
      leadOwnerId,
      meetingId,
      startDate,
      endDate,
    }: IQueryParams) => ({
      url: `/api/lead-meeting?offset=${offset || 0}&limit=${limit || 10}&q=${
        searchQuery || ""
      }&tid=${teamId}&loid=${leadOwnerId}&meetingId=${meetingId}&startDate=${
        startDate || ""
      }&endDate=${endDate || ""} `,
      method: "GET",
    }),
    providesTags: (result: any) =>
      result
        ? [
            ...result?.data.list?.map(({ _id }: { _id: string }) => {
              return { type: "leadMeetings" as const, _id };
            }),
            { type: "leadMeetings", _id: "meetingSettingsId" },
          ]
        : [{ type: "leadMeetings", _id: "meetingSettingsId" }],
  });
};

export const updateMeetingService = (build: any) => {
  return build.mutation({
    query: (payload: any) => ({
      url: `/api/lead-meeting/${payload._id}`,
      method: "PUT",
      data: payload,
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "leadMeetings", _id: id },
    ],
  });
};

export const downloadMeetingService = (build: any) => {
  return build.mutation({
    query: (id: string) => ({
      url: `/api/lead-meeting/download/csv`,
      method: "GET",
    }),

    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      const { data } = await queryFulfilled;
      downloadCsv(data, "meetings.csv");
    },
  });
};

export const addMeetingService = (build: any) => {
  return build.mutation({
    query: (payload: any) => ({
      url: `/api/lead-meeting/`,
      method: "POST",
      data: payload,
    }),
    invalidatesTags: [{ type: "leadMeetings", _id: "meetingSettingsId" }],
  });
};

export const getMeetingDetailsByIdService = (build: any) => {
  return build.query({
    query: (id: string) => ({
      url: `/api/lead-meeting/${id}`,
      method: "GET",
    }),
    providesTags: (result: {}, error: string, id: string) => [
      { type: "leadMeetings", _id: id },
    ],
  });
};

export const getMeetingDetailsByLeadIdService = (build: any) => {
  return build.query({
    query: (id: string) => ({
      url: `/api/lead-meeting/get/${id}`,
      method: "GET",
    }),

    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      try {
        const { data } = await queryFulfilled;
        if (data) {
          dispatch(getLeadMeeting(data));
        }
      } catch (error) {
        dispatch(getLeadMeeting(null));

        console.log(error, "error");
      }
    },
    providesTags: (result: {}, error: string, id: string) => [
      { type: "leadMeetings", _id: id },
    ],
  });
};

export const deleteMeetingService = (build: any) => {
  return build.mutation({
    query: (id: string) => ({
      url: `/api/lead-meeting/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "leadMeetings", _id: id },
    ],
  });
};

export const getMeetingFilterService = (build: any) => {
  return build.query({
    query: (id: string) => ({
      url: `/api/meeting`,
      method: "GET",
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "leadMeetings", _id: id },
    ],
  });
};
