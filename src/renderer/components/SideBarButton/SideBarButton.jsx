import React from "react";
import PropTypes from "prop-types";
import { Switch, Case } from "react-if";
import "./styles.module.css";

export default function SideBarButton({ variant }) {
  return (
    <Switch>
      <Case condition={variant === "library"}>
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 17.4V2.6C2 2.26863 2.26863 2 2.6 2H17.4C17.7314 2 18 2.26863 18 2.6V17.4C18 17.7314 17.7314 18 17.4 18H2.6C2.26863 18 2 17.7314 2 17.4Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8 22H21.4C21.7314 22 22 21.7314 22 21.4V8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M11 12.5C11 13.3284 10.3284 14 9.5 14C8.67157 14 8 13.3284 8 12.5C8 11.6716 8.67157 11 9.5 11C10.3284 11 11 11.6716 11 12.5Z"
            fill="currentColor"
          />
          <path
            d="M11 12.5C11 13.3284 10.3284 14 9.5 14C8.67157 14 8 13.3284 8 12.5C8 11.6716 8.67157 11 9.5 11C10.3284 11 11 11.6716 11 12.5ZM11 12.5V6.6C11 6.26863 11.2686 6 11.6 6H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </Case>
      <Case condition={variant === "settings"}>
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.6224 10.3954L18.5247 7.7448L20 6L18 4L16.2647 5.48295L13.5578 4.36974L12.9353 2H10.981L10.3491 4.40113L7.70441 5.51596L6 4L4 6L5.45337 7.78885L4.3725 10.4463L2 11V13L4.40111 13.6555L5.51575 16.2997L4 18L6 20L7.79116 18.5403L10.397 19.6123L11 22H13L13.6045 19.6132L16.2551 18.5155C16.6969 18.8313 18 20 18 20L20 18L18.5159 16.2494L19.6139 13.598L21.9999 12.9772L22 11L19.6224 10.3954Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Case>
    </Switch>
  );
}

SideBarButton.propTypes = {
  variant: PropTypes.oneOf(["library", "settings"]).isRequired,
};

SideBarButton.defaultProps = {};
