
let { birthdayReport } = require('./birthday')
let { weatherReport } = require('./weather')


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
    default:
      console.log('Invalid type')
      break
  }
  return report
}
module.exports = {
  reporter
}