import { useGetStateQuery } from "../services/api/playerApi";
import usePlayerControls from "./usePlayerControls";

export default function usePlayer() {
  const { data, isLoading } = useGetStateQuery();
  const controls = usePlayerControls();

  return {
    state: data,
    controls,
    isLoading,
  };
}
