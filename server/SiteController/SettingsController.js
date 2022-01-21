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

router.get('/getSettings', getSettings)
router.post('/setWaitingList', jwtCheck, setWaitingList)

function getSettings(req, res){
  const db = req.app.db.db

  db.collection('settings').findOne({ type: "sp-master" }, (dbErr, result) => {
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

function setWaitingList(req, res){
  const db = req.app.db.db
  const {
    waitingList
  } = req.body;

  if(!req.body) res.status(200).send()
  else{
    db.collection('settings').findOneAndUpdate(
      { type: 'sp-master' },
      { $set: { waitingList }
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

module.exports = router
