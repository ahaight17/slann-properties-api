const express = require('express')

var port = process.env.PORT || 8000;
var app = express();

app.listen(port, () => {
  console.log('Started listening on port: ', port);
})

const api = require('./api')(app);
