class AppNavbar extends HTMLElement {
  connectedCallback() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    const isActive = (href) => current === href;

    const link = (href, label) => {
      const activeClass = isActive(href) ? ' is-active' : '';
      const aria = isActive(href) ? ' aria-current="page"' : '';
      return `<a href="${href}" class="nav-link${activeClass}"${aria}>${label}</a>`;
    };

    this.innerHTML = `
      <header class="site-header">
        <div class="header-inner">
          <a href="index.html" class="brand" aria-label="Junger Kammerchor Berlin Startseite">
            <img src="images/logo.svg" alt="Junger Kammerchor Berlin Logo" class="brand-logo" />
          </a>

          <nav class="nav" aria-label="Hauptnavigation">
            ${link('konzerte.html', 'Konzerte')}
            <span class="sep" aria-hidden="true">|</span>
            ${link('mitsingen.html', 'Mitsingen')}
            <span class="sep" aria-hidden="true">|</span>
            ${link('chorleben.html', 'Chorleben')}
          </nav>
        </div>
      </header>
    `;
  }
}

if (!customElements.get('app-navbar')) {
  customElements.define('app-navbar', AppNavbar);
}
