const path = require('path');
const fs = require('fs');

console.log('started...');

// ref lufthansa
const inputFiles = [
  path.join(__dirname, 'countries-100.json'),
  path.join(__dirname, 'countries-200.json'),
  path.join(__dirname, 'countries-300.json'),
];

let langCode = 'en';
const outputFile = path.join(__dirname, 'countries.json');

let outputArr = [];

inputFiles.forEach((inputFile) => {
  read_parse_write(inputFile, outputFile, langCode);
});

// write updated output array
console.log('writing output: ' + outputFile + '...');
fs.writeFileSync(outputFile, JSON.stringify(outputArr));
console.log('writing output: ' + outputFile + '... done');

console.log('end.');

function read_parse_write(inputFile, outputFile, langCode = 'en'){
  console.log('reading input: ' + inputFile + ' ...');

  // read a batch of raw country records
  let inputData = fs.readFileSync(inputFile);
  console.log('reading input: ' + inputFile + ' ... done');

  let inputJson = JSON.parse(inputData);
  let countries = inputJson.CountryResource.Countries.Country;

  console.log('  parsing countries ...');
  countries.forEach((country) => {
    let parsedCountry = parseCountry(country, langCode);
    outputArr.push(parsedCountry);// side effect
  });
  console.log('  parsing countries ... done');
}

function parseCountry(country, langCode = 'en'){
  return {
    code:      country.CountryCode,
    name:      findCountryName(country, langCode),
    zone_code: country.ZoneCode,
  };
}

function findCountryName(country, langCode = 'en'){
  let name = null;
  try {
    let names = country.Names.Name;
    if ((typeof names === 'object') && ('@LanguageCode' in names)) {
      name = names['$'];
    } else {// array
      country.Names.Name.forEach((row) => {
        if (row['@LanguageCode'] === langCode) {
          name = row['$'];
        }
      });
    }
  } catch (err) {
    console.log('err message: ', err);
    console.log('err country', country);
  }

  if (!name && langCode === 'en') {
    findCountryName(country, 'xx');// try another language code
  }

  return name;
}

