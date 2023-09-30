import { ITeam } from "../types/team.types";

type ITeamResponse = ITeam[];

interface IQueryParams {
  limit?: number;
  offset?: number;
  searchQuery?: string;
  order?: 1 | -1;
  sort?: string;
}

export const addTeamService = (build: any) => {
  return build.mutation({
    query: (payload: ITeam) => ({
      url: `/api/team/`,
      method: "POST",
      data: payload,
    }),
    invalidatesTags: [{ type: "teams", _id: "teamId" }],
  });
};

export const updateTeamService = (build: any) => {
  return build.mutation({
    query: (payload: ITeam) => ({
      url: `/api/team/${payload._id}`,
      method: "PUT",
      data: payload,
    }),
    invalidatesTags: ({ _id }: { _id: string }) => [
      { type: "teams", _id: _id },
    ],
  });
};

export const getTeamDetailsById = (build: any) => {
  return build.query({
    query: (teamId: string) => ({
      url: `/api/team/${teamId}`,
      method: "GET",
    }),
    providesTags: (result: any, error: any, _id: string) => [
      { type: "teams", _id },
    ],
  });
};

export const getAllTeamsService = (build: any) => {
  return build.query({
    query: ({ limit, offset, searchQuery, sort, order }: IQueryParams) => ({
      url: `/api/team??offset=${offset || 0}&limit=${limit || 10}&q=${
        searchQuery || ""
      }&sort=${sort}&order=${order}`,
      method: "GET",
    }),

    providesTags: (result: any) =>
      result
        ? [
            ...result?.data?.list?.map(({ _id }: { _id: string }) => {
              return { type: "teams" as const, _id };
            }),
            { type: "teams", _id: "teamId" },
          ]
        : [{ type: "teams", _id: "teamId" }],
  });
};

export const deleteTeamService = (build: any) => {
  return build.mutation({
    query: (id: string) => ({
      url: `/api/team/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: (result: {}, error: string, _id: string) => [
      { type: "teams", _id: _id },
    ],
  });
};

export const getTeamsListService = (build: any) => {
  return build.query({
    query: () => ({
      url: `/api/team/list/all`,
      method: "GET",
    }),
  });
};

export const updateDoNotDisturbStatusTeamService = (build: any) => {
  return build.mutation({
    query: ({
      id,
      doNotDisturbStatus,
    }: {
      id: string;
      doNotDisturbStatus: boolean;
    }) => ({
      url: `/api/team/donotdisturb/${id}`,
      method: "PUT",
      data: { doNotDisturbStatus },
    }),
    invalidatesTags: (result: {}, error: string, _id: string) => [
      { type: "teams", _id: _id },
    ],
  });
};
