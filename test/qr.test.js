const test = require('node:test');
const assert = require('node:assert/strict');
const { generateQRCode, readQRCode, clearQRCodes } = require('../qr');
const fs = require('fs');
const path = require('path');

const qrDir = path.join(__dirname, '../qr_codes');

test.before(() => {
  if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir);
  }
});

test.afterEach(() => {
  const files = fs.readdirSync(qrDir);
  files.forEach(file => fs.unlinkSync(path.join(qrDir, file)));
});

test('generateQRCode should create a QR code file', async () => {
  const text = 'test_text';
  const filename = 'test_qr.png';
  await generateQRCode(text, filename);
  const filePath = path.join(qrDir, filename);
  assert.ok(fs.existsSync(filePath));
});

test('readQRCode should read a QR code file and return its base64 content', async () => {
  const text = 'test_text';
  const filename = 'test_qr.png';
  await generateQRCode(text, filename);
  const base64 = await readQRCode(filename);
  assert.ok(base64);
});

test('clearQRCodes should delete all QR code files', async () => {
  const text = 'test_text';
  const filename = 'test_qr.png';
  await generateQRCode(text, filename);
  await clearQRCodes();
  const files = fs.readdirSync(qrDir);
  assert.strictEqual(files.length, 0);
});
