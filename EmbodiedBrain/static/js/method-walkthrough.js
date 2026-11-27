(() => {
  const walkthrough = document.querySelector("[data-method-walkthrough]");
  if (!walkthrough) return;

  const controls = walkthrough.querySelector(".method-controls");
  const tabs = [...walkthrough.querySelectorAll("[data-method-tab]")];
  const panels = [...walkthrough.querySelectorAll("[data-method-panel]")];
  const steps = [...walkthrough.querySelectorAll("[data-method-step]")];
  const video = walkthrough.querySelector("[data-method-video]");

  function selectPhase(index) {
    tabs.forEach((tab, position) => {
      const current = position === index;
      tab.setAttribute("aria-pressed", String(current));
      panels[position].hidden = !current;
      steps[position].classList.toggle("is-active", current);
    });
    if (video?.closest("[data-method-panel]")?.hidden) {
      video.pause();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectPhase(index));
  });

  selectPhase(0);
  controls.hidden = false;
  walkthrough.dataset.enhanced = "";
})();
