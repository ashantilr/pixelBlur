import type { Image, Color } from "../include/image.js";

export function imageMapCoord(img: Image, func: (img: Image, x: number, y: number) => Color): Image {
  const newImg = img.copy();

  for (let x = 0; x < img.width; ++x) {
    for (let y = 0; y < img.height; ++y) {
      newImg.setPixel(x, y, func(img, x, y));
    }
  }
  return newImg;
}

export function imageMapIf(
  img: Image,
  cond: (img: Image, x: number, y: number) => boolean,
  func: (p: Color) => Color
): Image {
  return imageMapCoord(img, function (_: Image, x, y) {
    if (cond(img, x, y)) {
      return func(img.getPixel(x, y));
    } else {
      return img.getPixel(x, y);
    }
  });
}

export function mapWindow(
  img: Image,
  xInterval: number[], // Assumed to be a two element array containing [x_min, x_max]
  yInterval: number[], // Assumed to be a two element array containing [y_min, y_max]
  func: (p: Color) => Color
): Image {
  function condition(_: Image, x: number, y: number): boolean {
    let bool = false;
    if (x >= xInterval[0] && x <= xInterval[1] && y >= yInterval[0] && y <= yInterval[1]) {
      bool = true;
    }
    return bool;
  }

  return imageMapIf(img, condition, func);
}

export function isGrayish(p: Color): boolean {
  let cond = false;

  const minimum = p.reduce((min, num) => {
    return min > num ? num : min;
  }, p[0]);

  const maximum = p.reduce((max, num) => {
    return max < num ? num : max;
  }, p[0]);

  if (maximum - minimum <= 85) {
    cond = true;
  }

  return cond;
}

export function makeGrayish(img: Image): Image {
  function makeGrayBool(_: Image, x: number, y: number) {
    return !isGrayish(img.getPixel(x, y));
  }

  function makeGrayHelper(c: Color) {
    const avg = Math.floor((c[0] + c[1] + c[2]) / 3);
    c[0] = avg;
    c[1] = avg;
    c[2] = avg;

    return c;
  }

  return imageMapIf(img, makeGrayBool, makeGrayHelper);
}

export function pixelBlur(img: Image, x: number, y: number): Color {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  for (let i = x - 1; i <= x + 1; ++i) {
    for (let j = y - 1; j <= y + 1; ++j) {
      if (i >= 0 && i < img.width && j >= 0 && j < img.height) {
        count++;
        r += img.getPixel(i, j)[0];
        g += img.getPixel(i, j)[1];
        b += img.getPixel(i, j)[2];
      }
    }
  }
  return [Math.floor(r / count), Math.floor(g / count), Math.floor(b / count)];
}

export function imageBlur(img: Image): Image {
  return imageMapCoord(img, pixelBlur);
}
