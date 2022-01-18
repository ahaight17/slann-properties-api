const express = require('express')
const fs = require('fs')
const https = require('https')
const http = require('http')

var port = process.env.PORT || 8000;
var app = express();


const httpsServer = https.createServer({
 key: fs.readFileSync('./slannprivate.key'),
 cert: fs.readFileSync('./slanncertificate.pem')
}, app)

httpsServer.listen(port, () => {
  console.log('Started listening on port: ', port);
})

/**
const httpServer = http.createServer(app)

httpServer.listen(port, () => {
   console.log('Started listening on port: ', port);
})
**/

const api = require('./api')(app);
