export default {
  create_UUID: () => {
    let date = new Date().getTime();
    const uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(
      /[xy]/g,
      function(c) {
        const r = (date + Math.random() * 16) % 16 | 0;
        date = Math.floor(date / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
      },
    );
    return uuid;
  },

  formatCOP: num => {
    var p = num.toFixed(2).split('.');
    return (
      '$' +
      p[0]
        .split('')
        .reverse()
        .reduce(function(acc, num, i, orig) {
          return num == '-' ? acc : num + (i && !(i % 3) ? '.' : '') + acc;
        }, '')
    );
  },
};
