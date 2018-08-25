const fs = require('fs');

module.exports = (filePath, res) => {
  fs.unlink(filePath, (err) => {
    if (err && err.code === 'ENOENT') {
      res.statusCode = 404;
      res.end('Not found file');
    } else if (err) {
      res.statusCode = 500;
      res.end('server error');
    } else {
      res.end('delete file');
    }
  });
};
