const sgMail = require('@sendgrid/mail');
const Promise = require('bluebird')
const API_KEY = process.env.SENDGRID_API_KEY
const userMails = [
  {
    name: 'Quang',
    gmail: 'danghongquang99@gmail.com'
  },
  {
    name: 'Quang-Homa',
    gmail: 'quang.dang@homa.company'
  }
]

sgMail.setApiKey(API_KEY);
const send = ({ to, subject, dataTemplate, templateId, html, text }) => {
  const preData = {
    to,
    from: 'noreply@reminder.com',
    subject,
    templateId,
    dynamic_template_data: dataTemplate,
    html,
    text,
    hideWarnings: true
  }
  sgMail.send(preData)
    .then(() => console.log('Send report success to ', to))
    .catch(err => console.log('Error when send report mail', (err.response.body.errors)))
  return true
}

const sendMail = async (data) => {
  await Promise.map(userMails, (user) => {
    let preData = {
      subject: 'Reminder report',
      to: user.gmail,
      text: data
    }
    return send(preData)
  }, { concurrency: 100 })
}

module.exports = {
  sendMail
}