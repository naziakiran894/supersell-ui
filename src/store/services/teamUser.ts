import { ITeam } from "../types/team.types";

interface IParams {
  teamId: string;
  companyId: string;
  offset: number;
  limit: number;
  searchQuery: string;
  order?: 1 | -1;
  sort?: string;
}

export const updateTeamUsersService = (build: any) => {
  return build.mutation({
    query: (payload: ITeam) => ({
      url: `/api/teamuser`,
      method: "POST",
      data: payload,
    }),
  });
};

export const getTeamUsersById = (build: any) => {
  return build.query({
    query: ({
      teamId,
      companyId,
      offset,
      limit,
      searchQuery,
      sort,
      order,
    }: IParams) => ({
      url: `/api/teamuser/${teamId}?c=${companyId}&offset=${
        offset || 0
      }&limit=${limit || 10}&q=${
        searchQuery || ""
      }&sort=${sort}&order=${order}`,
      method: "GET",
    }),
    providesTags: (result: any, error: any, _id: string) => [
      { type: "teamuser", _id },
    ],
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
    // invalidatesTags: (result: {}, error: string, id: string) => [
    //   { type: "teams", _id: id },
    // ],
  });
};
