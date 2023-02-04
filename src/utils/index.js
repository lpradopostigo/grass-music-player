export function secondsToAudioDuration(seconds) {
  if (typeof seconds !== "number") return "";

  const fullDuration = new Date(seconds * 1000).toISOString().substring(11, 19);
  const separator = ":";
  const [hours, ...rest] = fullDuration.split(separator);
  return hours === "00" ? rest.join(separator) : fullDuration;
}

export const getCssVar = (name) =>
  window.getComputedStyle(document.documentElement).getPropertyValue(name);
