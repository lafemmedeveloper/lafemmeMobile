import moment from 'moment';
import 'moment/locale/es';
moment().locale('es');

export const msToDate = (value) => {
  let date = moment(value * 1000).format('LL');
  return date;
};
export const msToDay = (value) => {
  let date = moment(value * 1000).format('LL');
  return date;
};

export const msToHour = (value) => {
  let date = moment(value * 1000).format('h:mm a');
  return date;
};

export const minToHours = (value) => {
  let h = moment
    .utc(moment.duration(value, 'minutes').asMilliseconds())
    .format('HH:mm');

  const hours = `${h} ${value >= 60 ? 'hrs' : 'min'}`;

  return hours;
};

export const formatDate = (date, format) => {
  let formated = moment(date).format(format);

  return formated;
};

export const getDate = (addValue) => {
  let now = moment(new Date()).add(addValue, 'hours').format('YYYY-MM-DD');

  return now;
};

export const generateSchedule = (openingTime, closeTime) => {
  let a = formatMoment(openingTime);
  let c = formatMoment(closeTime);

  return function (hora) {
    const h = formatMoment(hora);

    if (a > c) {
      return h >= a || h <= c;
    }

    return h >= a && h <= c;
  };
};
const formatMoment = (time) => {
  const regexp = /\d\d:\d\d(:\d\d)?/;
  if (regexp.test(time)) {
    const units = time.split(':');
    return +units[0] * 3600 + +units[1] * 60 + (+units[2] || 0);
  }
  return null;
};
//let openHour = generateSchedule('09:00', '02:00');
//openHour('24:00');
