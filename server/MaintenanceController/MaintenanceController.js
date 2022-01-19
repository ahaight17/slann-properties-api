const express = require('express')
const router = express.Router()
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

router.post('/sendEmail', sendEmail)

function sendEmail(req, res){
  const sg = req.app.sg
  let attachments = []
  if(req.body.images){
    req.body.images.forEach((img) => {
      attachments.push({
        filename: img.fileName,
        type: 'image/*',
        content: img.fileData,
        content_id: img.fileName
      })
    })
  }
  /**
   * req.body will be an object as follows: 
   * {
      name: string,
      number: string,
      email: string,
      property: string,
      description: string,
      request: 'maintenance' || 'waiting-list'
    }

    I think we can reuse this route for waiting list requests as well
    and just check the request parameter
   */

  const msg = {
    to: 'alex.haight@gmail.com', // Change to your recipient
    from: 'andrewbemery@gmail.com', // Change to your verified sender
    subject: req.body.request === 'maintenance' ? `MAINTANENCE REQUEST - ${req.body.property}` : `WAITIN LIST REQUEST - ${req.body.property}`,
    html: `<strong>${req.body.description}</strong>`,
    attachments: attachments
  }
  sg.send(msg).then((result) => {
    console.log(result)
    res.status(200).send()
  }).catch((error) => {
    console.error(error)
    res.status(500).send(error)
  })
}

module.exports = router
