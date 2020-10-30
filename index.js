const express = require('express')
const app = express()
const cors = require('cors');
const thlRouter = require('./controllers/thl')
const gtrendsRouter = require('./controllers/gtrends')

app.use(cors())
app.use('/thl', thlRouter)
app.use('/gtrends', gtrendsRouter)

const PORT = 8000

console.log('Palvelin kæynnissä')

app.get('/', (req, res) => {
  console.log("pyyntö tullut");
  res.send('<h1>palvelin on käynnissä</h1>')
})


app.get('/google/', (req, res) => {
  // Otetaan osoitteen mukana tuleeet arvot muuttujiin
  // esim. localhost:8000/data?kunta=turku&hakusana=kissa
  const hakusana = req.query.hakusana
  res.send('<h1>Pyysit kuntaa: ' + hakusana + '!</h1>')
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})