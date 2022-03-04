import React from "react";
import PropTypes from "prop-types";
import cls from "./styles.module.css";

export default function MediaButton(props) {
  const { children } = props;
  return (
    <button type="button" className={cls["container"]}>
      {children}
    </button>
  );
}

MediaButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
