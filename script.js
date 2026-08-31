document.addEventListener('DOMContentLoaded', () => {
  const btnContrast = document.getElementById('btn-contrast');
  const btnFontUp = document.getElementById('btn-font-up');
  const btnFontDown = document.getElementById('btn-font-down');
  const btnFontReset = document.getElementById('btn-font-reset');
  const btnTts = document.getElementById('btn-tts');
  const urlForm = document.getElementById('url-form');
  const urlInput = document.getElementById('url-input');
  const resultBox = document.getElementById('result-box');

  // Controladores de estado
  let fontMultiplier = parseFloat(localStorage.getItem('fontMultiplier')) || 1.0;
  let isSpeaking = false;

  // 1. Gerenciamento do Tamanho da Fonte
  const applyFontScale = () => {
    document.documentElement.style.fontSize = `${100 * fontMultiplier}%`;
    localStorage.setItem('fontMultiplier', fontMultiplier);
  };
  applyFontScale();

  btnFontUp.addEventListener('click', () => {
    if (fontMultiplier < 1.5) { fontMultiplier += 0.1; applyFontScale(); }
  });

  btnFontDown.addEventListener('click', () => {
    if (fontMultiplier > 0.8) { fontMultiplier -= 0.1; applyFontScale(); }
  });

  btnFontReset.addEventListener('click', () => {
    fontMultiplier = 1.0;
    applyFontScale();
  });

  // 2. Alto Contraste
  if (localStorage.getItem('highContrast') === 'true') {
    document.body.classList.add('high-contrast');
    btnContrast.setAttribute('aria-pressed', 'true');
  }

  btnContrast.addEventListener('click', () => {
    const isHigh = document.body.classList.toggle('high-contrast');
    btnContrast.setAttribute('aria-pressed', isHigh);
    localStorage.setItem('highContrast', isHigh);
  });

  // 3. Leitor de Áudio (Text-to-Speech) integrado
  btnTts.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta leitura em áudio.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      btnTts.textContent = '🔊 Ouvir Página';
      return;
    }

    const textToRead = document.querySelector('main').innerText;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;

    utterance.onend = () => {
      isSpeaking = false;
      btnTts.textContent = '🔊 Ouvir Página';
    };

    window.speechSynthesis.speak(utterance);
    isSpeaking = true;
    btnTts.textContent = '⏹️ Parar Leitura';
  });

  // 4. Validador Avançado de Links
  urlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawUrl = urlInput.value.trim();

    if (!rawUrl) return;

    try {
      const formatted = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') 
        ? rawUrl 
        : `https://${rawUrl}`;

      const parsed = new URL(formatted);
      const host = parsed.hostname.toLowerCase();
      const flags = [];

      if (parsed.protocol === 'http:') {
        flags.push('Site não seguro: não possui criptografia HTTPS.');
      }
      if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
        flags.push('Endereço suspeito: o link é um número de IP em vez de um nome de domínio.');
      }
      if (/\d/.test(host) && (host.includes('0') || host.includes('1'))) {
        flags.push('Atenção para substituição de letras por números (ex: 0 no lugar de O).');
      }

      const suspiciousTLDs = ['.xyz', '.top', '.zip', '.club', '.online'];
      if (suspiciousTLDs.some(tld => host.endsWith(tld))) {
        flags.push('Final de domínio com histórico elevado de uso para golpes.');
      }

      resultBox.hidden = false;
      if (flags.length > 0) {
        resultBox.className = 'status-card danger';
        resultBox.innerHTML = `⚠️ <strong>ALERTA DE SEGURANÇA:</strong><br>${flags.join('<br>')}`;
      } else {
        resultBox.className = 'status-card success';
        resultBox.innerHTML = `✅ <strong>ESTRUTURA VÁLIDA:</strong> O link usa protocolo seguro e estrutura comum (${host}). Sempre verifique se o nome bate com o da instituição.`;
      }
    } catch {
      resultBox.hidden = false;
      resultBox.className = 'status-card danger';
      resultBox.innerHTML = '❌ <strong>ERRO:</strong> Digite um endereço válido (exemplo: site.com.br).';
    }
  });
});