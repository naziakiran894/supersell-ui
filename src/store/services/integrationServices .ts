import { IIntegration } from "../types/integration.types";

interface IQueryParams {
  integrationId: string;
  endDate: string;
  startDate?: string;
  limit: number;
  offset: string;
}

export const addIntegrationService = (build: any) => {
  return build.mutation({
    query: (payload: IIntegration) => ({
      url: `/api/leadMeeting/`,
      method: "POST",
      data: payload,
    }),

    invalidatesTags: [{ type: "integrations", _id: "integrationId" }],
  });
};

export const updateIntegrationService = (build: any) => {
  return build.mutation({
    query: (payload: IIntegration) => ({
      // url: `/api/lead/${payload._id}`,
      method: "PUT",
      data: payload,
    }),
    invalidatesTags: [{ type: "integrations", _id: "integrationId" }],
  });
};

export const getIntegrationDetailsById = (build: any) => {
  return build.query({
    query: (meetingId: string) => ({
      //   url: `/api/lead/${meetingId}`,
      method: "GET",
    }),
  });
};
