import React from "react";
import cls from "./styles.module.css";
import SideBarButton from "../../components/SideBarButton";

export default function SideBar() {
  return (
    <div className={cls["container"]}>
      <SideBarButton variant="library" to="/" />
      <SideBarButton variant="settings" to="/SettingsView" />
    </div>
  );
}

SideBar.propTypes = {};
SideBar.defaultProps = {};
