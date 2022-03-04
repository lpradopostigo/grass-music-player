import React from "react";
import Button from "./Button";

export default {
  title: "Button",
  component: Button,
};

export function Normal(args) {
  return <Button {...args} />;
}
