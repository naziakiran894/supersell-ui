import { getCompanies } from "../slices/companiesSlice";
import { ICompanyType, ICompanyDetailsByID } from "../types/company.types";
import { getClientSetting } from "../slices/ClientSettingSlice";
interface IPayload {
  limit: number;
  offset: number;
  query?: string;
}

export const addCompanyService = (build: any) => {
  return build.mutation({
    query: (payload: ICompanyType) => ({
      url: `/api/company`,
      method: "POST",
      data: payload,
    }),
    invalidatesTags: [{ type: "companies", _id: "companyId" }],
  });
};

export const updateCompanyService = (build: any) => {
  return build.mutation({
    query: (payload: ICompanyType) => ({
      url: `/api/company/${payload._id}`,
      method: "PUT",
      data: payload,
    }),
    invalidatesTags: ({ _id }: { _id: string }) => [
      { type: "companies", _id: _id },
    ],
  });
};

export const getCompanyDetailsById = (build: any) => {
  return build.query({
    query: (companyId: string) => {
      if (typeof companyId === "undefined") {
        return { skipToken: true };
      }
      return {
        url: `/api/company/${companyId}`,
        method: "GET",
      };
    },
    providesTags: (result: string, error: string, id: string) => [
      { type: "companies", _id: id },
    ],
    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      try {
        const { data } = await queryFulfilled;
        dispatch(getClientSetting(data?.data));
      } catch (err) {
        console.log(err);
      }
    },
  });
};

export const updateCompanyDetailsById = (build: any) => {
  return build.mutation({
    query: (payload: ICompanyDetailsByID) => ({
      url: `/api/company/setting/${payload._id}`,
      method: "PUT",
      data: payload,
    }),
    invalidatesTags: ({ _id }: { _id: string }) => [
      { type: "companies", _id: _id },
    ],
  });
};

export const getCompanyRoutingList = (build: any) => {
  return build.query({
    query: (companyId: string) => ({
      url: `/api/company/routing/setting/list`,
      method: "GET",
    }),
    providesTags: (result: string, error: string, id: string) => [
      { type: "companies", _id: id },
    ],
  });
};

export const getAllCompanyService = (build: any) => {
  return build.query({
    query: ({ limit, offset, query }: IPayload) => ({
      url: `/api/company?limit=${limit}&offset=${offset}&q=${query}`,
      method: "GET",
    }),

    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      const { data } = await queryFulfilled;
      dispatch(getCompanies(data));
    },
    providesTags: (result: any) => {
      return result
        ? [
            ...result?.data?.list?.map(({ _id }: { _id: string }) => {
              return { type: "companies" as const, _id };
            }),
            { type: "companies", _id: "companyId" },
          ]
        : [{ type: "companies", _id: "companyId" }];
    },
  });
};

export const deleteCompanyService = (build: any) => {
  return build.mutation({
    query: (id: string) => ({
      url: `/api/company/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: (result: {}, error: string, _id: string) => [
      { type: "companies", _id: _id },
    ],
  });
};

export const updateCompanyStatus = (build: any) => {
  return build.mutation({
    query: ({
      companyStatus,
      companyId,
    }: {
      companyId: string;
      companyStatus: boolean;
    }) => ({
      url: `/api/company/status/${companyId}`,
      method: "PUT",
      data: { companyStatus },
    }),
    invalidatesTags: (result: {}, error: string, _id: string) => [
      { type: "companies", _id: _id },
    ],
  });
};
