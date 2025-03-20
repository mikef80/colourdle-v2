// amend RGB for testing
const amendRGB = (rgb: number[]): [number, number, number] => {
  return rgb.map((value) => {
    return (value + 1) % 10 === 0
      ? (value -= Math.floor(Math.random() * 9))
      : (value += Math.floor(Math.random() * (Math.ceil(value / 10) * 10 - value)));
  }) as [number, number, number];
};

export { amendRGB };
