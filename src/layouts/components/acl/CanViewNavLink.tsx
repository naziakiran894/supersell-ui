// ** React Imports
import { ReactNode, useContext } from "react";

// ** Types
import { NavLink } from "../../../@core/layouts/types";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface Props {
  navLink?: NavLink;
  children: ReactNode;
}

const CanViewNavLink = (props: Props) => {
  // ** Props
  const { children, navLink } = props;

  const user = useSelector((state: RootState) => state.auth.user);

  const permissions = useSelector(
    (state: RootState) => state.permissions.Permissions
  );

  if (
    (user?.roleName && navLink?.permissions.includes(user.roleName)) ||
    (user?.loginAsClient &&
      navLink?.loginAsClient &&
      user?.loginAsClient === navLink.loginAsClient) ||
    (navLink?.permissionKey &&
      permissions &&
      !!navLink?.permissionKey.filter((key) => key in permissions)?.length)
  ) {
    return <>{children}</>;
  } else {
    return null;
  }
};

export default CanViewNavLink;
