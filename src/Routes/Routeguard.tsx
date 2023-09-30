import { Navigate } from "react-router-dom";
import APP_ROUTES from "./routes";
import { IAuthUser } from "../store/types/user.types";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { PermissionKey } from "../store/types/permisssions.types";

type IProps = {
  userId?: string;
  permission: string[];
  children: JSX.Element;
  user?: IAuthUser | null;
  loginAsClient?: boolean;
  permissionKey?: PermissionKey[];
};

const Protected: React.FC<IProps> = ({
  userId,
  permission,
  user,
  children,
  loginAsClient,
  permissionKey,
}) => {
  const permissions = useSelector(
    (state: RootState) => state?.permissions.Permissions
  );
  if (!userId) {
    return (
      <>
        <Navigate to="/login" replace />
      </>
    );
  } else if (
    (user?.roleName && permission.includes(user.roleName)) ||
    (user?.loginAsClient && user?.loginAsClient === loginAsClient) ||
    (!!permissionKey && permissions && !!permissionKey.filter((key) => key in permissions)?.length)
  ) {
  return children;
}
return <Navigate to={APP_ROUTES.notFound} replace />;
};
export default Protected;
