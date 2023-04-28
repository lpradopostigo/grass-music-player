import { ComponentProps, splitProps } from "solid-js";

const icons = {
  minimize: {
    content: `<path d="M14 8V9H3V8H14Z"></path>`,
    svgProps: {
      viewBox: "0 0 16 16",
    },
  },
  maximize: {
    content: `<path d="M3 3V13H13V3H3ZM12 12H4V4H12V12Z"></path>`,
    svgProps: {
      viewBox: "0 0 16 16",
    },
  },
  close: {
    content: `<path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.11598 7.99998L2.55798 12.558L3.44198 13.442L7.99998 8.88398L12.558 13.442L13.442 12.558L8.88398 7.99998L13.442 3.44198L12.558 2.55798L7.99998 7.11598L3.44198 2.55798L2.55798 3.44198L7.11598 7.99998Z"></path>`,
    svgProps: {
      viewBox: "0 0 16 16",
    },
  },
  "music-notes": {
    content: `<path d="M212.92,25.69a8,8,0,0,0-6.86-1.45l-128,32A8,8,0,0,0,72,64V174.08A36,36,0,1,0,88,204V70.25l112-28v99.83A36,36,0,1,0,216,172V32A8,8,0,0,0,212.92,25.69Z"></path>`,
    svgProps: {
      viewBox: "0 0 256 256",
    },
  },
  "skip-back": {
    content: `<path d="M208,47.88V208.12a16,16,0,0,1-24.43,13.43L64,146.77V216a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0v69.23L183.57,34.45A15.95,15.95,0,0,1,208,47.88Z"></path>`,
    svgProps: {
      viewBox: "0 0 256 256",
    },
  },
  "skip-forward": {
    content: `<path d="M208,40V216a8,8,0,0,1-16,0V146.77L72.43,221.55A15.95,15.95,0,0,1,48,208.12V47.88A15.95,15.95,0,0,1,72.43,34.45L192,109.23V40a8,8,0,0,1,16,0Z"></path>`,
    svgProps: {
      viewBox: "0 0 256 256",
    },
  },
  "pause-circle": {
    content: `<path d="M128,24A104,104,0,1,0,232,128,104.13,104.13,0,0,0,128,24ZM112,160a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0Z"></path>`,
    svgProps: {
      viewBox: "0 0 256 256",
    },
  },

  "play-circle": {
    content: `<path d="M128,24A104,104,0,1,0,232,128,104.13,104.13,0,0,0,128,24Zm36.44,110.66-48,32A8.05,8.05,0,0,1,112,168a8,8,0,0,1-8-8V96a8,8,0,0,1,12.44-6.66l48,32a8,8,0,0,1,0,13.32Z"></path>`,
    svgProps: {
      viewBox: "0 0 256 256",
    },
  },
  "magnifying-glass": {
    content: `<path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>`,
    svgProps: {
      viewBox: "0 0 256 256",
    },
  },
} as const;

function Icon(props: IconProps) {
  const [localProps, otherProps] = splitProps(props, ["name"]);

  return (
    <svg
      {...icons[localProps.name].svgProps}
      width="1em"
      height="1em"
      stroke="currentColor"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      stroke-width="0"
      {...otherProps}
      // eslint-disable-next-line solid/no-innerhtml
      innerHTML={icons[localProps.name].content}
    />
  );
}

type IconProps = {
  name: keyof typeof icons;
} & ComponentProps<"svg">;

export type { IconProps };

export default Icon;
