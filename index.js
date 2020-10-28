const express = require('express')
const app = express()
console.log('hello world')

const PORT = 8000

app.get('/', (req, res) => {
  res.send('<h1>palvelin on käynnissä</h1>')

})

app.get('/data/', (req, res) => {
  // Otetaan osoitteen mukana tuleeet arvot muuttujiin
  // esim. localhost:8000/data?kunta=turku&hakusana=kissa
  const kunta = req.query.kunta
  const hakusana = req.query.hakusana
  res.send('<h1>Pyysit kuntaa: ' + kunta + ' ' + hakusana + '!</h1>')

})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})