
const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const server = require('./mockServer');
const messageQueue = require('../js/messageQueue');

const httpHandler = require('../js/httpHandler');



describe('server responses', () => {

  it('should respond to a OPTIONS request', (done) => {
    let {req, res} = server.mock('/random', 'OPTIONS');

    httpHandler.router(req, res);
    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
    expect(res._data.toString()).to.be.empty;

    done();
  });

  it('should respond to a GET request for a swim command', (done) => {
     let {req, res} = server.mock('/random', 'GET');

     const commands = ['left','right','up','down'];
     let index = Math.floor(Math.random() * commands.length);
     messageQueue.enqueue(commands[index]);


     httpHandler.router(req, res);
     expect(res._responseCode).to.equal(200);
     expect(res._ended).to.equal(true);
     expect(commands).to.contain(res._data.toString());

    done();
  });

  it('should respond with 404 to a GET request for a missing background image', (done) => {
    httpHandler.backgroundImageFile = path.join('.', 'spec', 'missing.jpg');
    let {req, res} = server.mock('/background.jpg', 'GET');

    httpHandler.router(req, res, () => {
      expect(res._responseCode).to.equal(404);
      expect(res._ended).to.equal(true);
      done();
    });
  });

  xit('should respond with 200 to a GET request for a present background image', (done) => {
    httpHandler.backgroundImageFile = path.join('.', 'background.jpg');
    let {req, res} = server.mock('/backgroundjpg', 'GET');

    httpHandler.router(req, res, () => {
      expect(res._responseCode).to.equal(200);
      expect(res._ended).to.equal(true);
      done();
    });
    done();
  });

  var postTestFile = path.join('.', 'spec', 'water-lg.jpg');

  xit('should respond to a POST request to save a background image', (done) => {
    fs.readFile(postTestFile, (err, fileData) => {
      httpHandler.backgroundImageFile = path.join('.', 'spec', 'temp.jpg');
      let {req, res} = server.mock('/background.jpg', 'POST', fileData);

      httpHandler.router(req, res, () => {
        expect(res._responseCode).to.equal(201);
        expect(res._ended).to.equal(true);
        done();
      });
    });
  });

  xit('should send back the previously saved image', (done) => {
    fs.readFile(postTestFile, (err, fileData) => {
      httpHandler.backgroundImageFile = path.join('.', 'spec', 'temp.jpg');
      let post = server.mock('/background.jpg', 'POST', fileData);

      httpHandler.router(post.req, post.res, () => {
        let get = server.mock('/background.jpg', 'GET');

        httpHandler.router(get.req, get.res, () => {
          expect(Buffer.compare(fileData, get.res._data)).to.equal(0);
          done();
        });
      });
    });
  });
});