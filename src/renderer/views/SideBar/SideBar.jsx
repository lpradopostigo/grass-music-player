import React from "react";
import { Link } from "react-router-dom";
import cls from "./styles.module.css";
import SideBarButton from "../../components/SideBarButton";

export default function SideBar() {
  return (
    <div className={cls["container"]}>
      <Link to="/">
        <SideBarButton variant="library" />
      </Link>
      <SideBarButton variant="settings" />
    </div>
  );
}

SideBar.propTypes = {};
SideBar.defaultProps = {};
