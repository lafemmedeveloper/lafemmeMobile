import moment from 'moment';
import 'moment/locale/es';
moment().locale('es');

export const msToDate = (value) => {
  // console.log('msToDate', value);
  let date = moment(value * 1000).format('LL');
  return date;
};
export const msToDay = (value) => {
  // console.log('msToDay', value);
  let date = moment(value * 1000).format('LL');
  return date;
};

export const msToHour = (value) => {
  // console.log('msToHour', value);
  let date = moment(value * 1000).format('h:mm a');
  return date;
};

export const minToHours = (value) => {
  // console.log('minToHours', value);
  let h = moment
    .utc(moment.duration(value, 'minutes').asMilliseconds())
    .format('HH:mm');

  const hours = `${h} ${value >= 60 ? 'hrs' : 'min'}`;

  return hours;
};

export const formatDate = (date, format) => {
  // console.log('formatDate', date, format);
  let formated = moment(date).format(format);

  return formated;
};

export const getDate = (addValue) => {
  // console.log('getDate', addValue);
  let now = moment(new Date()).add(addValue, 'hours').format('YYYY-MM-DD');

  return now;
};
 