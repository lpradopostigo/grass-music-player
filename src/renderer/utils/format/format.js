// eslint-disable-next-line import/prefer-default-export
export function secondsToAudioDuration(seconds) {
  const fullDuration = new Date(seconds * 1000).toISOString().substr(11, 8);
  const separator = ":";
  const [hours, ...rest] = fullDuration.split(separator);
  return hours === "00" ? rest.join(separator) : fullDuration;
}
