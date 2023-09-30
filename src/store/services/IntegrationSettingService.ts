import { IIntegration } from "../types/integration.types";
interface IQueryParams {
  limit?: number;
  offset?: number;
  searchQuery?: string;
  companyId: string;
  sort: string;
  order: string;
}
interface IStatusParam {
  id: string;
  isActive: boolean;
}

export const addIntegrationSettingService = (build: any) => {
  return build.mutation({
    query: (payload: IIntegration) => ({
      url: `/api/integration/`,
      method: "POST",
      data: payload,
    }),

    invalidatesTags: [{ type: "integrations", _id: "integrationId" }],
  });
};

export const integrationStatus = (build: any) => {
  return build.mutation({
    query: ({ id, isActive }: IStatusParam) => ({
      url: `/api/integration/status/${id}?isActive=${isActive}`,
      method: "PUT",
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "integrations", _id: id },
    ],
  });
};

export const getIntegrationById = (build: any) => {
  return build.query({
    query: (id: string) => {
      if (typeof id === "undefined") {
        return { skipToken: true };
      }
      return {
        url: `/api/integration/${id}`,
        method: "GET",
      };
    },

    providesTags: (result: {}, error: string, id: string) => [
      { type: "integrations", _id: id },
    ],
  });
};

export const deleteIntegrationService = (build: any) => {
  return build.mutation({
    query: (id: string) => ({
      url: `/api/integration/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "integrations", _id: id },
    ],
  });
};

export const getIntegrationDetailsByCompanyId = (build: any) => {
  return build.query({
    query: ({ limit, offset, companyId, sort, order }: IQueryParams) => ({
      url: `/api/integration?companyId=${companyId || ""}&offset=${
        offset || 0
      }&limit=${limit || 10} &sort=${sort}&order=${order}`,
      method: "GET",
    }),
    providesTags: (result: any) =>
      result
        ? [
            ...result?.data.list?.map(({ _id }: { _id: string }) => {
              return { type: "integrations" as const, _id };
            }),
          ]
        : [{ type: "integrations", _id: "integrationsId" }],
  });
};
