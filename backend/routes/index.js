import express from 'express';
var router = express.Router();
import { Dataset } from '../models/list.js';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello world!' });
});

/* Search by property */
router.get('/search', function(req, res, next) {
  var queries = req.query;
  var properties = Object.keys(queries);
  var limit = req.query.limit || 100;
  var offset = req.query.offset || 0;

  // Find in text
  var queryObj = {};
  for (properties of properties) {
    queryObj[property] = { $regex: query, $options: 'i' };
  }

  console.log(query, property, limit, offset, queryObj);
  

  Dataset.find(queryObj).limit(limit).skip(offset).exec(function(err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      // Get total count
      Dataset.count(queryObj, function(err, count) {
        if (err) {
          res.status(500).send(err);
        } else {
          // Remove _id and __v
          data.forEach(function(item) {
            delete item._id;
            delete item.__v;
          });
          res.json({
            data: data,
            total: count,
            query: query,
            property: property,
            limit: limit,
            offset: offset
          });
        }
      });
    }
  });

})

// Get set of all properties (e.g. publishers)
router.get('/publishers', function(req, res, next) {
  let limit = req.query.limit || 100;
  let offset = req.query.offset || 0;

  Dataset.distinct("publisher", function(err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(data);
    }
  });
});

// Get all themes (themes is a list of strings)




export default router;