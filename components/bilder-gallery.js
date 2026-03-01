class AppBilderGallery extends HTMLElement {
  async connectedCallback() {
    this.classList.add("bilder-gallery");
    this.innerHTML = '<p class="concert-note">Bilder werden geladen …</p>';

    let items = [];
    try {
      const res = await fetch("images/bilder/manifest.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      items = await res.json();
    } catch (err) {
      this.innerHTML = '<p class="concert-note">Bilder konnten nicht geladen werden.</p>';
      return;
    }

    if (!Array.isArray(items) || !items.length) {
      this.innerHTML = '<p class="concert-note">Keine Bilder gefunden.</p>';
      return;
    }

    // Always render newest-first based on manifest timestamps.
    items.sort((a, b) => {
      const ta = Date.parse(a.timestamp || "");
      const tb = Date.parse(b.timestamp || "");
      return (Number.isFinite(tb) ? tb : 0) - (Number.isFinite(ta) ? ta : 0);
    });

    const normalizeCaption = (raw, fallback) => {
      const txt = (raw || "").replace(/\s+/g, " ").trim();
      if (!txt) return fallback;
      return txt;
    };

    const formatDate = (iso) => {
      const ts = Date.parse(iso || "");
      if (!Number.isFinite(ts)) return "";
      return new Intl.DateTimeFormat("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(new Date(ts));
    };

    const grid = document.createElement("div");
    grid.className = "bilder-grid";

    items.forEach((item, idx) => {
      const fallback = `${item.shortCode || "Beitrag"} · Bild ${item.index || idx + 1}`;
      const caption = normalizeCaption(item.caption, fallback);
      const alt = (item.alt || caption).replace(/\s+/g, " ").trim();

      const figure = document.createElement("figure");
      figure.className = "bilder-card";

      const button = document.createElement("button");
      button.className = "bilder-card-button";
      button.type = "button";
      button.dataset.index = String(idx);
      button.setAttribute("aria-label", `${fallback} in Vollansicht öffnen`);

      const img = document.createElement("img");
      img.loading = "lazy";
      img.decoding = "async";
      img.src = item.localPath;
      img.alt = alt || fallback;
      img.width = 1080;
      img.height = 1080;

      button.appendChild(img);
      figure.appendChild(button);
      grid.appendChild(figure);
    });

    const dialog = document.createElement("dialog");
    dialog.className = "bilder-dialog";
    dialog.innerHTML = `
      <button class="bilder-dialog-close" type="button" aria-label="Schließen">Schließen</button>
      <button class="bilder-dialog-nav bilder-dialog-prev" type="button" aria-label="Vorheriges Bild">‹</button>
      <figure class="bilder-dialog-figure">
        <img class="bilder-dialog-image" alt="" />
        <figcaption class="bilder-dialog-caption"></figcaption>
      </figure>
      <button class="bilder-dialog-nav bilder-dialog-next" type="button" aria-label="Nächstes Bild">›</button>
    `;

    this.innerHTML = "";
    this.appendChild(grid);
    document.body.appendChild(dialog);

    const dialogImg = dialog.querySelector(".bilder-dialog-image");
    const dialogCaption = dialog.querySelector(".bilder-dialog-caption");
    const closeBtn = dialog.querySelector(".bilder-dialog-close");
    const prevBtn = dialog.querySelector(".bilder-dialog-prev");
    const nextBtn = dialog.querySelector(".bilder-dialog-next");
    let current = 0;

    const show = (index) => {
      current = (index + items.length) % items.length;
      const item = items[current];
      const fallback = `${item.shortCode || "Beitrag"} · Bild ${item.index || current + 1}`;
      const caption = normalizeCaption(item.caption, fallback);
      const dateLabel = formatDate(item.timestamp);
      const alt = (item.alt || caption).replace(/\s+/g, " ").trim();
      dialogImg.src = item.localPath;
      dialogImg.alt = alt || fallback;
      dialogCaption.textContent = dateLabel ? `${dateLabel} · ${caption}` : caption;
    };

    const open = (index) => {
      show(index);
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        window.open(items[index].localPath, "_blank", "noopener,noreferrer");
      }
    };

    grid.querySelectorAll(".bilder-card-button").forEach((btn) => {
      btn.addEventListener("click", () => open(Number(btn.dataset.index)));
    });

    closeBtn?.addEventListener("click", () => dialog.close());
    prevBtn?.addEventListener("click", () => show(current - 1));
    nextBtn?.addEventListener("click", () => show(current + 1));

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        dialog.close();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(current - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        show(current + 1);
      }
    });
  }
}

if (!customElements.get("app-bilder-gallery")) {
  customElements.define("app-bilder-gallery", AppBilderGallery);
}
