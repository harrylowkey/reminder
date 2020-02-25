const moment = require('moment')
const xlsx = require('xlsx-populate')
const RANGE = 'A1:L40'
const SPREAD_SHEET_ID = '126KByeu4XDePZ01oUd9DvutPLw1167Oaw94Kpo2cdZ8'
const { preUserData, getSpreadSheetById } = require('@utils')
const USER_DATA_PATH = __dirname + '/data.xlsx'

let getBirthdayPeople = (datas) => {
  let today = moment().format("MM-DD")
  const peopleMatch = datas.filter(person => {
    let dob = person.DOB || ''
    if (dob.includes('/')) person.DOB = dob.split('/').reverse().join('-')
    else if (dob.includes('-')) person.DOB = dob.split('-').reverse()
    let formatDateMonth = moment(person.DOB).format('MM-DD')
    return formatDateMonth == today
  })
  return peopleMatch
}

let fetchUserData = async () => {
  let data = await xlsx.fromFileAsync(USER_DATA_PATH)
    .then(async workbook => {
      const value = workbook.sheet("Sheet1").range(RANGE).value();
      if (value.length <= 0) {
        await getSpreadSheetById(SPREAD_SHEET_ID)
      }
      return preUserData(value)
    })
    .catch(async err => {
      // No file data found
      if (err.errno === -2) {
        await getSpreadSheetById(SPREAD_SHEET_ID)
      }
    })
  if (!data) return console.log('Error when fetching data')
  return data
}

let birthdayReport = async () => {
  let userData = await fetchUserData()
  let matchPeople = getBirthdayPeople(userData)
  let header = `Birthday Friends`
  let description = 'No birthday firends today'
  let data = []

  if (matchPeople.length > 0) {
    let age = moment().format('YYYY') - moment(matchPeople[0].DOB).format('YYYY')
    let isMany = matchPeople.length === 1 ? false : true
    description = `Today you have ${matchPeople.length} friend${isMany ? 's' : ''} who ${isMany ? 'were' : 'was'} born on this day ${age} years ago \n`
    data = matchPeople.map(person => ({
      name: person.FULLNAME,
      email: person.EMAIL,
      team: person['TEAM(S)'],
      phone: person.PHONE,
      hobbies: person.hobbies || ''
    }))
  }

  return {
    header,
    description,
    data
  }

}
module.exports = {
  birthdayReport
}