export const calculeTotal = (user, totalService) => {
  const {cart} = user;
  const {coupon, services} = cart;
  let result = 0;

  if (coupon) {
    for (let index = 0; index < services.length; index++) {
      if (user.cart.coupon.type.includes(services[index].servicesType)) {
        const resultSuma =
          coupon.typeCoupon !== 'money'
            ? (coupon.percentage / 100) * services[index].total -
              services[index].total
            : services[index].total - coupon.money;

        result = resultSuma;
      }
    }
    return result;
  } else {
    return totalService;
  }
};
