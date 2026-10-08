(function () {
  const btn = document.getElementById('share-btn');
  if (!btn) return;
  const label = btn.querySelector('[data-label]');
  const original = label.textContent;
  const url = location.href.split('#')[0];

  function flash(msg) {
    label.textContent = msg;
    setTimeout(() => { label.textContent = original; }, 2000);
  }

  function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }

  btn.addEventListener('click', async () => {
    // 1) Menú nativo de compartir (celulares y algunos navegadores)
    if (navigator.share) {
      try {
        await navigator.share({ title: 'DEBESER', text: 'La banda mas joven', url });
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return; // el usuario cerró el menú
      }
    }
    // 2) Copiar el link al portapapeles
    try {
      await navigator.clipboard.writeText(url);
      flash('¡Link copiado!');
    } catch (e) {
      flash(legacyCopy(url) ? '¡Link copiado!' : 'Copiá: ' + url);
    }
  });
})();
