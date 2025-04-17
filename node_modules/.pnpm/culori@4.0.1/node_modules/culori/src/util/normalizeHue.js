const normalizeHue = hue => ((hue = hue % 360) < 0 ? hue + 360 : hue);

export default normalizeHue;
