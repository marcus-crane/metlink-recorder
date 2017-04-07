const r = require('rethinkdbdash')({ db: 'metlink' })
const h = require('./helpers')

// h.fetchService('NAEN')
// .then((data) => {
//   let nextTrain = data.Services[0]
//   r.table('services').insert({
//     'id': r.uuid(),
//     'trainID': nextTrain.VehicleRef,
//     'origin': nextTrain.OriginStopID,
//     'destination': nextTrain.DestinationStopID,
//     'intendedArrival': nextTrain.AimedArrival,
//     'intendedDeparture': nextTrain.AimedDeparture,
//     'expectedDeparture': nextTrain.ExpectedDeparture,
//     'status': nextTrain.DepartureStatus,
//     'createdAt': r.now()
//   })
//   .then((res) => {
//     console.log('Inserted service into DB')
//   })
//   .catch((err) => {
//     console.log(err)
//   })
// })

h.fetchService('NAEN')
.then((data) => {
  let nextTrain = data.Services[0]
  r.table('services').filter(r.row('intendedArrival').match('2017-04-07T23:21:00+12:00'))
  .then((res) => {
    console.log(res)
  })
  .catch((err) => { console.error(err) })
})