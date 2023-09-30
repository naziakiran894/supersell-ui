import { getCurrentUser, setIsLoading } from "../slices/currentUserSlice";
import { IUser } from "../types/user.types";

interface IQueryParams {
  limit?: number;
  offset?: number;
  searchQuery?: string;
  order?: 1 | -1;
  sort?: string;
}

export const addUserService = (build: any) => {
  return build.mutation({
    query: (payload: IUser) => ({
      url: `/api/user/`,
      method: "POST",
      data: payload,
    }),
    invalidatesTags: [{ type: "users", _id: "userId" }],
  });
};

export const updateUserService = (build: any) => {
  return build.mutation({
    query: (payload: IUser) => ({
      url: `/api/user/${payload._id}`,
      method: "PUT",
      data: payload,
    }),
    invalidatesTags: ({ _id }: { _id: string }) => [
      { type: "users", _id: _id },
    ],
  });
};

export const getUserDetailsById = (build: any) => {
  return build.query({
    query: (userId: string) => ({
      url: `/api/user/${userId}`,
      method: "GET",
    }),
    providesTags: ({ _id }: { _id: string }) => [{ type: "users", _id: _id }],
  });
};

export const getCurrentUserById = (build: any) => {
  return build.mutation({
    query: (userId: string) => ({
      url: `/api/user/${userId}`,
      method: "GET",
    }),
    providesTags: ({ _id }: { _id: string }) => [{ type: "users", _id: _id }],

    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      try {
        dispatch(setIsLoading(true));
        const { data } = await queryFulfilled;
        if (data) {
          dispatch(getCurrentUser(data?.data));
        }
      } catch (error) {
        console.log(error, "error");
      } finally {
        dispatch(setIsLoading(false));
      }
    },
  });
};

export const getAllUsersService = (build: any) => {
  return build.query({
    query: ({ limit, offset, searchQuery, sort, order }: IQueryParams) => ({
      url: `/api/user?offset=${offset || 0}&limit=${limit || 10}&q=${
        searchQuery || ""
      }&sort=${sort}&order=${order}`,
      method: "GET",
    }),
    providesTags: (result: any) =>
      result
        ? [
            ...result?.data.list?.map(({ _id }: { _id: string }) => {
              return { type: "users" as const, _id };
            }),
            { type: "users", _id: "userId" },
          ]
        : [{ type: "users", _id: "userId" }],
  });
};

export const deleteUserService = (build: any) => {
  return build.mutation({
    query: ({ id }: { id: string }) => ({
      url: `/api/user/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "users", _id: id },
    ],
  });
};

export const updateDoNotDisturbStatusService = (build: any) => {
  return build.mutation({
    query: ({
      id,
      doNotDisturbStatus,
    }: {
      id: string;
      doNotDisturbStatus: boolean;
    }) => ({
      url: `/api/user/donotdisturb/${id}`,
      method: "PUT",
      data: { doNotDisturbStatus },
    }),
    invalidatesTags: (result: {}, error: string, id: string) => [
      { type: "users", _id: id },
    ],
  });
};
