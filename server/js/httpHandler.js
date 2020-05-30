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
    res.end(nextMessage)
  }
  if (req.url === '/background' && req.method === 'GET') {
    //res write or res end with the contents of the background jpg file
    // if ( !(backgroundImageFile) ) {
    //   res.writeHead(404, headers)
    // }
  }


  res.end();
  next(); // invoke next() at the end of a request to help with testing!
};
