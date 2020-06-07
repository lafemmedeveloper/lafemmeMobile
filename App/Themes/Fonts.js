import Colors from './Colors';
import Metrics from './Metrics';

const type = {
  light: 'OpenSans-Light',
  regular: 'OpenSans-Regular',
  bold: 'OpenSans-Bold',
  semiBold: 'OpenSans-SemiBold',
};

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
  bold: (color, fontSize, align, letterSpacing) => ({
    fontFamily: type.bold,
    color: color,
    fontSize,
    textAlign: align,
    letterSpacing: letterSpacing,
  }),
  semiBold: (color, fontSize, align, letterSpacing) => ({
    fontFamily: type.semiBold,
    color: color,
    fontSize,
    textAlign: align,
    letterSpacing: letterSpacing,
  }),
  regular: (color, fontSize, align, letterSpacing) => ({
    fontFamily: type.regular,
    color: color,
    fontSize,
    textAlign: align,
    letterSpacing: letterSpacing,
  }),
  underline: (color, fontSize, align, letterSpacing) => ({
    fontFamily: type.regular,
    textDecorationLine: 'underline',
    color: color,
    fontSize,
    textAlign: align,
    letterSpacing: letterSpacing,
  }),

  light: (color, fontSize, align, letterSpacing) => ({
    fontFamily: type.light,
    color: color,
    fontSize,
    textAlign: align,
    letterSpacing: letterSpacing,
  }),
};

export default {
  type,
  size,
  style,
};
