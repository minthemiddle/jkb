class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="footer-inner">
          <nav class="footer-nav" aria-label="Weitere Seiten">
            <a href="/">Startseite</a>
            <span class="sep" aria-hidden="true">|</span>
            <a href="eindruecke">Eindrücke</a>
            <span class="sep" aria-hidden="true">|</span>
            <a href="leitung">Leitung</a>
            <span class="sep" aria-hidden="true">|</span>
            <a href="stimmbildung">Stimmbildung</a>
            <span class="sep" aria-hidden="true">|</span>
            <a href="unterstuetzung">Unterstützen</a>
            <span class="sep" aria-hidden="true">|</span>
            <a href="impressum">Impressum</a>
          </nav>
        </div>
      </footer>
    `;
  }
}

if (!customElements.get('app-footer')) {
  customElements.define('app-footer', AppFooter);
}
