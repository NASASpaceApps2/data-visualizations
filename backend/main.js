import fs from 'fs';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function fetchNasaData() {
  const url = 'https://data.nasa.gov/data.json';
  //const key = process.env.NASA_API_KEY;
  const response = await fetch(url /*+ key*/);
  const data = await response.json();
  return data
}

async function main() {
  const data = await fetchNasaData();
  fs.writeFileSync('nasa.json', JSON.stringify(data, null, 2));
}
main()
