let City = require('../city/city.model').model
let axios = require('axios')
const Promise = require('bluebird')

let env = process.env.NODE_ENV || 'local'
let WEATHER_URL = `${env == 'local' ? 'http://' : ''}api.openweathermap.org/data/2.5/weather`
const API_KEY = process.env.OPENWEATHER_API_KEY


let makeReportDetail = (data) => {
  const { getTimes } = require('../utils')
  let header = 'WEATHER TODAY'
  let details = []
  Object.keys(data).forEach((id, index) => {
    let city = data[id] || undefined
    if (!city) return console.log('Not found weather data')
    let weather = city.weather[0]
    let { main, sys, wind, clouds } = city

    let mess = `
    ${index + 1}. Name: ${city.name} \
    Main: ${weather.main} \
    ${weather.description} \
    Tenparatuure: ${main.temp - 273.15} *C \
    Pressure: ${main.pressure} \
    Humidity: ${main.humidity} \
    Wind Speed: ${wind.speed} \
    Clouduiness: ${clouds.all}% \
    Sunrise: ${getTimes(sys.sunrise)} \
    Sunset: ${getTimes(sys.sunset)} \
    `
    details.push(mess)
  })
  return { header, details }
}

let weatherReport = async (cities) => {
  const data = await City.find({
    country: 'VN',
    name: { $in: cities },

  })
  let weatherMapById = {}
  let fetchCitiesWeather = async (cities) => {
    cities.map(async city => {
      weatherMapById[city.id] = axios.get(`${WEATHER_URL}?id=${city.id}&appid=${API_KEY}`)
        .then(res => res.data)
        .catch(err => console.log('Error when fetching weather data', err.response.status, err.response.statusText))
    })
    return weatherMapById
  }
  const weather = await Promise.props(fetchCitiesWeather(data))
  return makeReportDetail(weather)

}

module.exports = {
  weatherReport
}