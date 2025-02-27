const test = require('node:test');
const assert = require('node:assert/strict');
const { insertQRCode, getQRCodes, clearQRCodes } = require('../db');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./qr_codes.db');

test.before(() => {
  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS qr_codes (id INTEGER PRIMARY KEY, base64 TEXT)");
  });
});

test.afterEach(() => {
  db.run("DELETE FROM qr_codes");
});

test.after(() => {
  db.close();
});

test('insertQRCode should insert a QR code and return its ID', async () => {
  const base64 = 'test_base64';
  const id = await insertQRCode(base64);
  assert.ok(id > 0);
});

test('getQRCodes should return all QR codes and base64 values', async () => {
  codesNum = 10;
  for (let i = 0; i < codesNum; i++) {
    await insertQRCode('test_'+ i.toString());
  }
  const qrCodes = await getQRCodes();
  assert.ok(qrCodes.length > 0);
  assert.match(qrCodes[0].base64, /test_/);
});

test('clearQRCodes should delete all QR codes', async () => {
  const base64 = 'test_base64';
  await insertQRCode(base64);
  await clearQRCodes();
  const qrCodes = await getQRCodes();
  assert.strictEqual(qrCodes.length, 0);
});
