class AppInternalDates extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section aria-label="Termine 2026">
        <h3>Termine 2026</h3>
        <ul>
          <li>6.3. - 8.3. Probenwochenende</li>
          <li>9.5. Sonderprobe für das Konzert im Kammermusiksaal</li>
          <li>10.5. Konzert im Kammermusiksaal der Philharmonie</li>
          <li>12.5. Erste Probe für Sommerkonzert und Adventskonzert</li>
          <li>28.6. Sommerkonzert</li>
          <li>7.7. Letzte Probe vor der Sommerpause</li>
          <li>25.8. Erste Probe nach der Sommerpause</li>
          <li>6.11. - 8.11. Probenwochenende</li>
          <li>5.12. Adventskonzert <em>Bach: Magnificat mit <a href="https://www.jpon.de/">JPON</a></em></li>
        </ul>
      </section>
    `;
  }
}

if (!customElements.get('app-internal-dates')) {
  customElements.define('app-internal-dates', AppInternalDates);
}
