import { updateUser } from "../slices/authSlice";

export const userLogin = (build: any) => {
  return build.mutation({
    query: (payload: { email: string; password: string }) => ({
      url: `/api/user/login`,
      method: "POST",
      data: payload,
    }),
    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      try {
        const { data } = await queryFulfilled;
        await localStorage.setItem("authToken", data.data.token);
        dispatch(updateUser(data));
      } catch (err) {}
    },
  });
};

export const loginAsClient = (build: any) => {
  return build.mutation({
    query: (companyId: string) => ({
      url: `/api/admin/user/login-as-client`,
      method: "POST",
      data: { companyId },
    }),
    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      try {
        const { data } = await queryFulfilled;
        await localStorage.setItem("authToken", data.data.token);
        dispatch(updateUser(data));
      } catch (err) {}
    },
  });
};

export const GoogleLoginService = (build: any) => {
  return build.mutation({
    query: () => ({
      url: `/api/user/auth/google`,
      method: "GET",
    }),
    async onQueryStarted(_: any, { queryFulfilled, dispatch }: any) {
      try {
        const { data } = await queryFulfilled;
        dispatch(updateUser(data));
      } catch (err) {
        console.log(err);
      }
    },
  });
};

export const setPasswordService = (build: any) => {
  return build.mutation({
    query: (payload: {
      password: string;
      confirmPassword: string;
      otp: string;
      fp: string;
    }) => ({
      url: `/api/user/password/set`,
      method: "POST",
      data: payload,
    }),
  });
};

export const forgotPasswordService = (build: any) => {
  return build.mutation({
    query: (payload: { email: string }) => ({
      url: `/api/user/password/forget`,
      method: "POST",
      data: payload,
    }),
  });
};
