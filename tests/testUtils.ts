// amend RGB for testing
const amendRGB = (rgb: number[]): [number, number, number] => {
  return rgb.map((value) => ((value + 1) % 10 === 0 ? value - 1 : value + 1)) as [
    number,
    number,
    number
  ];
};

export { amendRGB };
