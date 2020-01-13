'use strict';

const http = require("http");
const url = require("url");
// const cache = require("../caching/cache.js");


let router = require('./authRouter.js');

const port = process.argv[2] || 4240;
const authLength = 10;//minutes


http.createServer((req, res) => {
  console.log(req.socket.remoteAddress);
  console.log(req.socket.remotePort);
  console.log(req.socket.remoteFamily);
  console.log('``````````````````````````````````````````````````````````````````````````````````````````````````````````````');
  // console.log(req.method);
  const uri = url.parse(req.url).path;
  console.log(uri);

  console.log(req.headers);
  if(req.headers.cookie) console.log(JSON.parse(req.headers.cookie));

  if(req.method === 'GET') {
    // console.log()
    if(req.headers.cookie && JSON.parse(req.headers.cookie).authorised && (new Date(JSON.parse(req.headers.cookie).expire) > new Date())) {
      router.route(req.socket.remoteAddress, uri, (result) => {
        // if(result === JSON.stringify('User successfully logged in')) {
        //   console.log('Adding cookie');
        //   res.writeHead(200, {'Set-Cookie': 'MYCOOKIe', 'Content-Type': 'text/plain'})
        // }
        res.write(result);//removed JSON.stringify
        res.end();
      });
      return;
    } else {
      router.route(req.socket.remoteAddress, '/login.html', (result) => {
        res.write(result);//removed JSON.stringify
        res.end();
      });
      // res.writeHead(302, {'Location': 'http://127.0.0.1:4240/login.html'});
      // res.end();
    }
  };
  if(req.method === 'POST') {
    console.log("POOOOOOOOOOOOOOST");
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    }).on('end', () => {
      console.log(data);
      router.route(data, uri, (result) => {
        console.log(result);
        if(result === 'User successfully logged in') {
          console.log('Adding cookie');
          const date = new Date();
          const cookie = {
            authorised: true,
            expire: new Date(date.setMinutes(date.getMinutes()+authLength))
          };
          // res.writeHead(200, {'Set-Cookie': cookie, 'Content-Type': 'text/plain'});
          res.setHeader('Content-Type', 'text/plain');
          res.setHeader('Set-Cookie', JSON.stringify(cookie));
          res.writeHead(302, {'Location': 'http://localhost:4241/bookingselect.html'});
          // res.writeHead(302, {'Location': 'http://booking:4241/bookingselect.html'});
          res.end();
        }
      });
      return;
    });

  };
}).listen(parseInt(port, 10));

console.log(__dirname);
console.log("Server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
