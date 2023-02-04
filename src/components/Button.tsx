import { ParentComponent, JSX, splitProps } from "solid-js";
import clsx from "clsx";

export type ButtonProps = JSX.HTMLAttributes<HTMLButtonElement> & {
  icon?: JSX.Element;
};

const Button: ParentComponent<ButtonProps> = (props) => {
  const [local, others] = splitProps(props, ["icon", "children", "class"]);
  return (
    <button
      {...others}
      class={clsx(
        `flex items-center gap-1 font-semibold bg-blue-500 px-2 py-1 rounded text-white hover:bg-blue-600`,
        local.class
      )}
    >
      {local.icon}
      {local.children}
    </button>
  );
};
export default Button;
