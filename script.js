document.addEventListener('DOMContentLoaded', () => {
  const contrastBtn = document.getElementById('contrast-toggle');
  const increaseFontBtn = document.getElementById('increase-font');
  const decreaseFontBtn = document.getElementById('decrease-font');
  const resetFontBtn = document.getElementById('reset-font');
  const urlForm = document.getElementById('url-form');
  const urlInput = document.getElementById('url-input');
  const resultMessage = document.getElementById('result-message');

  // Gerenciamento do Tamanho do Texto com Persistência
  let fontScale = parseFloat(localStorage.getItem('fontScale')) || 1.1;

  const updateFontScale = () => {
    document.documentElement.style.setProperty('--font-scale', `${fontScale}rem`);
    localStorage.setItem('fontScale', fontScale);
  };
  updateFontScale();

  // Restaurar Preferência de Alto Contraste
  if (localStorage.getItem('highContrast') === 'true') {
    document.body.classList.add('high-contrast');
    contrastBtn.setAttribute('aria-pressed', 'true');
  }

  contrastBtn.addEventListener('click', () => {
    const isHighContrast = document.body.classList.toggle('high-contrast');
    contrastBtn.setAttribute('aria-pressed', isHighContrast);
    localStorage.setItem('highContrast', isHighContrast);
  });

  increaseFontBtn.addEventListener('click', () => {
    if (fontScale < 1.8) {
      fontScale += 0.1;
      updateFontScale();
    }
  });

  decreaseFontBtn.addEventListener('click', () => {
    if (fontScale > 0.8) {
      fontScale -= 0.1;
      updateFontScale();
    }
  });

  resetFontBtn.addEventListener('click', () => {
    fontScale = 1.1;
    updateFontScale();
  });

  // Análise Avançada da URL
  urlForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const rawInput = urlInput.value.trim();

    if (!rawInput) {
      resultMessage.textContent = 'Aviso: Por favor, digite um endereço para verificação.';
      return;
    }

    try {
      const formattedUrl = rawInput.startsWith('http://') || rawInput.startsWith('https://')
        ? rawInput
        : `https://${rawInput}`;

      const parsedUrl = new URL(formattedUrl);
      const host = parsedUrl.hostname;
      const alerts = [];

      // 1. Checagem de Conexão Segura
      if (parsedUrl.protocol === 'http:') {
        alerts.push('ALERTA DE SEGURANÇA: O site não possui criptografia segura (HTTP). Não digite dados sensíveis.');
      }

      // 2. Checagem de IP direto no domínio
      if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
        alerts.push('ATENÇÃO: O link utiliza um número de IP direto em vez de um nome de domínio. Isso é muito comum em golpes.');
      }

      // 3. Checagem de números em substituição de letras (ex: banc0 em vez de banco)
      if (/\d/.test(host) && (host.includes('0') || host.includes('1'))) {
        alerts.push('CUIDADO: O endereço contém números que podem estar substituindo letras (como "0" no lugar de "O"). Confirme a grafia.');
      }

      if (alerts.length > 0) {
        resultMessage.textContent = alerts.join(' ');
      } else {
        resultMessage.textContent = `ANÁLISE OK: O site utiliza protocolo seguro (${parsedUrl.protocol.toUpperCase()}) e estrutura de domínio padronizada (${host}). Lembre-se de sempre checar se o nome pertence à empresa oficial.`;
      }
    } catch (err) {
      resultMessage.textContent = 'Erro: Digite um formato de endereço válido (exemplo: site.com.br).';
    }
  });
});