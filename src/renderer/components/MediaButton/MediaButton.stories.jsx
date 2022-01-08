import React from "react"
import MediaButton from "./MediaButton"

export default {
  title: "MediaButton",
  component: MediaButton
};

export function Normal(args) {
  return <MediaButton {...args}/>
}
