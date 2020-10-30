const express = require('express')
const app = express()
const cors = require('cors');
const googleTrends = require('google-trends-api');
const thlRouter = require('./controllers/thl')

app.use(cors())


app.use('/thl', thlRouter)

console.log('hello world')

const PORT = 8000

app.get('/', (req, res) => {
  console.log("pyyntö tullut");
  res.send('<h1>palvelin on käynnissä</h1>')

})

app.get('/gtrends/', (req, res) => {
  // Otetaan osoitteen mukana tuleeet arvot muuttujiin
  // esim. localhost:8000/gtrends?kunta=turku&hakusana=kissa
  const kunta = req.query.kunta
  const hakusana = req.query.hakusana

  console.log(hakusana);
  googleTrends.interestByRegion
    ({
      keyword: hakusana,
      trendDate: new Date(Date.now()- (14*24*60*60*1000)),
      //startTime: new Date('2020-08-08'),
      //endTime: new Date('2020-10-25'),
      geo: 'FI',
      resolution: 'city'
    })
    .then(function (res) {
      var receivedData = res.toString()
      receivedData = JSON.parse(receivedData)
      console.log(receivedData);
    })
    .catch((err) => {
      console.log(err);
    });
  res.send('<h1>Pyysit kuntaa: ' + kunta + ' ' + hakusana + '!</h1>')
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