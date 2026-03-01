class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="footer-inner">
          <nav class="footer-nav" aria-label="Weitere Seiten">
            <a href="index.html">Startseite</a>
            <span class="sep" aria-hidden="true">|</span>
            <a href="leitung.html">Leitung</a>
            <span class="sep" aria-hidden="true">|</span>
            <a href="unterstuetzung.html">Unterstützen</a>
            <span class="sep" aria-hidden="true">|</span>
            <a href="impressum.html">Impressum</a>
          </nav>
        </div>
      </footer>
    `;
  }
}

if (!customElements.get('app-footer')) {
  customElements.define('app-footer', AppFooter);
}
