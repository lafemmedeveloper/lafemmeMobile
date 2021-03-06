const images = {
  //Logo
  fullLogo: require('../Images/fullLogo.png'),
  iconLogo: require('../Images/iconLogo.png'),
  textLogo: require('../Images/textLogo.png'),

  headerSmall: require('../Images/headerSmall.png'),
  headerBig: require('../Images/headerBig.png'),
  topHeader: require('../Images/topHeader.png'),

  //services
  hair: require('../Images/services/hair.png'),
  massage: require('../Images/services/massage.png'),
  makeup: require('../Images/services/makeup.png'),
  nails: require('../Images/services/nails.png'),
  banner: require('../Images/services/banner.png'),

  logoLafemme: require('../Images/logoLafemme.png'),
  logoExpert: require('../Images/logoExpert.png'),

  moto: require('../Images/moto.png'),
  user: require('../Images/user.png'),
  defaultUser: require('../Images/defaultUser.jpg'),

  billResume: require('../Images/billResume.png'),
  inspo: require('../Images/gallery.png'),

  itemMenu: require('../Images/navigation/itemMenu.png'),
  menuUser: require('../Images/navigation/menuUser.png'),
  menuAppoiment: require('../Images/navigation/menuAppoiment.png'),
  menuGift: require('../Images/navigation/menuGift.png'),
  address: require('../Images/address.png'),
  pinAddress: require('../Images/addresspin.png'),
  coverage: require('../Images/mapa.png'),
  name: require('../Images/username.png'),
  email: require('../Images/email.png'),
  ref: require('../Images/referir.png'),
  note: require('../Images/nota.png'),
  coupon: require('../Images/cupon.png'),
  guest: require('../Images/grupo.png'),
  photo: require('../Images/foto.png'),
  delivery: require('../Images/delivery.png'),
  password: require('../Images/contrasena.png'),
  edit: require('../Images/editar.png'),
  cancel: require('../Images/prohibido.png'),

  //icons
  next: require('../Images/next.png'),
  time: require('../Images/time.png'),
  close: require('../Images/close.png'),
  menu: require('../Images/menu.png'),
  alarm: require('../Images/alarm.png'),
  pin: require('../Images/pin.png'),
  upload: require('../Images/uploadImage.png'),
  handleTime: require('../Images/handleTime.png'),
  serch: require('../Images/serch.json'),
  noConection: require('../Images/noConection.png'),
  message: require('../Images/sendemail.png'),
  maps: require('../Images/googlemaps.png'),

  fbIcon:
    'data:image/png;base64,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',

  gIcon:
    'data:image/png;base64,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',
};

export default images;
