import { useEffect } from "react";
import { Typography } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import UserLayout from "../layouts/UserLayout";
import { RootState } from "../store/index";
import Protected from "./Routeguard";
import { IRouteConfig, routesConfig } from "./config";
import {
  useGetCurrentUserByIdMutation,
  useGetPermissionsMutation,
} from "../store/services";
import FallbackSpinner from "../@core/components/spinner";
import { setIsLoading } from "../store/slices/PermissionsSlice";
import { Root } from "react-dom/client";

const Router = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state?.auth.user);
  const isLoading = useSelector(
    (state: RootState) => state.permissions.isLoading
  );
  const isFetchingUser = useSelector(
    (state: RootState) => state.currentUser.isLoading
  );

  const [handleGetPermissions] = useGetPermissionsMutation();
  const [handleGetCurrentUser] = useGetCurrentUserByIdMutation();

  useEffect(() => {
    if (user?.id) {
      handleGetCurrentUser(user?.id);
    }

    if (user?.companyId) {
      handleGetPermissions(user?.companyId);
    } else {
      dispatch(setIsLoading(false));
    }
  }, [user]);

  if (isLoading || isFetchingUser) {
    return <FallbackSpinner />;
  }

  return (
    <Routes>
      {routesConfig.map((cRoute: IRouteConfig) => (
        <Route
          key={cRoute.path}
          path={cRoute.path}
          element={
            cRoute.layout ? (
              <Protected
                permissionKey={cRoute?.permissionKey}
                user={user}
                loginAsClient={cRoute?.loginAsClient}
                permission={cRoute.permission}
                userId={user?.id}
              >
                <UserLayout>{cRoute.component}</UserLayout>
              </Protected>
            ) : (
              cRoute.component
            )
          }
        />
      ))}
      <Route
        path="*"
        element={
          user?.id ? (
            <UserLayout>
              <Typography>Page not found</Typography>
            </UserLayout>
          ) : (
            <div>404 page not found</div>
          )
        }
      />
    </Routes>
  );
};
export default Router;
