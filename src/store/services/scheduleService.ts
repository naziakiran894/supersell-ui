import { ISchedule } from "../types/schedule.types";

export const getSchedule = (build: any) => {
  return build.query({
    query: (id:string) => ({
      url: `/api/userschedule/${id}`,
      method: "GET",
      providesTags: ({ _id }: { _id: string }) => [{ type: "schedule", _id: _id }],
    }),


  });
};

export const updateSchedule = (build: any) => {
  return  build.mutation({
    query: (payload: ISchedule) => ({
      url: `/api/userschedule`,
      method: "POST",
      data: payload,
      invalidatesTags: ({ _id }: { _id: string }) => [
        { type: "users", _id: payload?.userId },
      ],
    }),
  });
};
