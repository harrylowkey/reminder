let path = `.${process.env.NODE_ENV || 'local'}.env`
console.log("Path: ", path)
require('dotenv').config({
  path: path
})

var cron = require('node-cron');

const DB = require('./db/mongoose')
DB.connect()

const { authorize } = require('./authorization')
const { reporter } = require('./common/reporter')
const { sendMail } = require('./common/mailer/sendgrid')

async function init() {
  await authorize()
    .then(async (auth) => {
      let [birthdayReport, weatherReport, calendarReport] = await Promise.all([
        reporter('BIRTH_DAY'),
        reporter('WEATHER', {
          cities: ['Tỉnh Khánh Hòa', 'Thanh pho Ho Chi Minh', 'Ha Noi', 'Cam Pha Mines', 'Tỉnh Ðà Nẵng']
        }),
        reporter('CALENDAR', { auth })
      ])

      const reports = `
        ${birthdayReport.header} \
        ${birthdayReport.details}\
        ${weatherReport.header}\
        ${weatherReport.details}\
        ${calendarReport.header}\
        ${calendarReport.details}\
        `

      console.log(reports)
      // await sendMail(reports)
    })

}

init()

// cron.schedule('00 08 * * *', () => {
//   init()
// }, {
//   scheduled: true,
//   timeZone: "Asia/Ho_Chi_Minh"
// });







