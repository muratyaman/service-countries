const express = require('express');
const app = express();

const path = require('path');
const publicPath = path.join(__dirname, 'public');

// serve JSON files
app.use(express.static(publicPath));

const countries = require('./public/en/countries.json');

function countriesByName(countries, name){
  const countriesFiltered = [];

  const nameUp = name.toUpperCase();
  countries.forEach((country) => {
    if (country.name.toUpperCase().includes(nameUp)) {
      countriesFiltered.push(country);
    }
  });

  return countriesFiltered;
}

function countriesByZone(countries, zoneCode){
  const countriesFiltered = [];

  const zoneCodeUp = zoneCode.toUpperCase();
  countries.forEach((country) => {
    if ('zone_code' in country && country.zone_code.toUpperCase() === zoneCodeUp) {
      countriesFiltered.push(country);
    }
  });

  return countriesFiltered;
}

app.get('/api/countries', function (req, res) {
  let { name, zone } = req.query;

  if (name && name !== '') {

    let countriesFiltered = countriesByName(countries, name);
    res.json({ data: countriesFiltered });

  } else if (zone && zone !== '') {

    let countriesFiltered = countriesByZone(countries, zone);
    res.json({ data: countriesFiltered });

  } else {
    res.json({ data: countries });
  }
});

app.get('/api/countries/:code', function (req, res) {
  const { code } = req.params;
  const country = countries.find((row) => {
    return row.code === code;
  });
  res.json({ data: country });
});

module.exports = app;
