const moment = require('moment')
const xlsx = require('xlsx-populate')
const RANGE = 'A1:L40'
const SPREAD_SHEET_ID = '126KByeu4XDePZ01oUd9DvutPLw1167Oaw94Kpo2cdZ8'
const { preData } = require('../../spreadsheet')
const { authorize } = require('../../authorization')
const { getSpreadSheetById } = require('../../spreadsheet')

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
      if (!value.length < 0) {
        return await authorize()
          .then(async () => {
            return await getSpreadSheetById(SPREAD_SHEET_ID)
          })
          .catch(err => console.log('Error when fetching data', err))
      }
      return preData(value)
    })
    .catch(async err => {
      // No file data found
      if (err.errno === -2) {
        return await authorize()
          .then(async () => {
            return await getSpreadSheetById(SPREAD_SHEET_ID)
          })
          .catch(err => console.log('Error when fetching data', err))
      }
    })
  if (!data) return console.log('Error when fetching data')
  return data
}

let birthdayReport = async () => {
  let userData = await fetchUserData()
  let matchPeople = getBirthdayPeople(userData)
  if (matchPeople.length > 0) {
    let today = moment().format("MM-DD-YYYY")
    let header = `BIRTHDAY FRIENDS TODAY - ${today}`
    let age = moment().format('YYYY') - moment(matchPeople[0].DOB).format('YYYY')
    let isMany = matchPeople.length === 1 ? false : true
    let mess = `Today you have ${matchPeople.length} friend${isMany ? 's' : ''} who ${isMany ? 'were' : 'was'} born on this day ${age} years ago \n`
    let details = [mess]
    matchPeople.forEach((person, i) => {
      let mess = `${i + 1}. ${person.FULLNAME}\ Email: ${person.EMAIL}\ Phone: ${person.PHONE}`
      return details.push(mess)
    })
    return { header, details }
  }
  return ''
}

module.exports = {
  birthdayReport
}