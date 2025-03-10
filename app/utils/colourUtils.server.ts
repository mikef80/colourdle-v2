const hexToRgb = (hex: String) => {
  return [
    parseInt(hex.substring(1, 3), 16),
    parseInt(hex.substring(3, 5), 16),
    parseInt(hex.substring(5, 7), 16),
  ];
};

const rgbToHex = (rgb: [number, number, number]) => {
  const hexValues = rgb.map((value) => {
    const hex = value.toString(16).toUpperCase();
    return hex.padStart(2, "0");
  });

  return `#${hexValues.join("")}`;
};

const generateRandomRGB = (): [number, number, number] => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return [r, g, b];
};

export { hexToRgb, rgbToHex, generateRandomRGB };
