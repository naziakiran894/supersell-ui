export const getReporting = (build: any) => {
  return build.query({
    query: () => ({
      url: `/api/reporting/`,
      method: "GET",
    }),
  });
};

export const getGraph = (build: any) => {
  return build.query({
    query: () => ({
      url: `/api/reporting/reporting-details-weekly`,
      method: "GET",
    }),
  });
};
