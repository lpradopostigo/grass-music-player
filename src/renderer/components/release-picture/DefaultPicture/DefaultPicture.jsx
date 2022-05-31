import { IoMusicalNotes } from "react-icons/io5";
import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import sizes from "../sizes.js";
import styles from "./DefaultPicture.styles.module.css";

export default function DefaultPicture({ size }) {
  return (
    <div className={clsx(styles.base, styles[size])}>
      <IoMusicalNotes size={sizes[size].height / 4} />
    </div>
  );
}

DefaultPicture.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

DefaultPicture.defaultProps = {
  size: "md",
};
