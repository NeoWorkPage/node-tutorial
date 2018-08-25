const fs = require('fs');

module.exports = (filePath, req, res) => {
  const file = fs.createWriteStream(filePath, { flags: 'wx' });
  const maxSize = 1024 * 1024;
  let size = 0;

  file
    .on('error', (err) => {
      if (err.code === 'EEXIST') {
        res.statusCode = 409;
        res.end('file already exists');
      } else {
        if (!res.headersSent) {
          res.writeHead(500, { Connection: 'close' });
          res.write('Internal Error');
          fs.unlick(filePath, () => {
            res.end();
          });
        }
        fs.unlink(filePath, () => {
          res.end();
        });
      }
    })
    .on('close', () => {
      res.statusCode = 200;
      res.end('OK');
    });

  req
    .on('data', (data) => {
      size += data.length;
      if (size > maxSize) {
        res.statusCode = 413;
        res.setHeader('Connection', 'close');
        res.end('Payload Too Large');
        file.destroy();
        fs.unlink(filePath, (err) => {
          console.error(err);
        });
      }
    })
    .pipe(file);

  req.on('close', () => {
    file.destroy();
  });
};
