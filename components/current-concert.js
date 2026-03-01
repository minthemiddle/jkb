class AppCurrentConcert extends HTMLElement {
  connectedCallback() {
    const storageKey = "jkbConcertCollapsed";
    const setCollapsed = (collapsed) => {
      document.body.classList.toggle("concert-collapsed", collapsed);
      try {
        localStorage.setItem(storageKey, collapsed ? "1" : "0");
      } catch (_) {
        // ignore storage errors
      }
      window.dispatchEvent(new CustomEvent("jkb:concert-toggle", { detail: { collapsed } }));
    };

    try {
      if (localStorage.getItem(storageKey) === "1") {
        document.body.classList.add("concert-collapsed");
      }
    } catch (_) {
      // ignore storage errors
    }

    this.innerHTML = `
      <section class="event" aria-label="Nächstes Konzert">
        <button class="concert-collapse-btn" type="button" aria-label="Nächstes Konzert einklappen" title="Nächstes Konzert einklappen">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        </button>
        <div class="event-grid">
          <div class="event-main">
            <p class="kicker">Nächstes Konzert</p>
            <h2 class="event-title">Treffpunkt Weltzeituhr</h2>
            <p class="event-meta event-meta-iconline">
              <svg class="event-meta-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
                <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path>
              </svg>
              10. Mai 2026, 15:30 Uhr
            </p>
            <p class="event-meta event-meta-iconline">
              <svg class="event-meta-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
                <path d="M200,224H150.54A266.56,266.56,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25a88,88,0,0,0-176,0c0,31.4,14.51,64.68,42,96.25A266.56,266.56,0,0,0,105.46,224H56a8,8,0,0,0,0,16H200a8,8,0,0,0,0-16ZM56,104a72,72,0,0,1,144,0c0,57.23-55.47,105-72,118C111.47,209,56,161.23,56,104Zm112,0a40,40,0,1,0-40,40A40,40,0,0,0,168,104Zm-64,0a24,24,0,1,1,24,24A24,24,0,0,1,104,104Z"></path>
              </svg>
              <strong>Kammermusiksaal Philharmonie Berlin</strong>
            </p>
            <p class="event-meta">Herbert-von-Karajan-Straße 1, 10785 Berlin</p>
            <p class="event-meta">Mit tonraumfünf10 und be:one vocalists</p>
            <p class="event-link-wrap"><a class="event-link icon-link" href="https://chorverband-berlin.reservix.de/tickets-sonntagskonzertreihe-nr-5-treffpunkt-weltzeituhr-in-berlin-philharmonie-kammermusiksaal-am-10-5-2026/e2469775" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
                <path d="M232,104a8,8,0,0,0,8-8V64a16,16,0,0,0-16-16H32A16,16,0,0,0,16,64V96a8,8,0,0,0,8,8,24,24,0,0,1,0,48,8,8,0,0,0-8,8v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160a8,8,0,0,0-8-8,24,24,0,0,1,0-48ZM32,167.2a40,40,0,0,0,0-78.4V64H88V192H32Zm192,0V192H104V64H224V88.8a40,40,0,0,0,0,78.4Z"></path>
              </svg>
              Tickets
            </a></p>
          </div>
        <aside class="event-next" aria-label="Vormerken">
          <p class="kicker">Vormerken</p>
          <p class="event-next-title">Adventskonzert: Bach: Magnificat</p>
          <p class="event-meta event-meta-iconline">
            <svg class="event-meta-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
              <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path>
            </svg>
            5. Dezember 2026
          </p>
          <p class="event-meta event-meta-iconline">
            <svg class="event-meta-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
              <path d="M200,224H150.54A266.56,266.56,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25a88,88,0,0,0-176,0c0,31.4,14.51,64.68,42,96.25A266.56,266.56,0,0,0,105.46,224H56a8,8,0,0,0,0,16H200a8,8,0,0,0,0-16ZM56,104a72,72,0,0,1,144,0c0,57.23-55.47,105-72,118C111.47,209,56,161.23,56,104Zm112,0a40,40,0,1,0-40,40A40,40,0,0,0,168,104Zm-64,0a24,24,0,1,1,24,24A24,24,0,0,1,104,104Z"></path>
            </svg>
            Berlin, Ort folgt
          </p>
          <p class="event-meta">Mit dem Jungen Philharmonischen Orchester Niedersachsen</p>
          <p class="event-link-wrap"><a class="event-link icon-link" href="https://ti.to/jungerkammerchorberlin/magnificat" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
              <path d="M232,104a8,8,0,0,0,8-8V64a16,16,0,0,0-16-16H32A16,16,0,0,0,16,64V96a8,8,0,0,0,8,8,24,24,0,0,1,0,48,8,8,0,0,0-8,8v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160a8,8,0,0,0-8-8,24,24,0,0,1,0-48ZM32,167.2a40,40,0,0,0,0-78.4V64H88V192H32Zm192,0V192H104V64H224V88.8a40,40,0,0,0,0,78.4Z"></path>
            </svg>
            Vormerken
          </a></p>
        </aside>
        </div>
      </section>
    `;

    const collapseBtn = this.querySelector(".concert-collapse-btn");
    collapseBtn?.addEventListener("click", () => setCollapsed(true));
  }
}

if (!customElements.get('app-current-concert')) {
  customElements.define('app-current-concert', AppCurrentConcert);
}
