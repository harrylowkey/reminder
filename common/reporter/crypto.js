const axios = require('axios')
const CMC_PRO_API_URL = "https://pro-api.coinmarketcap.com"
const CMC_PRO_API_KEY = process.env.CMC_PRO_API_KEY

let fetchCryptoPrice = async () => {
  let coinString = ['BTC', 'ETH', 'MAS', 'MCASH']

  let request = null
  const url = `${CMC_PRO_API_URL}/v1/cryptocurrency/quotes/latest?symbol=${coinString}`
  request = await axios.get(url,
    {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_PRO_API_KEY
      }
    })
    .then(res => {
      let results = res.data
      if (!results || !results['status'] || results['status']['error_code'] === 0) {
        return results.data
      } else {
        return null
      }
    })
    .catch(err => {
      console.log(err)
      return null
    })
  if (request) {
    let data = []
    for (let key in request) {
      if (request.hasOwnProperty(key)) {
        let preData = {
          name: request[key]['name'],
          symbol: request[key]['symbol'],
          price: request[key]['quote']['USD']['price'],
          percentChange1h: request[key]['quote']['USD']['percent_change_1h'],
          percentChange24h: request[key]['quote']['USD']['percent_change_24h'],
        }
        data.push(preData)
      }
    }
    return data
  }
}

let cryptoReport = async () => {
  let datas = await fetchCryptoPrice()
  if (!datas) return console.log('Error when fetching crypto price')
  let header = 'CRYPTO  REPORT'
  let details = []
  datas.map((crypto, index) => {
    let mess = `
    ${index + 1}. Name: ${crypto.name}\
    Symbol: ${crypto.symbol}\
    Price: ${crypto.price}\
    1h Change: ${crypto.percentChange1h}%\
    24h Change: ${crypto.percentChange24h}%
    `
    details.push(mess)
  })

  return { header, details }
}

module.exports = { cryptoReport }