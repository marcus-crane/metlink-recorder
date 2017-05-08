const h = require('./helpers')

h.fetchService('NAEN')
.then((data) => {
  let nextTrain = data.Services[0]
  h.insertData(nextTrain)
})
.catch((err) => {
  console.error('failed to fetch latest service', err)
})

// h.fetchService('NAEN')
// .then((data) => {
//   let nextTrain = data.Services[0]
//   r.table('services').filter(r.row('intendedArrival').match('2017-04-07T23:21:00+12:00'))
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((err) => { console.error(err) })
// })