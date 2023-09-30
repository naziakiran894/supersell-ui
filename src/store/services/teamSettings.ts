export const getTeamSettingsById = (build: any) => {
  return build.query({
    query: (id: string) => ({
      url: `/api/team-setting/${id}`,
      method: "GET",
    }),
  });
};

export const addTeamSettings = (build: any) => {
  return build.mutation({
    query: (payload: any) => ({
      url: `/api/team-setting`,
      method: "POST",
      data: payload,
    }),
  });
};
