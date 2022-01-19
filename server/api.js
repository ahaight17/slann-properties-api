module.exports = (app) => {

  const databaseConnection = require('./utils/databaseConnection')
  const PropertyController = require('./PropertyController/PropertyController')
  const PhotosController = require('./PhotosController/PhotosController')
  const MaintenanceController = require('./MaintenanceController/MaintenanceController')
  const bodyParser = require('body-parser')
  const AWS = require('aws-sdk')
  const sgMail = require('@sendgrid/mail')

  AWS.config.update(
    { region: 'us-east-2' }
  )
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  app.s3 = new AWS.S3({apiVersion: '2006-03-01'});
  app.sg = sgMail

  databaseConnection().then((db) => {
    app.db = db;
  })

  const CORS = (req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token, x-room-id')
    next()
  }

  app.get('/', CORS, index)
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use('/property', CORS, PropertyController)
  app.use('/photos', CORS, PhotosController)
  app.use('/maintenance', CORS, MaintenanceController)

  function index(req, res){
    res.status(200).send(
      `<p style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; margin: 0">
           SLANNPROPERTIES.COM API
           <br>VERSION: v0.0.1
           <br>DATE: ${new Date().toLocaleDateString()}
       </p>`
    )
  }

  return {}
}
