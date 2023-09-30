import React from "react";
import Tabs from "./components/SettingsTabs";
import { useLocation } from "react-router-dom";

const Settings = () => {
  const location = useLocation();

  return <Tabs tab={location.pathname} />;
};

export default Settings;
