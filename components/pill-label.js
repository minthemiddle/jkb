class AppPillLabel extends HTMLElement {
  connectedCallback() {
    const text = (this.getAttribute("text") || this.textContent || "").trim() || "Label";
    this.innerHTML = `<span class="pill-badge">${text}</span>`;
  }
}

if (!customElements.get("app-pill-label")) {
  customElements.define("app-pill-label", AppPillLabel);
}
