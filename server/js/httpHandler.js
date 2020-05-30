const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messageQueue = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////
///


//const messageQueue = require('./messageQueue');
// module.exports.initialize = (queue) => {
//   messageQueue = queue;

// }


module.exports.router = (req, res, next = ()=>{}) => {
  //create conditionals for values passed in within req object
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  // //========Sending a random message===============
  // var options = ['left', 'right', 'up', 'down']
  // var randomRes = options[Math.floor(Math.random() * options.length)]

  if (req.url === '/random' &&req.method === 'GET') {
    var nextMessage = messageQueue.dequeue()
    res.writeHead(200, headers);
    res.end(nextMessage);
    next();
  } else if (req.url === '/background.jpg' && req.method === 'GET') {
    fs.readFile(module.exports.backgroundImageFile, (err, fileData) => {
      if( err) {
        res.writeHead(404);
      } else {
        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Content-Length': fileData.length
        });
        res.write(fileData, 'binary');
      }
      res.end()
      next();
    })
  }
  if (req.method === 'POST' && req.url === '/background.jpg') {
    var imageData = Buffer.alloc(0);
    req.on('data',(chunk)=>{
      imageData= Buffer.concat([imageData,chunk]);
    });

    req.on('end', ()=>{
      var file = multipart.getFile(imageData);
      fs.writeFile(module.exports.backgroundImageFile,file.data, (err)=>{
        res.writeHead(err ? 400 : 201, headers);
        res.end()
        res.next();
      })
    })
  }
};
