import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to server
mongoose.connect(process.env.MONGO_URI);

// Define new mongoose schema to hold comments
const datasetSchema = new mongoose.Schema({
  title: String,
  description: String,
  theme: [String], // original: theme
  keyword: [String], // original: keyword
  modified: Date,///
  bureauCode: [String],
  programCode: [String],
  accessLevel: String,
  landingPage: String,
  issued: Date, // original: issued
  publisher: String,

})

const Dataset = mongoose.model('Dataset', datasetSchema);

export { Dataset };
