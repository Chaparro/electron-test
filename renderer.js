const generateQRButton = document.getElementById('generateQR');
const clearBackendButton = document.getElementById('clearBackend');
const qrGrid = document.getElementById('qrGrid');
const qrModal = document.getElementById('qrModal');
const modalQRImage = document.getElementById('modalQRImage');
const modalQRFooter = document.getElementById('modalQRFooter');
const closeModal = document.getElementsByClassName('close')[0];

generateQRButton.addEventListener('click', async () => {
  const text = `QR Code ${Date.now()}`;
  const { id, base64 } = await window.electronAPI.generateQR(text);
  addQRToGrid(id, base64);
});

clearBackendButton.addEventListener('click', async () => {
  await window.electronAPI.clearBackend();
  qrGrid.innerHTML = '';
});

async function loadQRCodes() {
  const qrCodes = await window.electronAPI.getQRCodes();
  qrCodes.forEach(({ id, base64 }) => addQRToGrid(id, base64));
}

function addQRToGrid(id, base64) {
  const container = document.createElement('div');
  container.className = 'grid-item';

  const img = document.createElement('img');
  img.src = `data:image/png;base64,${base64}`;
  container.appendChild(img);

  const footer = document.createElement('div');
  footer.className = 'base64';
  footer.textContent = id;
  container.appendChild(footer);

  container.addEventListener('click', () => {
    modalQRImage.src = `data:image/png;base64,${base64}`;
    modalQRFooter.textContent = id;
    qrModal.style.display = 'block';
  });

  qrGrid.appendChild(container);
}

closeModal.onclick = function() {
  qrModal.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == qrModal) {
    qrModal.style.display = 'none';
  }
}

loadQRCodes();
