/* Progressive enhancement: figures still open directly when JavaScript is off. */
"use strict";

const dialog = document.querySelector(".image-dialog");
if (dialog && typeof dialog.showModal === "function") {
  const image = dialog.querySelector(".dialog-image");
  const title = dialog.querySelector("#image-dialog-title");
  const original = dialog.querySelector(".dialog-original");
  const scroller = dialog.querySelector(".dialog-body");
  let opener = null;

  document.querySelectorAll(".zoomable").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      title.textContent = link.dataset.title;
      image.src = link.href;
      image.alt = link.querySelector("img").alt;
      original.href = link.href;
      dialog.showModal();
      document.body.classList.add("image-open");
      scroller.scrollTo(0, 0);
    });
  });

  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("image-open");
    if (opener) opener.focus({ preventScroll: true });
  });
}
