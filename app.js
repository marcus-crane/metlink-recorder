const h = require('./helpers')

h.fetchService('NAEN')
.then((APIresponse) => {
  insertOperatingServices(APIresponse)
})
.catch((err) => {
  console.error('failed to fetch latest service', err)
})