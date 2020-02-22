const moment = require('moment')

const getBirthdayPeople = (datas) => {
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

let birthdayReport = (datas) => {
  let matchPeople = getBirthdayPeople(datas)
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

const reporter = (datas, type) => {
  let report
  switch (type) {
    case 'BIRTH_DAY':
      report = birthdayReport(datas)
      break
    default:
      console.log('Invalid type')
      break
  }
  return report
}


module.exports = {
  getBirthdayPeople,
  reporter
}