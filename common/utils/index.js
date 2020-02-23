let moment = require('moment-timezone')

let getTimes = (timestamp) => {
  if (typeof timestamp !== 'number') return timestamp;
  return moment
    .unix(timestamp)
    .tz('Asia/Ho_Chi_Minh')
    .format()
    .slice(11, 19)
}
module.exports = {
  getTimes
}