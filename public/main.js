(function () {
  // --- Registrar Service Worker para PWA ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('Error registrando Service Worker:', err);
      });
    });
  }

  // --- Lógica de Instalación de la App (PWA) ---
  let deferredPrompt = null;
  const installBtns = document.querySelectorAll('.pwa-install-btn');
  const installModal = document.getElementById('install-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');

  const isIos = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  };

  const isStandalone = () => {
    return (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone === true);
  };

  // Capturar el evento de instalación nativo en navegadores Chromium/Android
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installBtns.forEach(btn => {
      btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check_circle</span><span>App Instalada</span>';
      btn.classList.add('opacity-80', 'pointer-events-none');
    });
  });

  // Si ya está abierta como aplicación instalada
  if (isStandalone()) {
    installBtns.forEach(btn => {
      btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check_circle</span><span>App Instalada</span>';
      btn.classList.add('opacity-80', 'pointer-events-none');
    });
  }

  function showModal() {
    if (!installModal) return;
    installModal.classList.remove('pointer-events-none', 'opacity-0');
    installModal.classList.add('pointer-events-auto', 'opacity-100');
  }

  function closeModal() {
    if (!installModal) return;
    installModal.classList.remove('pointer-events-auto', 'opacity-100');
    installModal.classList.add('pointer-events-none', 'opacity-0');
  }

  function handleInstallClick() {
    if (isStandalone()) {
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('El usuario instaló la aplicación');
        }
        deferredPrompt = null;
      });
    } else {
      // Mostrar modal explicativo con instrucciones para iPhone (iOS) y otros navegadores
      showModal();
    }
  }

  installBtns.forEach(btn => {
    btn.addEventListener('click', handleInstallClick);
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

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
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'DEBESER · La Banda de Rock más Joven de Argentina',
            text: 'Descubrí a DEBESER, rock enérgico y juvenil de Córdoba (16-20 años).',
            url
          });
          return;
        } catch (err) {
          if (err && err.name === 'AbortError') return;
        }
      }
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

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (menuDrawer && !menuDrawer.classList.contains('opacity-0')) {
        closeMenu();
      }
      if (installModal && !installModal.classList.contains('opacity-0')) {
        closeModal();
      }
    }
  });
})();
