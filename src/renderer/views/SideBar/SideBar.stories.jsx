import React from "react"
import SideBar from "./index"

export default {
  title: "SideBar",
  component: SideBar
};

export function Normal(args) {
  return <SideBar {...args}/>
}
