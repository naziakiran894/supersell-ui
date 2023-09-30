// ** Type Imports
import {
  NavLink,
  NavGroup,
  LayoutProps,
  NavSectionTitle,
} from "../../../../../@core/layouts/types";

// ** Custom Menu Components
import VerticalNavLink from "./VerticalNavLink";
import VerticalNavGroup from "./VerticalNavGroup";
import VerticalNavSectionTitle from "./VerticalNavSectionTitle";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";

interface Props {
  parent?: NavGroup;
  navHover?: boolean;
  navVisible?: boolean;
  groupActive: string[];
  isSubToSub?: NavGroup;
  currentActiveGroup: string[];
  navigationBorderWidth: number;
  settings: LayoutProps["settings"];
  saveSettings: LayoutProps["saveSettings"];
  setGroupActive: (value: string[]) => void;
  setCurrentActiveGroup: (item: string[]) => void;
  verticalNavItems?: LayoutProps["verticalLayoutProps"]["navMenu"]["navItems"];
}

const resolveNavItemComponent = (
  item: NavGroup | NavLink | NavSectionTitle
) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const permissions = useSelector(
    (state: RootState) => state.permissions.Permissions
  );

  if (
    (item as NavSectionTitle).sectionTitle &&
    ((user?.roleName && item?.permissions.includes(user.roleName)) ||
      (user?.loginAsClient &&
        item?.loginAsClient &&
        user?.loginAsClient === item.loginAsClient) ||
      (item?.permissionKey?.length && permissions && !!item?.permissionKey.filter((key) => key in permissions)?.length))
  ) {
    return VerticalNavSectionTitle;
  }

  if (
    user?.roleName &&
    (item as NavSectionTitle).sectionTitle &&
    (item as NavSectionTitle).permissions?.includes(user.roleName)
  )
    return VerticalNavSectionTitle;
  // if ((item as NavGroup).children) return VerticalNavGroup;

  return VerticalNavLink;
};

const VerticalNavItems = (props: Props) => {
  // ** Props
  const { verticalNavItems } = props;

  const RenderMenuItems = verticalNavItems?.map(
    (item: NavGroup | NavLink | NavSectionTitle, index: number) => {
      const TagName: any = resolveNavItemComponent(item);

      return <TagName {...props} key={index} item={item} />;
    }
  );

  return <>{RenderMenuItems}</>;
};

export default VerticalNavItems;
