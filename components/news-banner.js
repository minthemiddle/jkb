class AppNewsBanner extends HTMLElement {
  connectedCallback() {
    const storageKey = "jkbNewsCollapsed";
    const role = (this.getAttribute("role") || "X").trim();
    const start = (this.getAttribute("start") || "xx.xx.xxxx").trim();

    const setCollapsed = (collapsed) => {
      document.body.classList.toggle("news-collapsed", collapsed);
      try {
        localStorage.setItem(storageKey, collapsed ? "1" : "0");
      } catch (_) {
        // ignore storage errors
      }
      window.dispatchEvent(new CustomEvent("jkb:news-toggle", { detail: { collapsed } }));
    };

    try {
      if (localStorage.getItem(storageKey) === "1") {
        document.body.classList.add("news-collapsed");
      }
    } catch (_) {
      // ignore storage errors
    }

    this.innerHTML = `
      <section class="news-banner" aria-label="Chor-News">
        <button class="news-collapse-btn" type="button" aria-label="Hinweis einklappen" title="Hinweis einklappen">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        </button>
        <p class="news-banner-text">
          <svg class="news-banner-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
            <path d="M232,48a8,8,0,0,1-8,8H208V72a8,8,0,0,1-16,0V56H176a8,8,0,0,1,0-16h16V24a8,8,0,0,1,16,0V40h16A8,8,0,0,1,232,48Zm-16,64v52a36,36,0,1,1-16-29.92V112a8,8,0,0,1,16,0Zm-16,52a20,20,0,1,0-20,20A20,20,0,0,0,200,164ZM88,110.25V196a36,36,0,1,1-16-29.92V56a8,8,0,0,1,6.06-7.76l56-14a8,8,0,0,1,3.88,15.52L88,62.25v31.5l70.06-17.51a8,8,0,0,1,3.88,15.52ZM72,196a20,20,0,1,0-20,20A20,20,0,0,0,72,196Z"></path>
          </svg>
          Wir suchen Bässe und Tenöre 2 zum Probenbeginn am 12.05.2026. <a class="news-banner-link" href="mitsingen">Mehr Infos</a>
        </p>
      </section>
    `;

    const collapseBtn = this.querySelector(".news-collapse-btn");
    collapseBtn?.addEventListener("click", () => setCollapsed(true));
  }
}

if (!customElements.get("app-news-banner")) {
  customElements.define("app-news-banner", AppNewsBanner);
}
