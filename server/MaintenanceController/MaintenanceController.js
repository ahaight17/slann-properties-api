const express = require('express')
const router = express.Router()
const { ObjectId } = require('mongodb');
const { auth } = require('express-oauth2-jwt-bearer');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const PhotosLib = require('../PhotosController/PhotosLib');

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

router.get('/sendEmail', sendEmail)

function sendEmail(req, res){

  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: 'andrewbemery@gmail.com', // Change to your recipient
    from: 'andrewbemery@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = router
