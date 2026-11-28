(() => {
  const section = document.querySelector("[data-g1-replay]");
  if (!section) return;

  const video = section.querySelector("video");
  const maps = section.querySelectorAll("[data-g1-map]");
  const label = section.querySelector("[data-g1-stage]");
  const checkpoints = [
    { time: 0, label: "Stage-aligned replay" },
    { time: 31.4, label: "Last confirmed · first bed visit" },
    { time: 123.4, label: "Last confirmed · produce area" },
    { time: 205.4, label: "Last confirmed · return to the bed" },
  ];
  let active = 0;

  function showCheckpoint() {
    const current = checkpoints.findLastIndex(checkpoint => video.currentTime >= checkpoint.time);
    if (current < 0 || current === active) return;
    maps[active].hidden = true;
    maps[current].hidden = false;
    label.textContent = checkpoints[current].label;
    active = current;
  }

  video.addEventListener("timeupdate", showCheckpoint);
  video.addEventListener("seeked", showCheckpoint);
  video.addEventListener("loadedmetadata", showCheckpoint);
})();
