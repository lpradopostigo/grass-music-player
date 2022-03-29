const { invoke } = window.api;

export default function ipcQuery({ baseHandler }) {
  return async ({ handler, args = [] }) => {
    try {
      const data = await invoke(`${baseHandler}:${handler}`, ...args);
      return { data };
    } catch (error) {
      return { error };
    }
  };
}
