/* eslint-disable import/no-unresolved */
const url = require('url');
const { Server } = require('http');


const sendFile = require('modules/sendFile');
const postFile = require('modules/postFile');
const deleteFile = require('modules/deleteFile');

const FILES_DIR = `${__dirname}/files`;
const PUBLIC_DIR = `${__dirname}/public`;


new Server((req, res) => {
  const pathname = decodeURI(url.parse(req.url).pathname);
  const filePath = FILES_DIR + pathname;
  switch (req.method) {
    case ('GET'):
      if (pathname === '/') {
        sendFile(`${PUBLIC_DIR}/index.html`, res, 'text/html');
      }
      break;
    case ('POST'):
      postFile(filePath, req, res);
      break;
    case ('DELETE'):
      deleteFile(filePath, res);
      break;
    default:
      res.statusCode = 502;
      res.end('Not implemented');
      break;
  }
}).listen(3000);
