import React from "react";
import SideBarButton from "./SideBarButton";

export default {
  title: "SideBarButton",
  component: SideBarButton,
};

export function Normal(args) {
  return <SideBarButton variant="library" {...args} />;
}
