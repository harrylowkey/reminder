let path = `.${process.env.NODE_ENV || 'local'}.env`
console.log("Path: ", path)
require('dotenv').config({
  path: path
})

const DB = require('./mongoose')
DB.connect()

const { reporter } = require('./common/reporter')
const { sendMail } = require('./common/mailer/sendgrid')

async function init() {
  let [birthdayReport, weatherReport] = await Promise.all([
    reporter('BIRTH_DAY'),
    reporter('WEATHER', {
      cities: ['Tỉnh Khánh Hòa', 'Thanh pho Ho Chi Minh', 'Ha Noi', 'Cam Pha Mines', 'Tỉnh Ðà Nẵng']
    })
  ])
    const reports = `
    ${birthdayReport.header} \
    ${birthdayReport.details}\
    ${weatherReport.header}\
    ${weatherReport.details}\
    `
    console.log(birthdayReport, weatherReport)
    // await sendMail(reports)
}
init()







