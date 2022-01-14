const express = require('express')
const router = express.Router()
const PhotosLib = require('./PhotosLib')
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

router.get('/all/:id', getPhotosForProperty)
router.delete('/deletePhoto', deletePhoto)

function getPhotosForProperty(req, res){
  PhotosLib.getPropertyPhotos(req, (err, photos) => {
    if(err){
      res.status(500).send(err)
    } 
    if(photos){
      res.status(200).send(photos)
    } else {
      res.status(200).send();
    }
  })
}

function deletePhoto(req, res){
  PhotosLib.deletePropertyPhoto(req, (err) => {
    if(err){
      res.status(500).send(err)
    } else {
      res.status(200).send();
    }
  })
}

module.exports = router
