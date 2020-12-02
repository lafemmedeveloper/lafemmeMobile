import {useEffect, useState} from 'react';
import _ from 'lodash';

export const useCouponsDiscount = (services, coupon) => {
  const [disscounts, setDisscounts] = useState([]);
  const [totalDiscount, setTotalDiscount] = useState(0);

  let _disscounts = [];

  if (coupon !== null) {
    for (let index = 0; index < services.length; index++) {
      _disscounts.push({
        price: services[index].total,
        type: coupon.typeCoupon,
        disscount:
          coupon.type.indexOf(services[index].servicesType) !== -1
            ? coupon.typeCoupon !== 'money'
              ? (coupon.percentage / 100) * services[index].total -
                services[index].total
              : services[index].total - coupon.money
            : 0,

        service: services[index].name,
      });
    }
  }

  useEffect(() => {
    setDisscounts(_disscounts);
    setTotalDiscount(_.sumBy(_disscounts, 'disscount'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services, coupon]);

  return {disscounts, totalDiscount};
};
