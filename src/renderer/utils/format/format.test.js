import { secondsToAudioDuration } from "./format";

test("10 must be formatted to 00:10", () => {
  expect(secondsToAudioDuration(10)).toBe("00:10");
});

test("123 must be formatted to 02:03", () => {
  expect(secondsToAudioDuration(123)).toBe("02:03");
});


test("1432 must be formatted to 23:52", () => {
  expect(secondsToAudioDuration(1432)).toBe("23:52");
});

test("12332 must be formatted to 03:25:32", () => {
  expect(secondsToAudioDuration(12332)).toBe("03:25:32");
});
