(function () {
  const cfg = window.APP_CONFIG || { MODE: 'static' };

  if (!cfg.MODE || cfg.MODE === 'static') return;

  const originalFetch = window.fetch.bind(window);

  function trimSlash(value) {
    return String(value || '').replace(/\/+$/, '');
  }

  function appendType(url, type) {
    if (!url) return '';
    const sep = String(url).includes('?') ? '&' : '?';
    return `${url}${sep}type=${encodeURIComponent(type)}`;
  }

  function backendContentUrl(type) {
    if (!type) return '';

    if (cfg.CONTENT_BASE_URL) {
      return appendType(cfg.CONTENT_BASE_URL, type);
    }

    const apiBase = trimSlash(cfg.API_BASE_URL || '');
    if (!apiBase) return '';

    // Netlify Functions endpoint: /.netlify/functions/content?type=people
    if (/\.netlify\/functions$/i.test(apiBase) || cfg.MODE === 'netlify') {
      return appendType(`${apiBase}/content`, type);
    }

    // Zemi/cPanel PHP endpoint: /api/content.php?type=people
    if (/\/api$/i.test(apiBase) || cfg.MODE === 'zemi') {
      return appendType(`${apiBase}/content.php`, type);
    }

    return appendType(`${apiBase}/content`, type);
  }

  function typeFromUrl(input) {
    const raw = typeof input === 'string' ? input : (input && input.url) || '';
    const clean = raw.split('?')[0].replace(/^https?:\/\/[^/]+/i, '');
    const match = clean.match(/(?:^|\/)content\/([a-z0-9_-]+)\.json$/i);
    return match ? match[1] : null;
  }

  window.fetch = function patchedFetch(input, init) {
    const type = typeFromUrl(input);
    const method = (init && init.method ? init.method : 'GET').toUpperCase();

    if (type && method === 'GET') {
      const backendUrl = backendContentUrl(type);
      if (backendUrl) {
        return originalFetch(backendUrl, {
          credentials: 'include',
          cache: 'no-store'
        });
      }
    }

    return originalFetch(input, init);
  };
})();
