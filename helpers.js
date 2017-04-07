const axios = require('axios')

fetchService = (stationCode) => {
  return axios.get(`https://www.metlink.org.nz/api/v1/StopDepartures/${stationCode}`)
  .then((res) => { return res.data })
  .catch((err) => { console.error('error fetching station data', err) })
}

module.exports = { fetchService }