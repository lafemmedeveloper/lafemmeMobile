import moment from 'moment';

export const msToDate = (value) => {
  let date = moment(value*1000).format('LLL');
  return date;
};
