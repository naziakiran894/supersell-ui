import { getTimezone } from "../slices/timeZonesSlice";
import { getCompanies } from "../slices/companiesSlice";
import { getUserRole } from "../slices/userRolesSlice";
import { getPermissionsData, setIsLoading } from "../slices/PermissionsSlice";

export const getTimezoneService = (build: any) => {
  return build.mutation({
    query: () => ({
      url: `/api/country/`,
      method: "GET",
    }),
    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      const { data } = await queryFulfilled;
      dispatch(getTimezone(data));
    },
  });
};

export const getCompaniesService = (build: any) => {
  return build.mutation({
    query: () => ({
      url: `/api/company`,
      method: "GET",
    }),
    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      const { data } = await queryFulfilled;
      dispatch(getCompanies(data));
    },
  });
};

export const getPermissionsService = (build: any) => {
  return build.mutation({
    query: (id: string) => ({
      url: `/api/company/permission/${id}`,
      method: "GET",
    }),
    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      try {
        dispatch(setIsLoading(true));
        const { data } = await queryFulfilled;
        if (data) {
          dispatch(getPermissionsData(data));
        }
      } catch (error) {
        console.log(error, "error");
      } finally {
        dispatch(setIsLoading(false));
      }
    },
  });
};

export const getUserRoleService = (build: any) => {
  return build.mutation({
    query: () => ({
      url: `/api/role`,
      method: "GET",
    }),
    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      const { data } = await queryFulfilled;
      dispatch(getUserRole(data));
    },
  });
};

export const getLeadRoutingService = (build: any) => {
  return build.query({
    query: () => ({
      url: `/api/lead/routing/setting/list`,
      method: "GET",
    }),
  });
};

