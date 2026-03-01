class AppCurrentConcert extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute('variant') || 'hero';
    const modifier = variant === 'footer' ? ' event--compact' : '';

    this.innerHTML = `
      <section class="event${modifier}" aria-label="Nächstes Konzert">
        <p class="kicker">Nächstes Konzert</p>
        <h2 class="event-title">Treffpunkt Weltzeituhr</h2>
        <p class="event-meta">10. Mai 2026, 15:30 Uhr</p>
        <p class="event-meta"><strong>Kammermusiksaal Philharmonie Berlin</strong></p>
        <p class="event-meta">Herbert-von-Karajan-Straße 1, 10785 Berlin</p>
        <p class="event-link-wrap"><a class="event-link" href="https://chorverband-berlin.reservix.de/tickets-sonntagskonzertreihe-nr-5-treffpunkt-weltzeituhr-in-berlin-philharmonie-kammermusiksaal-am-10-5-2026/e2469775" target="_blank" rel="noopener noreferrer">Tickets</a></p>
      </section>
    `;
  }
}

if (!customElements.get('app-current-concert')) {
  customElements.define('app-current-concert', AppCurrentConcert);
}
