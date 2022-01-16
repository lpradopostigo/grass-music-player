import React from "react";
import PropTypes from "prop-types";
import { When } from "react-if";
import cls from "./styles.modules.css";

export default function TrackList({ discNumber, showDiscNumber, children }) {
  return (
    <div className={cls["container"]}>
      <When condition={showDiscNumber}>
        <span className={cls["disc"]}>Disc {discNumber}</span>
      </When>

      {children}
    </div>
  );
}

TrackList.defaultProps = {
  showDiscNumber: false,
  discNumber: 1,
};

TrackList.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  discNumber: PropTypes.number,
  showDiscNumber: PropTypes.bool,
};
