for (const study of document.querySelectorAll("[data-case-study]")) {
  const tabList = study.querySelector(".study-step-controls");
  const tabs = [...tabList.querySelectorAll("[data-study-tab]")];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

  function select(index, moveFocus = false) {
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[tabIndex].hidden = !selected;
    });
    study.dataset.studyCurrent = tabs[index].dataset.studyTab;
    if (moveFocus) tabs[index].focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(index));
    tab.addEventListener("keydown", (event) => {
      const destination = {
        ArrowLeft: (index + tabs.length - 1) % tabs.length,
        ArrowRight: (index + 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      }[event.key];
      if (destination === undefined) return;
      event.preventDefault();
      select(destination, true);
    });
  });

  select(0);
  tabList.hidden = false;
}
