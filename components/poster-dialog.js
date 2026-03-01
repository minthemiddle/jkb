(() => {
  const grid = document.querySelector(".poster-grid");
  if (!grid) return;

  const dialog = document.createElement("dialog");
  dialog.className = "poster-dialog";
  dialog.innerHTML = `
    <button class="poster-dialog-close" type="button" aria-label="Schließen">Schliessen</button>
    <figure class="poster-dialog-figure">
      <img class="poster-dialog-image" alt="" />
      <figcaption class="poster-dialog-caption"></figcaption>
    </figure>
  `;
  document.body.appendChild(dialog);

  const closeButton = dialog.querySelector(".poster-dialog-close");
  const dialogImage = dialog.querySelector(".poster-dialog-image");
  const dialogCaption = dialog.querySelector(".poster-dialog-caption");

  const openPoster = (img) => {
    dialogImage.src = img.currentSrc || img.src;
    dialogImage.alt = img.alt || "";
    dialogCaption.textContent = img.closest("figure")?.querySelector("figcaption")?.textContent || "";

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      return;
    }
    window.open(dialogImage.src, "_blank", "noopener,noreferrer");
  };

  grid.querySelectorAll("img").forEach((img) => {
    img.classList.add("poster-preview");
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", `${img.alt || "Plakat"} in Vollansicht oeffnen`);

    img.addEventListener("click", () => openPoster(img));
    img.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openPoster(img);
    });
  });

  closeButton?.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") dialog.close();
  });
})();
