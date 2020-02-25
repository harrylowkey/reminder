const sgMail = require('@sendgrid/mail');
const Promise = require('bluebird')
const path = require('path')
const pug = require('pug')
const API_KEY = process.env.SENDGRID_API_KEY
const userMails = [
  {
    name: 'Quang',
    gmail: 'danghongquang99@gmail.com'
  },
  // {
  //   name: 'Quang-Homa',
  //   gmail: 'quang.dang@homa.company'
  // }
]

sgMail.setApiKey(API_KEY);
const send = ({ to, subject, template }) => {
  const preData = {
    to,
    from: 'noreply@reminder.com',
    subject,
    html: template,
    text: "AA",
    hideWarnings: true
  }
  sgMail.send(preData)
    .then(() => console.log('Send report success to ', to))
    .catch(err => console.log('Error when send report mail', (err.response.body.errors)))
  return true
}

const sendMail = async (data) => {
  const template = pug.renderFile(path.join(__dirname, '../../template/mail.pug'), data);
  await Promise.map(userMails, (user) => {
    let preData = {
      subject: 'Reminder Report',
      to: user.gmail,
      template
    }
    return send(preData)
  }, { concurrency: 100 })
}

module.exports = {
  sendMail
}