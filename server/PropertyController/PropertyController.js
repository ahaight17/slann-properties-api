const express = require('express')
const router = express.Router()
const { auth } = require('express-oauth2-jwt-bearer');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

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
router.get('/address/:address', getAddress)
router.post('/uploadProperty', jwtCheck, uploadProperty)

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
  const address = req.params.address.replace(/[-]/g, ' ')

  db.collection('properties').findOne({ address: address }, (dbErr, result) => {
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
        res.status(200).send()
      } else {
        res.status(200).send();
      }
    })
  }

}

module.exports = router
