import dotenv from 'dotenv'
import fs from 'fs'
import { Dataset } from '../models/list.js'
dotenv.config()

async function uploadToMongo() {
  console.log('Uploading to MongoDB...');
  
  let nasaData = JSON.parse(fs.readFileSync('../data/nasa.json', 'utf8'))
  let formattedData = nasaData.dataset.map(item => {
    return {
      title: item.title,
      description: item.description,
      theme: item.theme, // original: theme
      keyword: item.keyword, // original: keyword
      modified: item.modified,///
      bureauCode: item.bureauCode,
      programCode: item.programCode,
      accessLevel: item.accessLevel,
      landingPage: item.landingPage,
      issued: item.issued, // original: issued
      publisher: item?.publisher?.name,
    }
  })
  console.log(formattedData. length);
  await Dataset.deleteMany({})
  await Dataset.insertMany(formattedData)
  console.log('Uploaded to MongoDB.');
}

uploadToMongo()