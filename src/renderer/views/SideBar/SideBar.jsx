import React from "react";
import PropTypes from "prop-types";
import cls from "./styles.module.css";
import albumListIcon from "/assets/album-list.svg";
import settingsIcon from "/assets/settings.svg";

export default function SideBar() {
  return (
    <div className={cls["container"]}>
      <img src={albumListIcon} alt="library" />
      <img src={settingsIcon} alt="settings" />
    </div>
  );
}

SideBar.propTypes = {};
SideBar.defaultProps = {};
