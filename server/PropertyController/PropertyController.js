const express = require('express')
const router = express.Router()
const { ObjectId } = require('mongodb');
const { auth } = require('express-oauth2-jwt-bearer');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const PhotosLib = require('../PhotosController/PhotosLib');
const { resetWatchers } = require('nodemon/lib/monitor/watch');

var jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://andrewemery.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://tal-tiny-ween-api',
    issuer: 'https://andrewemery.us.auth0.com/',
    algorithms: ['RS256']
});

router.get('/all', getAllProperties)
router.get('/address/:id', getAddress)
router.post('/uploadProperty', jwtCheck, uploadProperty)
router.post('/editProperty/:id', jwtCheck, editProperty)
router.delete('/deleteProperty/:id', jwtCheck, deleteProperty)

function getAllProperties(req, res){
  const db = req.app.db.db

  db.collection('properties').find({}).toArray((dbErr, result) => {
    if(dbErr){
      console.error(dbErr)
      res.status(500).send(dbErr)
    }
    if(result){
      res.status(200).send(result)
    } else {
      res.status(200).send({});
    }
  })
}

function getAddress(req, res) {
  const db = req.app.db.db

  db.collection('properties').findOne({ _id: ObjectId(req.params.id) }, (dbErr, result) => {
    if(dbErr){
      console.error(dbErr)
      res.status(500).send(dbErr)
    }
    if(result){
      PhotosLib.getPropertyPhotos(req, (err, photos) => {
        if(err){
          res.status(500).send(err)
        }
        if(photos){
          res.status(200).send({...result, photos: [...photos]})
        } else {
          res.status(200).send({});
        }
      })
    } else {
      res.status(200).send({});
    }
  })
}

function uploadProperty(req, res){
  const db = req.app.db.db
  const property = req.body;

  if(!property) res.status(200).send()
  else{
    db.collection('properties').insertOne(property, (dbErr, result) => {
      if(dbErr){
        console.error(dbErr)
        res.status(500).send(dbErr)
      }
      if(result){
        res.status(200).send(result)
      } else {
        res.status(200).send({});
      }
    })
  }
}

function editProperty(req, res){
  const db = req.app.db.db
  const {
    title,
    address,
    city,
    state,
    price,
    bedrooms,
    bathrooms,
    sqft,
    description,
    available,
    map,
    distance,
    deposit
  } = req.body;

  if(!req.body) res.status(200).send()
  else{
    db.collection('properties').findOneAndUpdate(
      { _id: ObjectId(req.params.id) },
      { $set: {
          title,
          address,
          city,
          state,
          price,
          bedrooms,
          bathrooms,
          sqft,
          description,
          available,
          map,
          distance,
          deposit
        }
      }, (dbErr, result) => {
      if(dbErr){
        console.error(dbErr)
        res.status(500).send(dbErr)
      }
      if(result){
        res.status(200).send()
      } else {
        res.status(200).send();
      }
    })
  }
}

function deleteProperty(req, res){
  const db = req.app.db.db
  const id = req.params.id

  if(!id) res.status(500).send()
  else{
    PhotosLib.getPropertyPhotos(req, (err, photos) => {
      if(err){
        res.status(500).send(err)
      }
      if(photos){
        let promises = []
        for(let i = 0; i < photos.length; i++){
          req.body.key = photos[i].key
          promises.push(PhotosLib.deletePropertyPhoto(req, (err) => {
            if(err){
              res.status(500).send(err)
            }
          }))
        }
        Promise.all(promises).then((_, err) => {
          if(err){
            res.status(500).send(err)
          } else {
            db.collection('properties').deleteOne({
              _id: ObjectId(id)
            }, (dbErr, result) => {
              if(dbErr){
                console.error(dbErr)
                res.status(500).send(dbErr)
              }
              if(result){
                res.status(200).send()
              } else {
                res.status(200).send();
              }
            })
          }
        })
      } else {
        res.status(200).send();
      }
    })
  }
}

module.exports = router
