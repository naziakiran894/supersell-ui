import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Layout from "../@core/layouts/Layout";
import navigationSuperAdmin from "../@core/Navigation/vertical";
import superAdminNavigation from "../@core/Navigation/vertical";
import VerticalAppBarContent from "./components/vertical/AppBarContent";
import { useSettings } from "../@core/hooks/useSettings";
import { userTypes } from "../store/types/globalTypes";
import {
  useGetCompaniesMutation,
  useGetCompanyDetailsByIdQuery,
  useGetFieldSettingQuery,
  useGetTimezonesMutation,
  useGetUserRolesMutation,
} from "../store/services";

interface Props {
  children: ReactNode;
  contentHeightFixed?: boolean;
}

const UserLayout: React.FC<Props> = ({ children }) => {
  const { settings, saveSettings } = useSettings();

  const user = useSelector((state: RootState) => state.auth);

  const userRole = user?.user?.roleName;

  const clientId = useSelector(
    (state: RootState) => state.auth.user?.companyId
  );

  const { data, isLoading: isFetching } =
    useGetCompanyDetailsByIdQuery(clientId);

  const [handleGetTimeZone] = useGetTimezonesMutation();
  const [handleGetCompanyMutation] = useGetCompaniesMutation();
  const [handleGetRolesMutation] = useGetUserRolesMutation();
  useGetFieldSettingQuery(user.user?.companyId);

  useEffect(() => {
    if (user?.token) {
      if (userRole === userTypes.SUPER_ADMIN) {
        handleGetCompanyMutation("");
      }

      handleGetTimeZone("");
      handleGetRolesMutation("");
    }
  }, [user?.token, clientId]);

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  if (hidden && settings.layout === "horizontal") {
    settings.layout = "vertical";
  }

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={false}
      verticalLayoutProps={{
        navMenu: {
          navItems: superAdminNavigation(),
        },
        appBar: {
          content: (props) => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          ),
        },
      }}
    >
      {children}
    </Layout>
  );
};

export default UserLayout;
