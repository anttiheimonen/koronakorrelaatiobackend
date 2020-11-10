const { response } = require('express');
const googleTrends = require('google-trends-api');
const gtrendsRouter = require('express').Router();
const kuntakoodit = require('./../utility/luettelo.json');


/* interestOverTime kertoo millä alueella hakusana on kaikkein haetuin
  (eli suurin prosentuaalinen osuus aluuen kaikista hakusanoista).
  Tämän kunnan arvo on 100.
  Muiden kuntien tulokset ovat suhteellisia tähän numeroon.
  Esim. Toisessa kunnassa arvo 50 tarkoittaisi, että hakua on tehty 
  prosentuaalisesti puolet vähemmän.
  
  Haun voi tehdä halutulle ajan jaksolla, mutta tästä ei näe 
  kehitystä ajan kansa.
*/

//Tää on se edellinen versio koodista!
/*
gtrendsRouter.get('/interestOverTime', async (req, res) => {
  // Otetaan osoitteen mukana tuleeet arvot muuttujiin
  // http://localhost:8000/gtrends/interestOverTime?hakusana=korona
  const kunta = req.query.kunta
  const hakusana = req.query.hakusana

  console.log(hakusana);
  googleTrends.interestByRegion
    ({
      keyword: hakusana,
      //trendDate: new Date(Date.now() - (14 * 24 * 60 * 60 * 1000)),
      startTime: new Date('2020-08-08'),
      endTime: new Date('2020-10-25'),
      geo: 'FI',
      resolution: 'city'
    })
    .then(function (googleRes) {
      var receivedData = googleRes.toString()
      receivedData = JSON.parse(receivedData)
      console.log(receivedData)
      res.json(receivedData)
    })
    .catch((err) => {
      console.log(err)
    });
  // res.send('<h1>Pyysit kuntaa: ' + kunta + ' ' + hakusana + '!</h1>')
})
*/

//Tämä kokeilu ainakin jotenkin tulostaa vain sen kaupungin ja valuen arvon.
//Ei vielä yhdisty kunnat ja koodit luettelo.json tiedostosta
gtrendsRouter.get('/', async (req, res) => {
  // Otetaan osoitteen mukana tuleeet arvot muuttujiin
  // http://localhost:8000/gtrends/interestOverTime?hakusana=korona
  const kunta = req.query.kunta
  const hakusana = req.query.hakusana

  console.log(hakusana);
  googleTrends.interestByRegion
    ({
      keyword: hakusana,
      //trendDate: new Date(Date.now() - (14 * 24 * 60 * 60 * 1000)),
      startTime: new Date('2019-10-25'),
      endTime: new Date(Date.now()),
      geo: 'FI',
      resolution: 'city'
    })
    .then(function (googleRes) {
      var receivedData = googleRes.toString()
      receivedData = JSON.parse(receivedData)
        let valmisData = [];
        var i;
        for(i = 0; i < receivedData.default.geoMapData.length; i++) {
          var geoName = receivedData.default.geoMapData[i].geoName;
          var value = receivedData.default.geoMapData[i].value;
          valmisData += [geoName + " : " + value + ", "].join(",");
        }
       console.log(valmisData)
       res.json(valmisData)
    })
    .catch((err) => {
      console.log(err)
    });
  // res.send('<h1>Pyysit kuntaa: ' + kunta + ' ' + hakusana + '!</h1>')
})


/* gtrendsRouter.get('/', async (req, res) => {
  // Otetaan osoitteen mukana tuleeet arvot muuttujiin
  // esim. localhost:8000/gtrends?kunta=turku&hakusana=kissa
  const kunta = req.query.kunta
  const hakusana = req.query.hakusana

  console.log(hakusana);
  googleTrends.interestOverTime
    ({
      keyword: hakusana,
      startTime: new Date(Date.now() - (14 * 24 * 60 * 60 * 1000)),
      //startTime: new Date('2020-08-08'),
      //endTime: new Date('2020-10-25'),
      geo: 'FI'
    })
    .then(function (googleRes) {
      var receivedData = googleRes.toString()
      receivedData = JSON.parse(receivedData)
      console.log(receivedData)
      res.json(receivedData)
    })
    .catch((err) => {
      console.log(err)
    });
  // res.send('<h1>Pyysit kuntaa: ' + kunta + ' ' + hakusana + '!</h1>')
})
*/

module.exports = gtrendsRouter