import base64js from "base64-js";

export default function parsePictureSrc(picture) {
  if (!picture) return undefined;
  return typeof picture === "string"
    ? picture
    : `data:image/png;base64,${base64js.fromByteArray(picture)}`;
}
