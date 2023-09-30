import { IDaysOff } from "../types/daysoff.types";

export const getDaysOffService = (build: any) => {
  return build.query({
    query: () => ({
      url: `/api/userdayoff`,
      method: "GET",
    }),
    providesTags: (result: any) =>
      result
        ? [
            ...result?.data?.list?.holidays?.map(({ _id }: { _id: string }) => {
              return { type: "daysOff" as const, _id };
            }),
            { type: "daysOff", _id: "dayOffId" },
          ]
        : [{ type: "daysOff", _id: "dayOffId" }],
    
  });
};

export const addDaysOffService = (build: any) => {
  return build.mutation({
    query: (payload: IDaysOff) => ({
      url: `/api/holiday/`,
      method: "POST",
      data: payload,
    }),
    invalidatesTags: [{ type: "daysOff", _id: "_id" }],
  });
};

export const updateDaysOffService = (build: any) => {
  return build.mutation({
    query: (payload: IDaysOff) => ({
      url: `/api/holiday/${payload._id}`,
      method: "PUT",
      data: payload,
    }),
    invalidatesTags: ({ _id }: { _id: string }) => [
      { type: "daysOff", _id:_id },
    ],
  });
};

export const updateAllDaysOffService = (build: any) => {
  return build.mutation({
    query: (payload: IDaysOff) => ({
      url: `/api/userdayoff`,
      method: "POST",
      data: payload,
    }),
    invalidatesTags: [
     "daysOff"
    ],
  });
};


export const getDaysDetailsById = (build: any) => {
  return build.query({
    query: (holidayId: string) => ({
      url: `/api/holiday/${holidayId}`,
      method: "GET",
    }),
    providesTags: ({ _id }: { _id: string }) => [{ type: "daysOff", _id: _id }],
  });
};



export const deleteDaysService = (build: any) => {
  return build.mutation({
    query: (holidayId:string) => ({
      url: `/api/holiday/${holidayId}`,
      method: "DELETE",
    }),
    invalidatesTags: (result: {}, error: string, _id: string) => [
      { type: "daysOff", _id: _id },
    ],
  });
};

export const updateDoNotDisturbDayOffService = (build: any) => {
  return build.mutation({
    query: ({ id,doNotDisturbStatus }: { id: string;doNotDisturbStatus:boolean }) => ({
      url: `/api/user/donotdisturb/${id}`,
      method: "PUT",
      data:{doNotDisturbStatus}
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "users", _id: id },
    ],
  });
};
