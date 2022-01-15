const fs = require('fs')
const BUCKET = 'slannproperties'
const PhotosLib = {
  getPropertyPhotos,
  deletePropertyPhoto,
  uploadPropertyPhoto
}

function getPropertyPhotos(req, next){
  req.app.s3.listObjects({ Bucket: BUCKET, Prefix: req.params.id }, (s3Err, data) => {
    if(s3Err){
      console.error(s3Err)
      next(s3Err)
    }
    if(data){
      let propertyPhotos = []
      data.Contents.forEach((bucketItem, i) => {
        if(bucketItem.Size > 0){
          propertyPhotos.push({url: `https://slannproperties.s3.us-east-2.amazonaws.com/${bucketItem.Key}`, key: bucketItem.Key})
        }
      })
      next(null, propertyPhotos)
    } else {
      next(null)
    }
  })
}

function deletePropertyPhoto(req, next){
  req.app.s3.deleteObject({ Bucket: BUCKET, Key: req.body.key }, (s3Err, data) => {
    if(s3Err){
      console.error(s3Err)
      next(s3Err)
    }
    if(data){
      next(null)
    } else {
      next(null)
    }
  })
}

function uploadPropertyPhoto(req, next){
  req.app.s3.upload({
    Bucket: BUCKET,
    Key: `${req.params.id}/${req.file.filename}`,
    Body: fs.createReadStream(req.file.path),
    ACL: 'public-read'
  }, (s3Err, data) => {
    if(s3Err){
      console.error(s3Err)
      next(s3Err)
    }
    else {
      next(null)
    }
  })
}

module.exports = PhotosLib