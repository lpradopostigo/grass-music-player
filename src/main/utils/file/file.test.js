const { pathExist, isAudioPath } = require("./file");

test("node_modules folder exists", () =>
  pathExist("node_modules").then((result) => {
    expect(result).toBe(true);
  }));

test("3453Yehodgo folder does not exists", () =>
  pathExist("3453Yehodgo").then((result) => {
    expect(result).toBe(false);
  }));

test("a.mp3 is an audio path ", () => {
  expect(isAudioPath("a.mp3")).toBe(true);
});

test("folder/a.flac is an audio path ", () => {
  expect(isAudioPath("folder/a.flac")).toBe(true);
});

test("/a. is not an audio path ", () => {
  expect(isAudioPath("/a.")).toBe(false);
});
