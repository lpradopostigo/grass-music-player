import {
  IoMusicalNotesOutline,
  IoSettingsOutline,
  IoMusicalNoteOutline,
} from "solid-icons/io";
import classes from "./index.module.css";
import { A } from "@solidjs/router";
import { JSX } from "solid-js";

function NavigationBar() {
  return (
    <nav class={classes.container}>
      <Link href="/library" icon={<IoMusicalNoteOutline />} />
      <Link href={"/playlists"} icon={<IoMusicalNotesOutline />} />
      <Link href={"/settings"} icon={<IoSettingsOutline />} />
    </nav>
  );
}

function Link(props: { href: string; icon: JSX.Element }) {
  return (
    <A
      tabIndex={-1}
      class={classes.link}
      activeClass={classes.linkActive}
      inactiveClass={classes.linkInactive}
      href={props.href}
    >
      {props.icon}
    </A>
  );
}

export default NavigationBar;
