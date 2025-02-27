const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const qrDir = path.join(__dirname, 'qr_codes');
if (!fs.existsSync(qrDir)) {
  fs.mkdirSync(qrDir);
}

function generateQRCode(text, filename) {
  return new Promise((resolve, reject) => {
    QRCode.toFile(path.join(qrDir, filename), text, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function readQRCode(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(qrDir, filename), (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString('base64'));
        //resolve(QRCode.toDataURL(data.toString('base64')));
      }
    });
  });
}

function clearQRCodes() {
  return new Promise((resolve, reject) => {
    fs.readdir(qrDir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        files.forEach(file => fs.unlinkSync(path.join(qrDir, file)));
        resolve();
      }
    });
  });
}

module.exports = { generateQRCode, readQRCode, clearQRCodes };
