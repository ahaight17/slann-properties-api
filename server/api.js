module.exports = (app) => {

  const databaseConnection = require('./utils/databaseConnection')
  const PropertyController = require('./PropertyController/PropertyController')

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
  app.use('/property', CORS, PropertyController)

  function index(req, res){
    res.status(200).send(
      `<p style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; margin: 0">
           A.H. API 
           <br>VERSION: v0.0.1         
           <br>DATE: ${new Date().toLocaleDateString()} 
       </p>`
    )
  }

  return {}
}