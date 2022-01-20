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

router.post('/sendFormEmail', sendFormEmail)

/**
 * @param {string} req.body.name
 * @param {string} req.body.number
 * @param {string} req.body.email
 * @param {string} req.body.property
 * @param {string} req.body.description
 * @param {'maintenance' || 'waiting-list'} req.body.request
 */
function sendFormEmail(req, res){
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

  const subject = req.body.request === 'maintenance' ? `MAINTANENCE REQUEST - ${req.body.property}` : `WAITING LIST REQUEST - ${req.body.property}`

  const msg0 = {
    to: req.body.email, // Change to your recipient
    from: 'andrewbemery@gmail.com', // Change to your verified sender
    subject: subject,
    html: `<strong><div>Name:\t${req.body.name}</div><div>Email Address:\t${req.body.email}</div><div>Phone Number:\t${req.body.number}</div><div>Property:\t${req.body.property}</div><div>...</div><div>..</div><div>.</div><div>${req.body.description}</div></strong>`,
    attachments: attachments
  }
  const msg1 = {
      to: "slanntal@gmail.com", // Change to your recipient
      from: 'andrewbemery@gmail.com', // Change to your verified sender
      subject: subject,
      html: `<strong><div>Name:\t${req.body.name}</div><div>Email Address:\t${req.body.email}</div><div>Phone Number:\t${req.body.number}</div><div>Property:\t${req.body.property}</div><div>...</div><div>..</div><div>.</div><div>${req.body.description}</div></strong>`,
      attachments: attachments
  }

  let toTal = sg.send(msg0);
  let toTenant = sg.send(msg1);

  Promise.all([toTal, toTenant]).then((result)=> {
    res.status(200).send()
  }).catch((error) => {
    console.error(error)
    res.status(500).send(error)
  })
}

module.exports = router
