import _ from 'lodash';
export const calculeTotal = async (coupon, services, setOrderTotal) => {
  let currentService = services;
  if (coupon) {
    for (let index = 0; index < currentService.length; index++) {
      if (coupon.type.includes(currentService[index].servicesType)) {
        const calculate =
          coupon.typeCoupon !== 'money'
            ? (coupon.percentage / 100) * currentService[index].total -
              currentService[index].total
            : currentService[index].total - coupon.money;
        currentService[index].total = calculate;
      }
    }
    console.log('currentService ==>', currentService);
    setOrderTotal(_.sumBy(currentService, 'total'));
  } else {
    setOrderTotal(_.sumBy(services, 'total'));
  }
};
