import { downloadCsv } from "../helpers/downloadCsv";
import { ILead } from "../types/lead.types";

interface IQueryParams {
  limit?: number;
  offset?: number;
  searchQuery?: string;
  order?: 1 | -1;
  sort?: string;
  leadOwnerId: string;
  teamId: string;
  numberId: string;
  startDateRange: string;
  endDateRange: string;
}

export const addScheduleCallService = (build: any) => {
  return build.mutation({
    query: (payload: ILead) => ({
      url: `/api/scheduled-call/`,
      method: "POST",
      data: payload,
    }),

    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "callSchedule", _id: id },
    ],
  });
};

export const updateScheduleCallService = (build: any) => {
  return build.mutation({
    query: (payload: ILead) => ({
      url: `/api/scheduled-call/${payload._id}`,
      method: "PUT",
      data: payload,
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "callSchedule", _id: id },
    ],
  });
};

export const getAllScheduleCallService = (build: any) => {
  return build.query({
    query: ({
      limit,
      offset,
      searchQuery,
      sort,
      order,
      leadOwnerId,
      teamId,
      numberId,
      startDateRange,
      endDateRange,
    }: IQueryParams) => ({
      url: `/api/scheduled-call?offset=${offset || 0}&limit=${limit || 10}&q=${
        searchQuery || ""
      }&sort=${sort}&order=${order}&loid=${leadOwnerId}&tid=${teamId}&nid=${numberId}&sd=${startDateRange}&ed=${endDateRange}`,
      method: "GET",
    }),
    providesTags: (result: any) =>
      result
        ? [
            ...result?.data?.list?.map(({ _id }: { _id: string }) => {
              return { type: "callSchedule" as const, _id };
            }),
            { type: "callSchedule", _id: "callId" },
          ]
        : [{ type: "callSchedule", _id: "callId" }],
  });
};

export const getScheduleCallById = (build: any) => {
  return build.query({
    query: (id: string) => ({
      url: `/api/scheduled-call/${id}`,
      method: "GET",
    }),
    providesTags: (result: {}, error: string, id: string) => [
      { type: "callSchedule", _id: id },
    ],
  });
};

export const downloadScheduleService = (build: any) => {
  return build.mutation({
    query: (id: string) => ({
      url: `/api/scheduled-call/download`,
      method: "GET",
    }),

    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      const { data } = await queryFulfilled;
      downloadCsv(data, "scheduleCall.csv");
    },
  });
};

export const getScheduleCallByLeadIdService = (build: any) => {
  return build.query({
    query: (id: string) => ({
      url: `/api/scheduled-call/get/${id}`,
      method: "GET",
    }),
    providesTags: (_result: any, _error: any, id: string) => [
      { type: "callSchedule", _id: id },
    ],
  });
};

export const deleteScheduleCallService = (build: any) => {
  return build.mutation({
    query: (id: string) => ({
      url: `/api/scheduled-call/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "callSchedule", _id: id },
    ],
  });
};
