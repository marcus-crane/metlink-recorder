const r = require('rethinkdbdash')({ db: 'metlink' })
const axios = require('axios')

fetchService = (stationCode) => {
  return axios.get(`https://www.metlink.org.nz/api/v1/StopDepartures/${stationCode}`)
  .then((res) => { return res.data })
  .catch((err) => { console.error('error fetching station data', err) })
}

insertData = (service) => {
  r.table('services')
  .insert({
    'id': r.uuid(),
    'trainID': service.VehicleRef,
    'origin': service.OriginStopID,
    'destination': service.DestinationStopID,
    'intendedArrival': service.AimedArrival,
    'intendedDeparture': service.AimedDeparture,
    'expectedDeparture': service.ExpectedDeparture,
    'status': service.DepartureStatus,
    'type': service.Service.Mode,
    'code': service.Service.Code,
    'name': service.Service.Name,
    'createdAt': r.now()
  })
  .catch((err) => {
    console.error('failed to insert data', err)
  })
}

insertOperatingServices = (APIresponse) => {
  for (service of APIresponse.Services) {
    if (service.VehicleRef) {
      insertData(service)
    }
  }
}

module.exports = { fetchService, insertOperatingServices }