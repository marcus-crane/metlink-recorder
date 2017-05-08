const r = require('rethinkdbdash')({ db: 'metlink' })
const axios = require('axios')

fetchService = (stationCode) => {
  return axios.get(`https://www.metlink.org.nz/api/v1/StopDepartures/${stationCode}`)
  .then((res) => { return res.data })
  .catch((err) => { console.error('error fetching station data', err) })
}

insertData = (nextTrain) => {
  r.table('services')
  .insert({
    'id': r.uuid(),
    'trainID': nextTrain.VehicleRef,
    'origin': nextTrain.OriginStopID,
    'destination': nextTrain.DestinationStopID,
    'intendedArrival': nextTrain.AimedArrival,
    'intendedDeparture': nextTrain.AimedDeparture,
    'expectedDeparture': nextTrain.ExpectedDeparture,
    'status': nextTrain.DepartureStatus,
    'createdAt': r.now()
  })
  .catch((err) => {
    console.error('failed to insert data', err)
  })
}

module.exports = { fetchService, insertData }