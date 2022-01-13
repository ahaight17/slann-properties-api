const mongoClient = require('mongodb').MongoClient

function connect(mongoUrl, db){
  return mongoClient.connect(mongoUrl, { useNewUrlParser: true }).then((client) => client.db(db));
}

module.exports = async function(){
  let databases = await Promise.all([connect(process.env.MONGOURL, process.env.MONGODB)])

  return {
    db: databases[0]
  }
}