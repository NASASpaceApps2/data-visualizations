import fs from 'fs'
import fetch from 'node-fetch'

// console.log('Downloading from NASA...');
// fetch('https://data.nasa.gov/data.json')
// .then(response => response.text())
// .then(text => {
//   fs.writeFileSync('download.json', text);
// })

let text = fs.readFileSync('download.json');
let data = JSON.parse(text);
fs.writeFileSync('../../data/nasa.json', JSON.stringify(data, null, 2));