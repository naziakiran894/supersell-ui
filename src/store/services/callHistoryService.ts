import { downloadCsv } from "../helpers/downloadCsv";

interface IQueryParams {
  endDate: string;
  startDate?: string;
  callerNumber?: string;
  limit: number;
  offset: string;
  teamId: string;
  userId: string;
  searchQuery: string;
  order?: 1 | -1;
  sort?: string;
}

export const getCallHistoryService = (build: any) => {
  return build.query({
    query: ({
      teamId,
      userId,
      callerNumber,
      limit,
      offset,
      startDate,
      endDate,
      searchQuery,
      order,
      sort,
    }: IQueryParams) => ({
      url: `/api/call-history?team=${teamId || ""}&user=${
        userId || ""
      }&offset=${offset || 0}&q=${searchQuery || ""}&limit=${
        limit || 10
      }&startDate=${startDate || ""}&endDate=${endDate || ""}&callerNumber=${
        callerNumber || ""
      }&sort=${sort}&order=${order}`,
      method: "GET",
    }),
  });
};
export const downloadCallHistoryService = (build: any) => {
  return build.mutation({
    query: (id: string) => ({
      url: `/api/call-history/download`,
      method: "GET",
    }),

    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      const { data } = await queryFulfilled;
      downloadCsv(data, "callHistory.csv");
    },
  });
};
