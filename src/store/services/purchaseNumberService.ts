import { IPurchaseNumber, AvailableNumberProps } from "../types/purchaseNumber.types";

interface IQueryParams {
  limit?: number;
  offset?: number;
}



export const addPurchaseNumberService = (build: any) => {
  return build.mutation({
    query: (payload: IPurchaseNumber) => ({
      url: `/api/twilio-number`,
      method: "POST",
      data: payload,
    }),
    invalidatesTags: [{ type: "purchaseNumber", _id: "_id" }],
  });
};

export const getAllPurchaseNumberService = (build: any) => {
  return build.query({
    query: ({ limit, offset }: IQueryParams) => ({
      url: `/api/twilio-number?offset=${offset || 0}&limit=${limit || 10}`,
      method: "GET",
    }),
    providesTags: (result: any) =>
      result
        ? [
          ...result?.data?.map(({ _id }: { _id: string }) => {
            return { type: "purchaseNumber" as const, _id };
          }),
          { type: "purchaseNumber", _id: "_id" },
        ]
        : [{ type: "purchaseNumber", _id: "_id" }],
  });
};

export const deletePurchaseNumberService = (build: any) => {
  return build.mutation({
    query: (id: string) => ({
      url: `/api/twilio-number/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: [{ type: "purchaseNumber", _id: "_id" }],
  });
};

export const updatePurchaseNumberService = (build: any) => {
  return build.mutation({
    query: (payload: IPurchaseNumber) => ({
      url: `/api/twilio-number/${payload._id}`,
      method: "PUT",
      data: payload,
    }),
    invalidatesTags: ({ _id }: { _id: string }) => [
      { type: "purchaseNumber", _id: _id },
    ],
  });
};


export const getAllTwilioAvailableNumbers = (build: any) => {
  return build.query({
    query: ({ limit, offset, countryCode, areaCode }: IQueryParams & AvailableNumberProps) => ({
      url: `/api/twilio-number/list/available-twilio-numbers?offset=${offset || 0}&limit=${limit || 10}&countryCode=${countryCode || ''}&areaCode=${areaCode || ''}`,
      method: "GET",
    }),
  }
  );
};