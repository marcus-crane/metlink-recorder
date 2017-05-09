const r = require('rethinkdbdash')({ db: 'metlink' })
const moment = require('moment')
const axios = require('axios')

currentTime = () => {
  return moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
}

fetchData = (stationCode) => {
  return axios.get(`https://www.metlink.org.nz/api/v1/StopDepartures/${stationCode}`)
  .then((res) => { return res.data })
  .catch((err) => { console.error(`error fetching station data at ${currentTime()}`, err) })
}

queryTrip = (intendedDeparture) => {
  return r.table('services')
  .filter(r.row('intendedDeparture').eq(intendedDeparture))
  .then(service => {
    if (service.length) {
      return service[0].id
    } else {
      return false
    }
  })
  .catch(err => console.error(err))
}

upsertData = (service) => {
  queryTrip(service.AimedDeparture)
  .then(id => {
    if (id) {
      updateData(service, id)
    } else {
      insertData(service)
    }
  })
}

updateData = (service, id) => {
  r.table('services')
  .get(id)
  .update({
    'intendedArrival': service.AimedArrival,
    'expectedDeparture': service.ExpectedDeparture,
    'status': service.DepartureStatus,
    'modified': r.now()
  })
  .then((res) => {
    console.log(`updated ${service.VehicleRef} at ${currentTime()}`)
  })
  .catch((err) => {
    console.log('error updating', err)
  })
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
  .then((res) => {
    console.log(`inserted ${service.VehicleRef} at ${currentTime()}`)
  })
  .catch((err) => {
    console.error('error inserting', err)
  })
}

insertOperatingServices = (APIresponse) => {
  for (service of APIresponse.Services) {
    if (service.VehicleRef) {
      upsertData(service)
    }
  }
}

queryService = (stationCode) => {
  return fetchData(stationCode)
  .then((APIresponse) => {
    insertOperatingServices(APIresponse)
  })
  .catch((err) => {
    console.error(`failed to fetch latest service at ${currentTime()}`, err)
  })
}

drainPool = () => {
  console.log(`draining at ${currentTime()}`)
  r.getPoolMaster().drain()
}

getNAENupdate = () => {
  queryService('NAEN')
  .catch((err) => {
    console.log(`failed to update NAEN data at ${currentTime()}`)
  })

  setTimeout(drainPool, 3000)
}

module.exports = {
  getNAENupdate
}