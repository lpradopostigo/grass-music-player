import React from "react"
import SideBar from "./index"

export default {
  title: "SideBar",
  component: SideBar
};

export const Normal = (args) => (<SideBar {...args}/>);
