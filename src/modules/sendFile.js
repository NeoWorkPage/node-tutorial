const fs = require('fs');

module.exports = (filePath, res, mimeType) => {
  const file = new fs.ReadStream(filePath);
  file
    .on('error', (err) => {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('File not found');
      }
    })
    .on('open', () => {
      res.setHeader('Content-Type', mimeType);
    })
    .pipe(res)
    .on('close', () => {
      file.destroy();
    });
};
