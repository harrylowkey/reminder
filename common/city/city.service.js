const City = require ('./city.model').model

let fetchAllCities = async () => {
  let cities = await City.find({}).lean()
  return cities
}

module.exports = {
  fetchAllCities
}