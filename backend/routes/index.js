import express from 'express';
var router = express.Router();
import { Dataset } from '../models/list.js';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Hello world!' });
});

/* Search by property */
router.get('/search', function (req, res, next) {
  var query = req.query.query;
  var property = req.query.property || "title";
  var limit = req.query.limit || 100;
  var offset = req.query.offset || 0;

  // Find in text
  var queryObj = {};
  queryObj[property] = { $regex: query, $options: 'i' };

  console.log(query, property, limit, offset, queryObj);


  Dataset.find(queryObj).limit(limit).skip(offset).exec(function (err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      // Print number of datasets
      Dataset.count(queryObj, function (err, count) {
        if (err) {
          res.status(500).send(err);
        } else {
          // Delete _id and __v from data
          for (var i = 0; i < data.length; i++) {
            delete data[i]._id;
            delete data[i].__v;
          }

          res.json({
            data: data,
            total: count,
            query: query,
            property: property,
            limit: limit,
            offset: offset
          });
        }
      })
    }
  });


})


export default router;