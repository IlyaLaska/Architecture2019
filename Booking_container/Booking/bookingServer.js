'use strict';

const http = require("http");
const url = require("url");
// const cache = require("../caching/cache.js");


let router = require('./bookingRouter.js');

const port = process.argv[2] || 4241;


http.createServer((req, res) => {
  console.log(req.socket.remoteAddress);
  console.log(req.socket.remotePort);
  console.log(req.socket.remoteFamily);
  console.log('``````````````````````````````````````````````````````````````````````````````````````````````````````````````');
  // console.log(req);
  const uri = url.parse(req.url).path;
  console.log(uri);

  console.log(req.headers);
  if(req.headers.cookie) console.log(JSON.parse(req.headers.cookie));


  if(req.method === 'GET') {
    console.log('GET method');

    if(req.headers.cookie && JSON.parse(req.headers.cookie).authorised && (new Date(JSON.parse(req.headers.cookie).expire) > new Date())) {
      console.log('Cookie');

      router.route(req.socket.remoteAddress, uri, (result) => {
        console.log("IN BOOKING SERVER GETTING RES");
        console.log(result);
        res.write(result);//removed JSON.stringify
        res.end();
      });
      return;
    } else {
      console.log('NO Cookie');
      res.writeHead(302, {'Location': 'http://localhost:4240/login.html'});
      // res.writeHead(302, {'Location': 'http://auth:4240/login.html'});
      res.end();
    }
  }
  if(req.method === 'POST') {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    }).on('end', () => {
      console.log(data);
      // if(uri === '/book') {
      //   cli.book(data, (result) => {
      //       res.write(result);
      //       res.end();
      //   });
      // }
      router.route(data, uri, (result) => {
        //TODO////////////////////////////////WRITE REDIRECT TO HOMEPAGE HERE
        console.log("IN BOOKING SERVER GETTING RES POOOOOST");
        console.log(result);
        res.write(result);//removed JSON.stringify
        res.end();
      });
      // return;
    });

  }
}).listen(parseInt(port, 10));

console.log(__dirname);
console.log("Server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
