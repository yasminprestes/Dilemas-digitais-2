document.addEventListener('DOMContentLoaded', () => {
  const contrastBtn = document.getElementById('contrast-toggle');
  const increaseFontBtn = document.getElementById('increase-font');
  const decreaseFontBtn = document.getElementById('decrease-font');
  const checkBtn = document.getElementById('check-btn');
  const urlInput = document.getElementById('url-input');
  const resultMessage = document.getElementById('result-message');

  let currentFontSize = 20;

  contrastBtn.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
  });

  increaseFontBtn.addEventListener('click', () => {
    if (currentFontSize < 32) {
      currentFontSize += 2;
      document.documentElement.style.setProperty('--font-size', `${currentFontSize}px`);
    }
  });

  decreaseFontBtn.addEventListener('click', () => {
    if (currentFontSize > 16) {
      currentFontSize -= 2;
      document.documentElement.style.setProperty('--font-size', `${currentFontSize}px`);
    }
  });

  checkBtn.addEventListener('click', () => {
    const url = urlInput.value.trim().toLowerCase();

    if (!url) {
      resultMessage.textContent = 'Por favor, digite ou cole um endereço de site.';
      return;
    }

    if (!url.startsWith('https://')) {
      resultMessage.textContent = 'Atenção: Este site não usa conexão segura (HTTPS). Evite inserir dados pessoais.';
    } else {
      resultMessage.textContent = 'O site possui criptografia básica (HTTPS). Lembre-se de conferir se o nome do domínio está correto.';
    }
  });
});