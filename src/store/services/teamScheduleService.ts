import { ITeamSchedule } from "../types/teamSchedule.types";

export const getTeamSchedule = (build: any) => {
  return build.query({
    query: (id: string) => ({
      url: `/api/teamSchedule/${id}`,
      method: "GET",
      providesTags: ({ _id }: { _id: string }) => [
        { type: "teamSchedule", _id: _id },
      ],
    }),
  });
};

export const updateTeamSchedule = (build: any) => {
  return build.mutation({
    query: (payload: ITeamSchedule) => ({
      url: `/api/teamSchedule`,
      method: "POST",
      data: payload,
      invalidatesTags: ({ _id }: { _id: string }) => [
        { type: "teamSchedule", _id: payload?.teamId },
      ],
    }),
  });
};
