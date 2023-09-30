import { ITagsAndStatuses } from "../types/tagsAndStatuses.types";

interface IPayload {
  companyId: string;
  tags: ITagsAndStatuses;
  stages: ITagsAndStatuses;
}

export const getTagsAndStatuses = (build: any) => {
  return build.query({
    query: (id: string) => ({
      url: `/api/tags-and-stages/${id}`,
      method: "GET",
    }),
    providesTags: (result: any, error: any, {_id}: {_id:string}) => [
      { type: "tags", id:_id },
    ],
  });
};

export const addTagsAndStatuses = (build: any) => {
  return build.mutation({
    query: (payload: IPayload) => ({
      url: `/api/tags-and-stages`,
      method: "POST",
      data: payload,
      invalidatesTags: (result: any, error: any, id: string) => [
        { type: "tags", id:"test" },
      ],
    }),
  });
};
