
let { birthdayReport } = require('./birthday')
let { weatherReport } = require('./weather')
let { calendarReport } = require('./calendar')


const reporter = async (type, option = {}) => {
  let report
  switch (type) {
    case 'BIRTH_DAY':
      report = await birthdayReport()
      break
    case 'WEATHER':
      let cities = option.cities || []
      report = await weatherReport(cities)
      break
    case 'CALENDAR':
      let auth = option.auth || {}
      report = await calendarReport(auth)
      break
    default:
      console.log('Invalid type')
      break
  }
  return report
}
module.exports = {
  reporter
}