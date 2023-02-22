export function secondsToAudioDuration(seconds: number) {
  const fullDuration = new Date(seconds * 1000).toISOString().substring(11, 19);
  const separator = ":";
  const [hours, ...rest] = fullDuration.split(separator);
  return hours === "00" ? rest.join(separator) : fullDuration;
}

export const getCssVar = (name: string) =>
  window.getComputedStyle(document.documentElement).getPropertyValue(name);
