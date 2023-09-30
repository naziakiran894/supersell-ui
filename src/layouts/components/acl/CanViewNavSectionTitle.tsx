// ** React Imports
import { ReactNode, useContext } from "react";

// ** Component Imports
import { AbilityContext } from "../acl/Can";

// ** Types
import { NavSectionTitle } from "../../../@core/layouts/types";

interface Props {
  children: ReactNode;
  navTitle?: NavSectionTitle;
}

const CanViewNavSectionTitle = (props: Props) => {
  // ** Props
  const { children, navTitle } = props;

  // ** Hook
  const ability = useContext(AbilityContext);

  if (true) {
    return <>{children}</>;
  } else {
    return ability && ability.can(navTitle?.action, navTitle?.subject) ? (
      <>{children}</>
    ) : null;
  }
};

export default CanViewNavSectionTitle;
