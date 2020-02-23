const { google } = require('googleapis');
let moment = require('moment-timezone')

let fetchEvents = async (auth) => {
  const calendar = google.calendar({ version: 'v3', auth });
  let res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 50,
    singleEvents: true,
    orderBy: 'startTime',
  }).catch(err => console.log('Error when fetching events'))

  const events = res.data.items;
  let preEvents = []
  events.map(event => {
    let start = event.start.dateTime || event.start.date
    let end = event.end.dateTime || event.start.date
    let startTimestamp = moment(start.slice(0, 10)).unix()
    let endTimestamp = moment(end.slice(0, 10)).unix()
    let today = moment((moment().format("YYYY-MM-DD")).slice(0, 10)).unix()
    if (today >= startTimestamp && today <= endTimestamp) {
      let preData = {
        start: start.slice(11, 19),
        end: end.slice(11, 19),
        content: event.summary,
        description: event.description || ''
      }
      preEvents.push(preData)
    } 
  })
  return preEvents
}

async function calendarReport(auth) {
  let events = await fetchEvents(auth)
  let header = 'CALENDAR REPORT'
  if (events.length == 0) {
    return { header, details: ['No event today'] }
  }
  let details = []
  events.map((event, index) => {
    let mess = `
      ${index + 1}. ${event.content} \
      Description: ${event.description} \
      Start: ${event.start} \
      End: ${event.end}
    `
    details.push(mess)
  })
  return { header, details }
}

module.exports = { calendarReport }