const express = require('express')
const router = express.Router()

router.get('/:address', getAddress)

function getAddress(req, res) {
	console.log(req.app)
  const db = req.app.db.db
  const address = req.params.address.replace(/[-]/g, ' ')
  console.log(address)

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
