import assert from "assert";
import { Color, COLORS, Image } from "../include/image.js";
import {
  imageMapCoord,
  isGrayish,
  imageMapIf,
  mapWindow,
  makeGrayish,
  pixelBlur,
  imageBlur,
} from "./imageProcessingHOF.js";

// Helper function to check if a color is equal to another one with an error of 1 (default)
function expectColorToBeCloseTo(actual: Color, expected: Color, error = 1) {
  [0, 1, 2].forEach(i => expect(Math.abs(actual[i] - expected[i])).toBeLessThanOrEqual(error));
}

describe("imageMapCoord", () => {
  function identity(img: Image, x: number, y: number) {
    return img.getPixel(x, y);
  }

  function test(img: Image, x: number, y: number) {
    if (x % 2 == 0) {
      img.setPixel(x, y, [1, 1, 2]);
    }
    return img.getPixel(x, y);
  }

  it("should map the correct pixel", () => {
    const input = Image.create(10, 10, COLORS.MAGENTA);
    const output = imageMapCoord(input, test);
    assert(input.getPixel(4, 0) !== output.getPixel(4, 0));
    expectColorToBeCloseTo(output.getPixel(7, 3), output.getPixel(7, 3), 1);
    expectColorToBeCloseTo(output.getPixel(6, 9), output.getPixel(2, 4), 1);
    expectColorToBeCloseTo(output.getPixel(8, 4), [1, 1, 2], 1);
  });

  it("should return a different image", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageMapCoord(input, identity);
    assert(input !== output);
  });

  // More tests for imageMapCoord go here.
});

describe("imageMapIf", () => {
  // More tests for imageMapIf go here
  function check(img: Image, x: number, y: number) {
    let boo = false;
    if (img.getPixel(x, y) == COLORS.RED) {
      boo = true;
    }
    return boo;
  }
  function changeColor(p: Color) {
    p[0] = 43;
    p[1] = 88;
    p[2] = 52;
    return p;
  }

  it("should return modified pixel", () => {
    const input = Image.create(10, 10, COLORS.RED);
    const output = imageMapIf(input, check, changeColor);
    expectColorToBeCloseTo(output.getPixel(5, 5), [43, 88, 52], 212);
  });
  it("should return a different image imageMapIf", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageMapIf(input, check, changeColor);
    assert(input !== output);
  });
});

describe("mapWindow", () => {
  // More tests for mapWindow go here
  function changeColor(p: Color) {
    p[0] = 43;
    p[1] = 88;
    p[2] = 52;
    return p;
  }
  it("should return a different image mapWindow", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = mapWindow(input, [2, 2], [2, 2], changeColor);
    assert(input !== output);
  });
  it("should return different pixel mapWindow", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = mapWindow(input, [5, 5], [2, 2], changeColor);
    expectColorToBeCloseTo(output.getPixel(3, 3), [43, 88, 52], 212);
  });
});

describe("isGrayish", () => {
  it("should return false for difference over 85", () => {
    const color = [10, 5, 100];
    assert(!isGrayish(color));
  });
  it("should return true for difference under 85", () => {
    const color = [10, 5, 60];
    assert(isGrayish(color));
  });
  it("should return true if all color channels are equal", () => {
    const color = [10, 10, 10];
    assert(isGrayish(color));
  });
  it("should return true if all color channels are 0", () => {
    const color = [0, 0, 0];
    assert(isGrayish(color));
  });
});

describe("makeGrayish", () => {
  it("makes image grayish", () => {
    const input = Image.create(2, 2, [10, 5, 100]);
    const output = makeGrayish(input);
    expectColorToBeCloseTo(output.getPixel(0, 1), [5, 5, 5], 33);
  });
  it("should return a different image makeGrayish", () => {
    const input = Image.create(10, 10, COLORS.YELLOW);
    const output = makeGrayish(input);
    assert(input !== output);
  });
});

describe("pixelBlur", () => {
  // Tests for pixelBlur go here
  it("should return a different pixel pixelBlur", () => {
    const input = Image.create(10, 10, COLORS.YELLOW);
    const output = pixelBlur(input, 4, 3);
    assert(input.getPixel(4, 3) !== output);
  });
  it("should return blurred pixel", () => {
    const input = Image.create(2, 2, [2, 3, 4]);
    const output = pixelBlur(input, 0, 0);
    expectColorToBeCloseTo(output, [2, 3, 4], 1);
  });
});

describe("imageBlur", () => {
  // Tests for imageBlur go here
  it("should return a different pixel imageBlur", () => {
    const input = Image.create(10, 10, COLORS.YELLOW);
    const output = imageBlur(input);
    assert(input !== output);
  });
});
