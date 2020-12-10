/* eslint-disable no-bitwise */
export default {
  create_UUID: () => {
    let date = new Date().getTime();
    const uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (date + Math.random() * 16) % 16 | 0;
        date = Math.floor(date / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      },
    );
    return uuid;
  },

  log: (title, value, color) => {
    console.log(`%c${title}: ${value}`, `color: ${color};`);
    return null;
  },
  create_CartId: () => {
    let date = new Date().getTime();
    const uuid = 'xxxxxx'.replace(/[xy]/g, function (c) {
      const r = (date + Math.random() * 16) % 16 | 0;
      date = Math.floor(date / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  },

  formatCOP: (number) => {
    let num = Number(number);
    let p = num.toFixed(2).split('.');
    return (
      '$' +
      p[0]
        .split('')
        .reverse()
        .reduce(function (acc, num, i, orig) {
          return num === '-' ? acc : num + (i && !(i % 3) ? '.' : '') + acc;
        }, '')
    );
  },

  slugify: (string) => {
    return string
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  },

  counting: (date) => {
    let now = new Date(),
      remainTime = (new Date(date) - now + 1000) / 1000,
      remainSeconds = ('0' + Math.floor(remainTime % 60)).slice(-2),
      remainMinutes = ('0' + Math.floor((remainTime / 60) % 60)).slice(-2),
      remainHours = ('0' + Math.floor((remainTime / 3600) % 24)).slice(-2),
      remainDays = Math.floor(remainTime / (3600 * 24));

    return {
      remainSeconds,
      remainMinutes,
      remainHours,
      remainDays,
      remainTime,
    };
  },

  capitalize: (s) => {
    if (typeof s !== 'string') {
      return '';
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
  },
};
