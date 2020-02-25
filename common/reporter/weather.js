let City = require('../city/city.model').model
let axios = require('axios')
const Promise = require('bluebird')

let env = process.env.NODE_ENV || 'local'
let WEATHER_URL = `${env == 'local' ? 'http://' : ''}api.openweathermap.org/data/2.5/weather`
const API_KEY = process.env.OPENWEATHER_API_KEY


let makeReportDetail = (datas) => {
  const { getTimes } = require('../utils')
  let header = 'WEATHER'
  let data = []

  for (let key in datas) {
    if (datas.hasOwnProperty(key)) {
      let city = datas[key]
      let weather = city.weather[0]
      let { main, sys, wind, clouds } = city

      let preData = {
        name: city.name,
        main: weather.main,
        description: weather.description,
        temparature: main.temp - 273.15,
        humidity: main.humidity,
        windSpeed: wind.speed,
        cloudiness: clouds.all + '%',
        sunrise: getTimes(sys.sunrise),
        sunset: getTimes(sys.sunset)
      }
      data.push(preData)
    }
  }
  return { header, data }
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