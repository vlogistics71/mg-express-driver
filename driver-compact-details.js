/* Compact driver job details navigation.
   Does not change the real job content or any existing workflow handlers. */
(() => {
  "use strict";
  const modal = document.getElementById("jobModal");
  const sheet = modal?.querySelector(".job-modal-sheet");
  const content = document.getElementById("jobModalContent");
  const close = document.getElementById("jobModalClose");
  if (!modal || !sheet || !content || !close) return;

  const names = ["Overview", "Route", "Workflow"];
  const bar = document.createElement("div");
  bar.className = "mg-driver-detail-tabs";
  bar.setAttribute("aria-label", "Job details navigation");
  const heading = document.createElement("div");
  heading.className = "mg-driver-tab-heading";
  const headingText = document.createElement("strong");
  headingText.textContent = names[0];
  const counter = document.createElement("span");
  counter.textContent = "1 of 3";
  heading.append(headingText, counter);
  bar.appendChild(heading);

  const nav = document.createElement("nav");
  nav.className = "mg-driver-tab-list";
  const tabs = names.map((label, index) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.textContent = label;
    tab.addEventListener("click", () => show(index));
    nav.appendChild(tab);
    return tab;
  });
  bar.appendChild(nav);
  sheet.insertBefore(bar, content);

  const footer = document.createElement("div");
  footer.className = "mg-driver-detail-footer";
  const back = document.createElement("button");
  back.type = "button";
  back.className = "mg-driver-detail-back";
  const next = document.createElement("button");
  next.type = "button";
  next.className = "mg-driver-detail-next";
  footer.append(back, next);
  sheet.appendChild(footer);

  let active = 0;
  let currentJob = "";
  let groups = null;

  function show(index, preserveScroll = false) {
    if (!groups) return;
    active = Math.max(0, Math.min(names.length - 1, index));
    const visible = new Set(groups[active]);
    for (const child of Array.from(content.children)) {
      child.classList.toggle("mg-detail-visible", visible.has(child));
    }
    headingText.textContent = names[active];
    counter.textContent = (active + 1) + " of " + names.length;
    tabs.forEach((tab, i) => {
      if (i === active) tab.setAttribute("aria-current", "step");
      else tab.removeAttribute("aria-current");
    });
    back.textContent = active === 0 ? "← Close" : "← Back";
    next.textContent = active === names.length - 1 ? "Close" : "Next: " + names[active + 1];
    if (!preserveScroll) content.scrollTop = 0;
  }

  function sync() {
    // Process Serve has a specialized workflow; leave its native screen intact.
    const route = content.querySelector(":scope > .route-stack");
    const title = content.querySelector(":scope > #jobModalTitle");
    if (!route || !title) {
      groups = null;
      sheet.classList.remove("mg-detail-steps");
      currentJob = "";
      return;
    }
    const number = title.textContent.trim();
    if (number !== currentJob) active = 0;
    currentJob = number;
    groups = [[], [], []];
    let group = 0;
    for (const node of Array.from(content.children)) {
      if (node.classList.contains("modal-section-title") &&
          node.textContent.trim().toLowerCase() === "route") group = 1;
      if (node.classList.contains("workflow-panel") ||
          (group === 1 && node.classList.contains("modal-note"))) group = 2;
      groups[group].push(node);
    }
    sheet.classList.add("mg-detail-steps");
    show(active);
  }

  back.addEventListener("click", () => {
    if (active === 0) close.click();
    else show(active - 1);
  });
  next.addEventListener("click", () => {
    if (active === names.length - 1) close.click();
    else show(active + 1);
  });
  close.addEventListener("click", () => { active = 0; currentJob = ""; });

  // Re-render after a driver action without discarding an in-progress state.
  const observer = new MutationObserver(sync);
  observer.observe(content, {childList:true});
  sync();
})();
