// Shared header/footer rendering + nav behavior
(function(){
  const PHONE = '+34694497322';
  const PHONE_DISPLAY = '694 49 73 22';

  function renderHeader(active, transparent) {
    const links = [
      { href: 'index.html#sobre', label: 'Sobre nosotros', key: 'sobre' },
      { href: 'carta.html', label: 'Carta', key: 'carta' },
      { href: 'galeria.html', label: 'Fotos', key: 'galeria' },
      { href: 'reservar.html', label: 'Reservar', key: 'reservar' },
      { href: 'ubicacion.html', label: 'Ubicación', key: 'ubicacion' }
    ];
    const linkHtml = links.map(l =>
      `<a href="${l.href}" class="${l.key === active ? 'active' : ''}">${l.label}</a>`
    ).join('');
    const mobileLinks = links.map(l => `<a href="${l.href}">${l.label}</a>`).join('') +
      `<a href="tel:${PHONE}" style="color: var(--gold);">Llamar ${PHONE_DISPLAY}</a>`;

    document.getElementById('header-mount').innerHTML = `
      <header class="nav ${transparent ? 'transparent' : 'solid'}" id="nav">
        <div class="container">
          <a href="index.html" class="brand" aria-label="Russes Gastrobar">
            <img src="images/logo.png?v=20260504-2" alt="Russes Gastrobar Aracena" class="brand-logo" />
          </a>
          <nav class="links">${linkHtml}</nav>
          <a href="tel:${PHONE}" class="btn">Llamar</a>
          <button class="menu-toggle" aria-label="Menú" id="menuToggle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </header>
      <div class="mobile-menu" id="mobileMenu">${mobileLinks}</div>
    `;

    const nav = document.getElementById('nav');
    const onScroll = () => {
      if (window.scrollY > 60) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', onScroll);
    window.addEventListener('pageshow', onScroll);
    window.addEventListener('hashchange', onScroll);
    onScroll();
    requestAnimationFrame(onScroll);
    setTimeout(onScroll, 150);
    const toggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    toggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  function renderFooter() {
    document.getElementById('footer-mount').innerHTML = `
      <footer>
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="name">Russes Aracena</div>
              <span class="signature">Rufino Serrano</span>
              <p>Cocina de la Sierra de Aracena. Producto local, técnica y sabor. Desde 1983 en C. Noria, 1.</p>
            </div>
            <div>
              <h4>Visítanos</h4>
              <p>C. Noria, 1<br/>21200 Aracena<br/>Huelva</p>
              <a href="https://www.google.com/maps/search/?api=1&query=Russes+Gastrobar+Aracena" target="_blank" rel="noopener" style="color: var(--gold); margin-top: 12px;">Abrir en Google Maps →</a>
            </div>
            <div>
              <h4>Contacto</h4>
              <a href="tel:${PHONE}" style="font-size: 18px; font-weight: 600; color: var(--gold);">${PHONE_DISPLAY}</a>
              <p style="font-size: 14px; margin-top: 8px;">Reservas, consultas y para llevar.</p>
            </div>
            <div>
              <h4>Horario</h4>
              <p style="font-size: 15px;">Lun—Sáb<br/>13:00–16:30 · 20:30–24:00<br/><span style="opacity: 0.6;">Domingo cerrado</span></p>
            </div>
          </div>
          <div class="footer-bottom">
            <p>© Russes Aracena · Todos los derechos reservados</p>
            <p><a href="creditos-fotos.html">Créditos fotográficos</a> · Aracena · Sierra de Huelva</p>
          </div>
        </div>
      </footer>
    `;
  }

  function setupReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  window.RussesPage = { renderHeader, renderFooter, setupReveal, PHONE, PHONE_DISPLAY };
})();
