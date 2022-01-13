const express = require('express')
const router = express.Router()

router.get('/all', getAllProperties)
router.get('/address/:address', getAddress)

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

module.exports = router
