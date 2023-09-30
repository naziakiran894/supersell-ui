interface IQueryParams {
  endDate: string;
  startDate?: string;
  limit: number;
  offset: string;
  integrationId: string;
}

export const getIntegrationHistoryService = (build: any) => {
  return build.query({
    query: ({
      limit,
      offset,
      integrationId,
      startDate,
      endDate,
    }: IQueryParams) => ({
      url: `/api/integration-history?integrationId=${
        integrationId || ""
      }&offset=${offset || 0}&limit=${
        limit || 10
      }&startDate=${startDate}&endDate=${endDate}`,
      method: "GET",
    }),
  });
};
