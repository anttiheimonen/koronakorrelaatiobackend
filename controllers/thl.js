const thlRouter = require('express').Router()
const JSONstat = require("jsonstat-toolkit");
const thlData = require('./../testdata.json'); // Lokaali THL-tiedosto testausta varten
const thlDataArrobj = require('./../test_arrobj.json'); // Lokaali THL-tiedosto testausta varten
const kuntakoodit = require('./../utility/luettelo.json')

var _ = require('lodash')

const kunnatViikottain = "https://sampo.thl.fi/pivot/prod/fi/epirapo/covid19case/fact_epirapo_covid19case.json?row=dateweek2020010120201231-443686&row=hcdmunicipality2020-445171L&column=measure-444833"
const shptViikottain = "https://sampo.thl.fi/pivot/prod/fi/epirapo/covid19case/fact_epirapo_covid19case.json"


// thl.js sisältää toiminnallisuuden THL:n dataan liittyviin pyyntöihin.

thlRouter.get('/', async (req, res) => {
  res.json(thlData)
})


// Hakee THL:n datan ja muokkaa sen helpommin käsiteltäväksi objektiksi
thlRouter.get('/testi', async (req, res) => {
  JSONstat(kunnatViikottain).then(function (j) {
    if (j.length) {
      let ds1 = j.Dataset(0);
      // let dimhcd = ds1.Dimension("hcdmunicipality2020");
      let rows = ds1.toTable({
        type: "arrobj",
        by: "hcdmunicipality2020",
        bylabel: true,
        field: "label"
      });
      // res.json(thlData)
      console.log(rows[2]);
      res.json(rows)
    }
  })
})


// Muuntaa THL:n tarjoman datan viikkottaiset määrät
// meidän haluamaan muotoon.
// Esim Viikon 43 määrä Helsingistä löytyy finaldata["2020"]["43"]["Helsinki"]
// TODO: Lopulliseen dataan muutettava kuntien nimet kuntien tunnistekoodeiksi
thlRouter.get('/lokaalitesti', async (req, res) => {
  console.log("Lokaali testidata")

  // Ottaa testidatasta kopion, jottei alkuperäistä käsitellä useaan kertaan
  let testiDataArrobj = _.cloneDeep(thlDataArrobj)
  console.log(`Datan koko: ${testiDataArrobj.length}`)

  // Käsiteltävä data on lista, jossa jokainen viikko on omana objektinaan.
  // Jokainen viikko-objekti sisältää tiedon viikosta, turhan measure-kentän
  // ja kuntien tapausmäärät.
  // Esimerkki:
  // [
  //   {
  //     "dateweek2020010120201231":"Vuosi 2020 Viikko 01",
  //     "measure":"Tapausten lukumäärä",
  //     "Brändö":null,
  //     "Eckerö":1,
  //     ...
  //     "Vihti":null
  //   },
  //     ...
  //   {
  //     "dateweek2020010120201231":"Vuosi 2020 Viikko 35",
  //     "measure":"Tapausten lukumäärä",
  //     "Brändö":7,
  //     "Eckerö":6,
  //     ...
  //     "Vihti":null
  //   },
  //   ...
  // ]

  // Reduce käy jokaisen viikko-objektin läpi ja lisää datan
  // meidän haluamassa muodossa finaldata objektiin.
  let finaldata = testiDataArrobj.reduce(muunnaDataArrobj, {})
  // console.log(kuntakoodit.Alajarvi.koodi);

  // Palautetaan pyytäjälle data JSON-muodossa
  res.json(finaldata)
})


// Osa THL-datan muutonprosessia
const muunnaDataArrobj = (edelliset, viikkodata) => {
  // Otetaan aikakentästä vuosi ja kuukausi erikseen
  let aikaKentanSanat = viikkodata.dateweek2020010120201231.split(' ')
  let vuosi = aikaKentanSanat[1]
  let viikko = aikaKentanSanat[3]

  // Datassa on myös objekti, jossa on tapauksien kumulatiiviset määrät.
  // Jätetään se pois.
  if (vuosi === undefined)
    return edelliset;

  // Tuhotaan dateweek2020010120201231 ja measure-kentät.
  // Muuten niitä kohdellaan samoin kuin kuntia.
  delete viikkodata.dateweek2020010120201231
  delete viikkodata.measure

  let jsonViikko = {
    [vuosi]: {
      [viikko]: viikkodata
    }
  }

  // THL:n datassa 0 arvot on merkattu ". .". Korvataan nämä nollilla
  Object.keys(viikkodata).forEach(key => {
    if (kuntakoodit[key]) {
      viikkodata[kuntakoodit[key].koodi] =
        viikkodata[key] = isNaN(viikkodata[key]) ? 0 : viikkodata[key];
      delete viikkodata[key];
    }
    else
      console.log(`Kunta ${key} ei löydy kuntalistasta!`);
  });

  // Yhistetään luotu viikkodata aikaisempiin
  return _.merge(edelliset, jsonViikko)
}


/*
VANHA. Ei ehkä enää käyttöä

//  Data on muotoa:
//   [
//     "Vuosi 2020 Viikko 42",
//     "Jyväskylä",
//     "Tapausten lukumäärä",
//     "65"
//   ]

const muunnaData = data => {
  let aikaKentanSanat = data[0].split(' ')
  let vuosi = aikaKentanSanat[1]
  let viikko = aikaKentanSanat[3]
  let kaupunki = data[1]
  // data[3] sisältää tapausten määrän, jos se ei ole numero, niin asetetaan 0
  let tapaustenLkm = isNaN(data[3]) ? 0 : data[3]
  console.log(vuosi);
  console.log(viikko);
  console.log(kaupunki);
  console.log(tapaustenLkm);

  let rivi = {
    [vuosi]: {
      [viikko]: {
        [kaupunki]: [tapaustenLkm]
      }
    }
  }
  // rivi[vuosi][kuukausi][kaupunki] = tapaustenLkm
  console.log(rivi);
  return rivi
}
*/


module.exports = thlRouter