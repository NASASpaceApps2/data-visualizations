# NASA Data Visualizations

Add info about the project here

## Backend API

### Run locally
1. Clone this repository
2. Create .env and add `MONGO_URI=<MongoDB URI>`
3. Run `npm i;npm run init` to initialize database
4. Restart API with `npm run start`

### Deploying to heroku
1. Clone this repository
2. Add `MONGO_URI` as an environment variable
3. Run `npm run deploy` to start API

### API Routes
`/publishers` - List of data set publishers<br>
`/search` - Search database for term
```
QUERY PARAMETERS
  (required) ?query=term - Regex search for term
  (optional) ?property=title - Search by property name specified in data.gov metadata schema https://resources.data.gov/resources/dcat-us/
  (optional) ?limit=100 - Number of results returned
  (optional) ?offset=0 - Pagination tool for search results, offset number of entries

RETURN
  {
    data: [{
      title: String,
      description: String,
      theme: [String],
      keyword: [String],
      modified: Date,
      bureauCode: [String],
      programCode: [String],
      accessLevel: String,
      landingPage: String,
      issued: Date,
      publisher: String,
    }]
    query: String,
    property: String,
    offset: Number,
    limit: Number,
    total: Number // Number of total entries
  }

EXAMPLE
https://nasadata.herokuapp.com/search?query=apollo%20program&property=description&limit=3
```

## Frontend website

GitHub pages: https://nasaspaceapps2.github.io/data-visualizations/frontend/index.html<br>
Replit: https://nasa-hackathon.martinmt0207.repl.co<br>
