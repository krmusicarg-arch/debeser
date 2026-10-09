(function () {
  // --- Botón de Compartir ---
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    const label = shareBtn.querySelector('[data-label]');
    const original = label ? label.textContent : 'Compartir';
    const url = location.href.split('#')[0];

    function flash(msg) {
      if (!label) return;
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

    shareBtn.addEventListener('click', async () => {
      // 1) Diálogo nativo del sistema (en móviles)
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'DEBESER · La Banda de Rock más Joven de Argentina',
            text: 'Escuchá a DEBESER, rock enérgico y juvenil de Córdoba (16-20 años).',
            url
          });
          return;
        } catch (err) {
          if (err && err.name === 'AbortError') return;
        }
      }
      // 2) Copiar enlace
      try {
        await navigator.clipboard.writeText(url);
        flash('¡Link copiado!');
      } catch (e) {
        flash(legacyCopy(url) ? '¡Link copiado!' : 'Copiá: ' + url);
      }
    });
  }

  // --- Menú de Navegación Lateral (Drawer) ---
  const menuBtn = document.getElementById('menu-btn');
  const menuDrawer = document.getElementById('menu-drawer');
  const menuOverlay = document.getElementById('menu-overlay');
  const menuClose = document.getElementById('menu-close');
  const navLinks = document.querySelectorAll('.nav-drawer-link');

  function openMenu() {
    if (!menuDrawer) return;
    menuDrawer.classList.remove('pointer-events-none', 'opacity-0');
    menuDrawer.classList.add('pointer-events-auto', 'opacity-100');
    document.body.classList.add('overflow-hidden');
  }

  function closeMenu() {
    if (!menuDrawer) return;
    menuDrawer.classList.remove('pointer-events-auto', 'opacity-100');
    menuDrawer.classList.add('pointer-events-none', 'opacity-0');
    document.body.classList.remove('overflow-hidden');
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', openMenu);
  }
  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuDrawer && !menuDrawer.classList.contains('opacity-0')) {
      closeMenu();
    }
  });
})();
