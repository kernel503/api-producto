const axios = require('axios')

const instance = axios.create({
  baseURL: 'https://tienda-virtual-ric.herokuapp.com/api',
  timeout: 8000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
})

export default instance

