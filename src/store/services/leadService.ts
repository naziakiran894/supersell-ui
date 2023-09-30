import { ILead } from "../types/lead.types";
import { INote } from "../../pages/LeadsDetails/components/Notes";
import { IOfferAndDeals } from "../types/lead.types";
import { IQuery } from "../../pages/LeadsDetails/components/Header";
import { downloadCsv } from '../helpers/downloadCsv'
interface IQueryParams {
  limit?: number;
  offset?: number;
  searchQuery?: string;
  order?: 1 | -1;
  sort?: string;
  teamId: string;
  leadOwnerId: string;
  tag?: string;
  sid?: string;
  startDate?: string;
  endDate?: string;
}

export const addLeadService = (build: any) => {
  return build.mutation({
    query: (payload: ILead) => ({
      url: `/api/lead/`,
      method: "POST",
      data: payload,
    }),

    invalidatesTags: [{ type: "leads", _id: "leadId" }],
  });
};

export const updateLeadService = (build: any) => {
  return build.mutation({
    query: (payload: ILead) => ({
      url: `/api/lead/${payload._id}`,
      method: "PUT",
      data: payload,
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "leads", _id: id },
    ],
  });
};

export const getLeadDetailsById = (build: any) => {
  return build.query({
    query: (leadId: string) => {
      if (typeof leadId === "undefined") {
        return { skipToken: true };
      }

      return {
        url: `/api/lead/${leadId}`,
        method: "GET",
      };
    },
    providesTags: (result: string, error: string, id: string) => [
      { type: "leads", _id: id },
    ],
  });
};

export const getAllLeadService = (build: any) => {
  return build.query({
    query: ({
      limit,
      offset,
      searchQuery,
      sort,
      order,
      teamId,
      leadOwnerId,
      tag,
      sid,
      startDate,
      endDate,
    }: IQueryParams) => ({
      url: `/api/lead?offset=${offset || 0}&limit=${limit || 10}&q=${searchQuery || ""
        }&sort=${sort}&order=${order}&tid=${teamId}&loid=${leadOwnerId}&tag=${tag}&sid=${sid}&startDate=${startDate || ""
        }&endDate=${endDate || ""} `,
      method: "GET",
    }),
    providesTags: (result: any) =>
      result
        ? [
          ...result?.data?.list?.map(({ _id }: { _id: string }) => {
            return { type: "leads" as const, _id };
          }),
          { type: "leads", _id: "leadId" },
        ]
        : [{ type: "leads", _id: "leadId" }],
  });
};

export const deleteLeadService = (build: any) => {
  return build.mutation({
    query: (id: string) => ({
      url: `/api/lead/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "leads", _id: id },
    ],
  });
};

export const downloadLeadService = (build: any) => {
  return build.mutation({
    query: (id: string) => ({
      url: `/api/lead/download/csv`,
      method: "GET",
      responseType: 'blob',
    }),
    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      const { data } = await queryFulfilled;
      downloadCsv(data, 'leads.csv')
    }
  });
};

export const addNoteService = (build: any) => {
  return build.mutation({
    query: (payload: INote) => ({
      url: `/api/lead-extra-info/`,
      method: "POST",
      data: payload,
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "leads", _id: id },
    ],
  });
};

export const deleteNoteService = (build: any) => {
  return build.mutation({
    query: (id: string) => ({
      url: `/api/lead-extra-info/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "leads", _id: id },
    ],
  });
};

export const addOfferService = (build: any) => {
  return build.mutation({
    query: (payload: IOfferAndDeals) => ({
      url: `/api/lead-extra-info/`,
      method: "POST",
      data: payload,
    }),
  });
};

export const addLeadTagsService = (build: any) => {
  return build.mutation({
    query: (payload: IQuery) => ({
      url: `/api/lead/tags/${payload.leadId}`,
      method: "POST",
      data: payload,
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "leads", _id: id },
    ],
  });
};

export const setStageService = (build: any) => {
  return build.mutation({
    query: (payload: IQuery) => ({
      url: `/api/lead/stage`,
      method: "PUT",
      data: payload,
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "leads", _id: id },
    ],
  });
};


export const getLeadHistory = (build: any) => {
  return build.query({
    query: (payload: IQuery) => ({
      url: `/api/lead-history/${payload}`,
      method: "get",
    }),
  });
};