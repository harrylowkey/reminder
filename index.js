require('module-alias/register')
let path = `.${process.env.NODE_ENV || 'local'}.env`
console.log("Path: ", path)
require('dotenv').config({
  path: path
})

const moment = require('moment')
var cron = require('node-cron');
const DB = require('./db/mongoose')
DB.connect()

const { authorize } = require('./authorization')
const { reporter } = require('./common/reporter')
const { sendMail } = require('./common/mailer/sendgrid')

async function init() {
  await authorize()
    .then(async (auth) => {
      let [birthdayReport, weatherReport, calendarReport, cryptoReport] = await Promise.all([
        reporter('BIRTH_DAY'),
        reporter('WEATHER', {
          cities: ['Tỉnh Khánh Hòa', 'Thanh pho Ho Chi Minh', 'Ha Noi', 'Cam Pha Mines', 'Tỉnh Ðà Nẵng']
        }),
        reporter('CALENDAR', { auth }),
        reporter('CRYPTO')
      ])

      let today = moment().format("MM-DD-YYYY")
      let header = `Reminder Report -- ${today}`
      
      let data = {
        header,
        birthdayReport,
        weatherReport,
        calendarReport,
        cryptoReport,
      }

      sendMail(data)
    })

}

cron.schedule('0 08 * * *', () => {
  init()
}, {
  scheduled: true,
  timeZone: "Asia/Ho_Chi_Minh"
});







