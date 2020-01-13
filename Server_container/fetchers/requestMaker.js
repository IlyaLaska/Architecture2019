'use strict';

let http = require('http');

let options = {
    // headers: req.headers,
    host: '127.0.0.1',
    port: null,
    method: 'GET',
    path: null,
    timeout: 30000,
};

let makeRequest = (port, path, callback) => {
  let data = '';

  options.port = port;
  options.path = path;
  let request = http.request(options, (response) => {
    // console.log(options);
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
        data += chunk;
    });

    response.on('close', () => {
      // console.table(JSON.parse(data));
      return callback(JSON.parse(data));
    })
  });

  request.on('error', e => {
    console.log('REQUEST ERROR:');
    console.log('\x1b[33mWARNING:\x1b[0m: ');
    console.log('\x1b[33mWARNING:\x1b[0m: ', e);
    // exit(e);
  });
  request.end();
}

const makeRequestwDelay = async(port, path, maxRetries, timeout, callback) =>  {
    while (true) {
      try { 
        console.log("buffer");
        const buffer = await fetchFile(port, path);
        callback(buffer);
        break;
      }
      catch(e) {
        maxRetries = maxRetries - 1;

        if (maxRetries <= 0) {
            console.log("Too many requests");
            callback([]);
            break;
        }

        console.warn(`No file at url:${path}, waiting ...`);
        await wait(timeout);
        console.log(`Continue.`);
      }
    }
}

const wait = async (timeout) => {
  timeout *= 1e3;
  console.log(timeout);
  return new Promise(resolve => {
      setTimeout(resolve, timeout);
  });
}

 const fetchFile = (port, path) => {
   return new Promise((res, rej) => {
    let data = '';
    options.port = port;
    options.path = path;
    let request = http.request(options, (response) => {
      console.log(response);
      console.log(options);
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
          data += chunk;
    });

    response.on('close', () => {
      // console.table(JSON.parse(data));
      res(JSON.parse(data));
    })
  });

  request.on('error', e => {
    console.log('\x1b[33mWARNING:\x1b[0m: ');
    console.log('\x1b[33mWARNING:\x1b[0m: ', e);
    rej(e);
    // exit(e);
  });
  request.end();
   })
    
      // let data = '';
      // http.get({
      //     encoding: 'utf8',
      //     path: path,
      //     port: port
      // }).on("data", (chunk) => {
      //     data += chunk;
      // }).on("response", (response) => {
      //     /**
      //      * Server always returns 200 OK even if file does not exist yet. Hence checking for content-lenth head
      //      */
      //     if (!(response.headers["content-length"] > 0)) {
      //         reject("Empty response!");
      //     }
      // }).on("end", () => {
      //     const body = Buffer.concat(data);
      //     if (body.length > 0) {
      //         resolve(body);
      //         return;
      //     }
      //     reject("Empty response");
      // });
  // });
}

// makeRequestwDelay(4243, "/getInventory", 3, 5, (res) => {console.log(res)});
// makeRequest({port:4242, path: ''})

module.exports = {
  makeRequest,
  makeRequestwDelay
}
