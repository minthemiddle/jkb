class AppNavbar extends HTMLElement {
  connectedCallback() {
    const storageKey = "jkbConcertCollapsed";
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
            <img src="images/logo.svg" alt="Junger Kammerchor Berlin Logo" class="brand-logo" width="219" height="90" decoding="async" />
          </a>

          <nav class="nav" aria-label="Hauptnavigation">
            <button class="concert-expand-btn" type="button" aria-label="Nächstes Konzert umschalten" title="Nächstes Konzert umschalten">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
                <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V208Zm-31.38-94.36-29.84-2.31-11.43-26.5a8,8,0,0,0-14.7,0l-11.43,26.5-29.84,2.31a8,8,0,0,0-4.47,14.14l22.52,18.59-6.86,27.71a8,8,0,0,0,11.82,8.81L128,167.82l25.61,15.07a8,8,0,0,0,11.82-8.81l-6.86-27.71,22.52-18.59a8,8,0,0,0-4.47-14.14Zm-32.11,23.6a8,8,0,0,0-2.68,8.09l3.5,14.12-13.27-7.81a8,8,0,0,0-8.12,0l-13.27,7.81,3.5-14.12a8,8,0,0,0-2.68-8.09l-11.11-9.18,14.89-1.15a8,8,0,0,0,6.73-4.8l6-13.92,6,13.92a8,8,0,0,0,6.73,4.8l14.89,1.15Z"></path>
              </svg>
            </button>
          ${link('konzerte.html', 'Konzerte')}
            <span class="sep" aria-hidden="true">|</span>
            ${link('eindruecke.html', 'Eindrücke')}
            <span class="sep" aria-hidden="true">|</span>
            ${link('leitung.html', 'Leitung')}
            <span class="sep" aria-hidden="true">|</span>  
            ${link('mitsingen.html', 'Mitsingen')}
            <span class="sep" aria-hidden="true">|</span>
            ${link('chorleben.html', 'Chorleben')}
          </nav>
        </div>
      </header>
    `;

    const expandBtn = this.querySelector(".concert-expand-btn");
    const sync = () => {
      const collapsed = document.body.classList.contains("concert-collapsed");
      if (expandBtn) {
        expandBtn.setAttribute("aria-expanded", collapsed ? "false" : "true");
        expandBtn.setAttribute(
          "title",
          collapsed ? "Nächstes Konzert anzeigen" : "Nächstes Konzert einklappen"
        );
      }
    };

    try {
      if (localStorage.getItem(storageKey) === "1") {
        document.body.classList.add("concert-collapsed");
      }
    } catch (_) {
      // ignore storage errors
    }

    expandBtn?.addEventListener("click", () => {
      const collapsed = document.body.classList.contains("concert-collapsed");
      document.body.classList.toggle("concert-collapsed", !collapsed);
      try {
        localStorage.setItem(storageKey, collapsed ? "0" : "1");
      } catch (_) {
        // ignore storage errors
      }
      window.dispatchEvent(new CustomEvent("jkb:concert-toggle", { detail: { collapsed: !collapsed } }));
      sync();
    });

    window.addEventListener("jkb:concert-toggle", sync);
    sync();
  }
}

if (!customElements.get('app-navbar')) {
  customElements.define('app-navbar', AppNavbar);
}
