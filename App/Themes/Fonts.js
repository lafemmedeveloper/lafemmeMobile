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
  bold: (color, size, align, letterSpacing) => ({
    fontFamily: type.bold,
    color: color,
    fontSize: size,
    textAlign: align,
    lineHeight: size * 1.5,
    letterSpacing: letterSpacing,
  }),
  semiBold: (color, size, align, letterSpacing) => ({
    fontFamily: type.semiBold,
    color: color,
    fontSize: size,
    textAlign: align,
    lineHeight: size * 1.5,
    letterSpacing: letterSpacing,
  }),
  regular: (color, size, align, letterSpacing) => ({
    fontFamily: type.regular,
    color: color,
    fontSize: size,
    textAlign: align,
    lineHeight: size * 1.5,
    letterSpacing: letterSpacing,
  }),
  underline: (color, size, align, letterSpacing) => ({
    fontFamily: type.regular,
    textDecorationLine: 'underline',
    color: color,
    fontSize: size,
    textAlign: align,
    lineHeight: size * 1.5,
    letterSpacing: letterSpacing,
  }),

  light: (color, size, align, letterSpacing) => ({
    fontFamily: type.light,
    color: color,
    fontSize: size,
    textAlign: align,
    lineHeight: size * 1.5,
    letterSpacing: letterSpacing,
  }),
};

export default {
  type,
  size,
  style,
};
