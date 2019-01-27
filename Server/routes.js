var appRouter = function (app) {


const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low(adapter)

const fs = require('fs')
const drawingsdirectory = './drawings';

  app.get("/", function (req, res){
    res.status(200).send({ message: 'Welcome to our restful API' });
  });
  
  app.post("/savedrawing", function(req,res){
    if(req.body.originalImage && req.body.drawingImage){
      db.get('drawings')
        .push({originalImage: req.body.originalImage, drawingImage: req.body.drawingImage})
        .write() 
      var current_timestamp = new Date().getTime();
      fs.mkdirSync(drawingsdirectory + '/' + current_timestamp)
      fs.writeFile(drawingsdirectory + '/' + current_timestamp + '/drawing.png', req.body.drawingImage, 'base64', function(err) {
        console.log(err);
      });
      fs.writeFile(drawingsdirectory + '/' + current_timestamp + '/image.jpg', req.body.originalImage, 'base64', function(err) {
        console.log(err);
      });
    }

    res.status(200).send({ message: 'Drawing saved.', body: req.body });
  });
  
}

module.exports = appRouter;