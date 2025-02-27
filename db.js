const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./qr_codes.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS qr_codes (id INTEGER PRIMARY KEY, base64 TEXT)");
});

function insertQRCode(base64) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO qr_codes (base64) VALUES (?)");
    stmt.run(base64, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
    stmt.finalize();
  });
}

function getQRCodes() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM qr_codes", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function clearQRCodes() {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM qr_codes", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = { insertQRCode, getQRCodes, clearQRCodes };
