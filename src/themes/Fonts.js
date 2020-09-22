const size = {
  bigTitle: 50,
  h1: 38,
  h2: 34,
  h3: 30,
  h4: 26,
  h5: 20,
  h6: 19,
  input: 18,
  regular: 17,
  medium: 14,
  small: 12,
  tiny: 8.5,
};

const style = {
  bold: (color, fontSize, align) => ({
    fontWeight: 'bold',
    color: color,
    fontSize,
    textAlign: align,
  }),
  semiBold: (color, fontSize, align) => ({
    fontWeight: '700',
    color: color,
    fontSize,
    textAlign: align,
  }),
  regular: (color, fontSize, align) => ({
    fontWeight: 'normal',
    color: color,
    fontSize,
    textAlign: align,
  }),
  underline: (color, fontSize, align) => ({
    fontWeight: 'normal',
    textDecorationLine: 'underline',
    color: color,
    fontSize,
    textAlign: align,
  }),

  light: (color, fontSize, align) => ({
    fontWeight: '500',
    color: color,
    fontSize,
    textAlign: align,
  }),
};

export default {
  size,
  style,
};
