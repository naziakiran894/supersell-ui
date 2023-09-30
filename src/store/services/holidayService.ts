import { IHoliday } from "../types/holiday.type";
interface IQueryParams {
  limit?: number;
  offset?: number;
  yearQuery?: string;
  countryQuery?: string;
}
export const getAllHolidays = (build: any) => {
  return build.query({
    query: ({ limit, offset, yearQuery, countryQuery }: IQueryParams) => ({
      url: `/api/holiday?offset=${offset || 0}&limit=${limit || 10}&y=${
        yearQuery || ""
      }&c=${countryQuery || ""}`,
      method: "GET",
    }),
    providesTags: (result: any) =>
      result
        ? [
            ...result?.data?.list?.map(({ _id }: { _id: string }) => {
              return { type: "holiday" as const, _id };
            }),
            { type: "holiday", _id: "_id" },
          ]
        : [{ type: "holiday", _id: "_id" }],
  });
};

export const getHolidayByYear = (build: any) => {
  return build.query({
    query: (payload: { year: string }) => ({
      url: `/api/holiday/${payload.year}`,
      method: "GET",
    }),
    // providesTags: (result: any) =>
    //   result
    //     ? [
    //         ...result?.data?.map(({ _id }: { _id: string }) => {
    //           return { type: "users" as const, _id };
    //         }),
    //         { type: "users", _id: "userId" },
    //       ]
    //     : [{ type: "users", _id: "userId" }],
  });
};

export const addHolidayService = (build: any) => {
  return build.mutation({
    query: (payload: IHoliday) => ({
      url: `/api/holiday/`,
      method: "POST",
      data: payload,
    }),
    invalidatesTags: [{ type: "holiday", _id: "_id" }],
  });
};


export const updateHolidayService = (build: any) => {
  return build.mutation({
    query: (payload: IHoliday) => ({
      url: `/api/holiday/${payload._id}`,
      method: "PUT",
      data: payload,
    }),
    invalidatesTags: ({ _id }: { _id: string }) => [
      { type: "holiday", _id: _id },
    ],
  });
};

export const deleteHoliday = (build: any) => {
  return build.mutation({
    query: (id: string) => ({
      url: `/api/holiday/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: (result: {}, error: string, _id:string) => [
      { type: "holiday", _id: _id },
    ],
  });
};

export const updateDoNotDisturbCustomHolidayService = (build: any) => {
  return build.mutation({
    query: ({ id, doNotDisturbStatus }: { id: string; doNotDisturbStatus: boolean }) => ({
      url: `/api/holiday/donotdisturb/${id}`,
      method: "PUT",
      data: { doNotDisturb:doNotDisturbStatus },
    }),
    invalidatesTags: (result: {}, error: string, _id:string) => [
      { type: "holiday", _id: _id },
    ],
  });
};

export const getHolidayById = (build: any) => {
  return build.query({
    query: (userId: string) => ({
      url: `/api/holiday/${userId}`,
      method: "GET",
    }),
    providesTags: (result:any, error:string, id:string) => [{ type: 'holiday', _id:id }],
  });
};
