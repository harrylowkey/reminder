
const { google } = require('googleapis');
const API_KEY = process.env.API_KEY
const RANGE = 'A1:Z40'
const { getBirthdayPeople, reporter } = require('./utils')
const { REMINDER } = require('./reminder')
let getSpreadSheetById = async (spreadsheetId) => {
  var sheets = google.sheets('v4');
  try {
    let res = await sheets.spreadsheets.values.get({ spreadsheetId, key: API_KEY, range: RANGE })
    const rawData = res.data.values;
    if (!rawData.length) return console.log('Not found data')
    let dataUsers = preData(rawData)
    return dataUsers

  } catch (error) {
    return console.log('Err', error)
  }
}

let preData = (rawData) => {
  let data = []
  let keysArray = rawData[0]
  for (let i = 1; i < rawData.length; i++) {
    let index = i
    let obj = {}
    for (let j = 0; j < keysArray.length; j++) {
      let key = keysArray[j].replace(/\s/g, "").toUpperCase()
      let value = rawData[index][j] || ''
      obj[key] = value
    }
    data.push(obj)
  }
  return data
}

module.exports = {
  getSpreadSheetById,
  preData
}