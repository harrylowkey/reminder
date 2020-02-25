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
        start: start.slice(11, 19) || start,
        end: end.slice(11, 19) || end,
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
  let description = ''
  if (events.length == 0) {
    description = 'No event today'
  }
  let data = events.map(event => ({
    content: event.content,
    description: event.description,
    start: event.start,
    end: event.end
  }))
  
  return { header, description, data }
}

module.exports = { calendarReport }