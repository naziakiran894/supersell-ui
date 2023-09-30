interface IQueryParams {
  limit?: number;
  offset?: number;
  searchQuery?: string;
  order?: 1 | -1;
  sort?: string;
}

export const getAllLeadSourcePerformance = (build: any) => {
  return build.query({
    query: ({ limit, offset, searchQuery, sort, order }: IQueryParams) => ({
      url: `/api/reporting/leads-source-performance?offset=${
        offset || 0
      }&limit=${limit || 10}&q=${
        searchQuery || ""
      }&sort=${sort}&order=${order}`,
      method: "GET",
    }),
  });
};
