import React from "react";
import PropTypes from "prop-types";
import { Switch, Case } from "react-if";
import colors from "../../../theme/colors";
import styles from "./styles.module.css";

export default function MediaButton({ color, variant, size }) {
  const className = styles[size];
  return (
    <Switch>
      <Case condition={variant === "play"}>
        <svg
          className={className}
          fill={color}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 485.74 485.74"
          xmlSpace="preserve"
        >
          <g>
            <path
              d="M242.872,0C108.732,0,0.004,108.736,0.004,242.864c0,134.14,108.728,242.876,242.868,242.876
			c134.136,0,242.864-108.736,242.864-242.876C485.736,108.736,377.008,0,242.872,0z M338.412,263.94l-134.36,92.732
			c-16.776,11.588-30.584,4.248-30.584-16.316V145.38c0-20.556,13.808-27.9,30.584-16.312l134.32,92.732
			C355.136,233.384,355.176,252.348,338.412,263.94z"
            />
          </g>
        </svg>
      </Case>

      <Case condition={variant === "pause"}>
        <svg
          className={className}
          fill={color}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 493.46 493.46"
          xmlSpace="preserve"
        >
          <g>
            <path
              d="M246.732,0C110.684,0,0.004,110.68,0.004,246.728c0,136.044,110.68,246.732,246.728,246.732
			s246.724-110.688,246.724-246.732C493.456,110.68,382.78,0,246.732,0z M219.724,359.024c0,3.888-2.376,7.82-6.916,7.82h-9
			c-4.38,0-8.084-3.524-8.084-7.696V134.44c0-4.02,4.312-7.82,8.876-7.82h7.656c4.12,0,7.468,3.64,7.468,8.116V359.024z
			 M301.724,359.604c0,3.888-2.376,7.82-6.916,7.82h-9c-4.384,0-8.084-3.524-8.084-7.696V135.02c0-4.02,4.312-7.82,8.876-7.82h7.656
			c4.116,0,7.468,3.64,7.468,8.116V359.604z"
            />
          </g>
        </svg>
      </Case>

      <Case condition={variant === "next"}>
        <svg
          fill={color}
          className={className}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 493.456 493.456"
          xmlSpace="preserve"
        >
          <g>
            <path
              d="M246.726,0C110.682,0.004,0.002,110.688,0.002,246.732s110.68,246.724,246.724,246.724
			c136.048,0,246.728-110.68,246.728-246.724C493.454,110.684,382.774,0,246.726,0z M275.034,259.616l-100.968,70.64
			c-4.124,2.868-6.704,3.468-8.14,3.468c-1.048,0-2.256-0.264-3.344-2.244c-0.844-1.54-1.844-4.592-1.844-10.368V172.596h0
			c0-3.792,0.5-12.608,5.188-12.608c1.436,0,4.016,0.604,8.156,3.48l100.056,70.612c5.28,3.668,8.296,8.536,8.296,13.376
			C282.434,251.988,279.81,256.3,275.034,259.616z M332.738,331.164c0,2.584-2.32,4.772-5.064,4.772h-6.752
			c-2.88,0-4.188-2.524-4.188-4.868V162.856h0.004c0-2.804,2.064-5.084,4.6-5.084h5.744c2.852,0,5.656,2.412,5.656,4.868V331.164z"
            />
          </g>
        </svg>
      </Case>

      <Case condition={variant === "previous"}>
        <svg
          fill={color}
          className={className}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 493.456 493.456"
          xmlSpace="preserve"
        >
          <g>
            <path
              d="M246.73,0C110.682,0,0.002,110.684,0.002,246.728s110.68,246.728,246.728,246.728s246.724-110.684,246.724-246.728
			S382.778,0,246.73,0z M176.722,331.064c0,2.344-1.312,4.868-4.188,4.868h-6.752c-2.744,0-5.06-2.184-5.06-4.772V162.632
			c0-2.456,2.8-4.868,5.656-4.868h5.744c2.536,0,4.6,2.28,4.6,5.084V331.064z M332.722,321.108c0,5.776-1.004,8.828-1.848,10.372
			c-1.084,1.972-2.292,2.244-3.34,2.244c-1.436,0-4.02-0.604-8.144-3.468l-100.968-70.64c-4.768-3.312-7.396-7.628-7.396-12.16
			c0-4.84,3.016-9.708,8.3-13.376l100.052-70.612c4.14-2.876,6.72-3.48,8.156-3.48c4.684,0,5.188,8.816,5.188,12.608V321.108z"
            />
          </g>
        </svg>
      </Case>
    </Switch>
  );
}

MediaButton.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.oneOf(["play", "next", "previous", "pause"]),
  size: PropTypes.oneOf(["normal", "small"]),
};

MediaButton.defaultProps = {
  color: colors.grey.darkest,
  variant: "play",
  size: "normal",
};
