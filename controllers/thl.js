const { response } = require('express')
const thlRouter = require('express').Router()

// thl.js sisältää toiminnallisuuden THL:n dataan liittyviin pyyntöihin.

// Mikä tulee olemaan datan muoto jota frontille tarjotaan?
const testidata = {
  'helsinki': {
    'nimi': 'Helsinki',
    'id': '123456'
  },
  'jyvaskyla': {
    'nimi': 'Jyväskylä',
    'id': '222222'
  }
}


thlRouter.get('/', async (req, res) => {
  res.json(testidata)
})

module.exports = thlRouter