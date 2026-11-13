(function () {
  const menuStyles = document.createElement("style");

  menuStyles.textContent = `
    .mg-menu-button {
      width: 48px;
      height: 48px;
      border: 0;
      border-radius: 13px;
      background: #ffffff;
      color: #064f3b;
      font-size: 27px;
      font-weight: 900;
      cursor: pointer;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }

    .mg-menu-overlay {
      position: fixed;
      inset: 0;
      z-index: 998;
      background: rgba(0, 0, 0, 0.45);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease;
    }

    .mg-menu-overlay.open {
      opacity: 1;
      visibility: visible;
    }

    .mg-side-menu {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 999;
      width: min(330px, 88vw);
      height: 100vh;
      background: #ffffff;
      color: #17221e;
      transform: translateX(100%);
      transition: transform 0.25s ease;
      box-shadow: -12px 0 35px rgba(0, 0, 0, 0.18);
      display: flex;
      flex-direction: column;
    }

    .mg-side-menu.open {
      transform: translateX(0);
    }

    .mg-menu-header {
      background: #064f3b;
      color: #ffffff;
      padding: 24px 20px;
    }

    .mg-menu-brand {
      font-size: 22px;
      font-weight: 900;
    }

    .mg-menu-brand span {
      color: #ff665c;
    }

    .mg-menu-user {
      margin-top: 7px;
      font-size: 13px;
      opacity: 0.82;
      overflow-wrap: anywhere;
    }

    .mg-menu-close {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 42px;
      height: 42px;
      border: 0;
      border-radius: 11px;
      background: #ffffff;
      color: #064f3b;
      font-size: 24px;
      font-weight: 900;
      cursor: pointer;
    }

    .mg-menu-links {
      padding: 18px 14px;
      display: grid;
      gap: 8px;
      overflow-y: auto;
    }

    .mg-menu-link {
      display: flex;
      align-items: center;
      gap: 13px;
      min-height: 57px;
      padding: 13px 15px;
      border-radius: 13px;
      color: #17221e;
      text-decoration: none;
      font-size: 16px;
      font-weight: 800;
    }

    .mg-menu-link:hover,
    .mg-menu-link.active {
      background: #e7f5ef;
      color: #087455;
    }

    .mg-menu-icon {
      width: 30px;
      text-align: center;
      font-size: 21px;
    }

    .mg-menu-footer {
      margin-top: auto;
      padding: 15px;
      border-top: 1px solid #dfe8e4;
    }

    .mg-menu-signout {
      width: 100%;
      min-height: 54px;
      border: 0;
      border-radius: 13px;
      background: #fff0f0;
      color: #9b2929;
      font-size: 16px;
      font-weight: 900;
      cursor: pointer;
    }

    body.mg-menu-open {
      overflow: hidden;
    }

    /* Match the compact dispatch navigation on phones; keep desktop as-is. */
    @media (max-width:720px) {
      .mg-side-menu {
        width:min(92vw,390px);
        max-width:100vw;
        height:100dvh;
        overflow:hidden;
        border-radius:17px 0 0 17px;
      }
      .mg-menu-header {
        flex:0 0 auto;
        min-height:79px;
        padding:16px 59px 14px 15px;
      }
      .mg-menu-brand {font-size:19px;line-height:1.15;white-space:nowrap;}
      .mg-menu-user {
        margin-top:5px;
        font-size:11px;
        line-height:1.2;
        max-height:27px;
        overflow:hidden;
      }
      .mg-menu-close {
        width:44px;height:44px;top:13px;right:12px;
        border-radius:12px;
      }
      .mg-menu-links {
        flex:1 1 auto;
        min-height:0;
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        grid-auto-rows:minmax(62px,max-content);
        align-content:start;
        gap:8px;
        padding:12px;
        background:#f5f9f7;
        overscroll-behavior:contain;
      }
      .mg-menu-link {
        min-width:0;
        min-height:62px;
        margin:0;
        padding:9px;
        border-radius:12px;
        border:1px solid #e0eae5;
        background:white;
        display:flex;
        align-items:center;
        gap:7px;
        color:#203d30;
        font-size:13px;
        line-height:1.2;
        overflow-wrap:anywhere;
      }
      .mg-menu-link.active {
        border-color:#c6e4d6;
        background:#e7f5ef;
        color:#087455;
      }
      .mg-menu-icon {width:23px;flex:0 0 23px;font-size:20px;}
      .mg-menu-footer {
        flex:0 0 auto;
        margin-top:auto;
        padding:10px 12px max(11px,env(safe-area-inset-bottom));
      }
      .mg-menu-signout {min-height:46px;font-size:14px;border-radius:12px;}
    }
    @media (max-width:350px) {
      .mg-menu-links {gap:6px;padding:9px;}
      .mg-menu-link {font-size:12px;padding:7px;}
    }
  `;

  document.head.appendChild(menuStyles);

  const currentPage =
    window.location.pathname.split("/").pop() || "driver.html";

  const pages = [
    {
      href: "/driver.html",
      label: "Current Jobs",
      icon: "📦"
    },
    {
      href: "/pay.html",
      label: "My Pay",
      icon: "💵"
    },
    {
      href: "/completed-today.html",
      label: "Completed Today",
      icon: "✅"
    },
    {
      href: "/profile.html",
      label: "My Profile",
      icon: "👤"
    }
  ];

  const overlay = document.createElement("div");
  overlay.className = "mg-menu-overlay";
  overlay.id = "mgMenuOverlay";

  const menu = document.createElement("aside");
  menu.className = "mg-side-menu";
  menu.id = "mgSideMenu";

  menu.innerHTML = `
    <div class="mg-menu-header">
      <button
        class="mg-menu-close"
        id="mgMenuClose"
        type="button"
        aria-label="Close menu"
      >
        ×
      </button>

      <div class="mg-menu-brand">
        MG <span>EXPRESS</span> DRIVER
      </div>

      <div class="mg-menu-user" id="mgMenuUser"></div>
    </div>

    <nav class="mg-menu-links">
      ${pages.map(page => {
        const pageName = page.href.split("/").pop();
        const active = pageName === currentPage ? "active" : "";

        return `
          <a
            class="mg-menu-link ${active}"
            href="${page.href}"
          >
            <span class="mg-menu-icon">${page.icon}</span>
            <span>${page.label}</span>
          </a>
        `;
      }).join("")}
    </nav>

    <div class="mg-menu-footer">
      <button
        class="mg-menu-signout"
        id="mgMenuSignOut"
        type="button"
      >
        Sign Out
      </button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(menu);

  const openButton = document.createElement("button");

  openButton.className = "mg-menu-button";
  openButton.id = "mgMenuButton";
  openButton.type = "button";
  openButton.setAttribute("aria-label", "Open menu");
  openButton.textContent = "☰";

  function findHeader() {
    return (
      document.querySelector(".topbar") ||
      document.querySelector("header")
    );
  }

  const header = findHeader();

  if (header) {
    const existingSignOut =
      header.querySelector("#signOutButton") ||
      header.querySelector(".signout");

    if (existingSignOut) {
      existingSignOut.style.display = "none";
    }

    header.appendChild(openButton);
  } else {
    openButton.style.position = "fixed";
    openButton.style.top = "15px";
    openButton.style.right = "15px";
    openButton.style.zIndex = "997";
    document.body.appendChild(openButton);
  }

  function openMenu() {
    menu.classList.add("open");
    overlay.classList.add("open");
    document.body.classList.add("mg-menu-open");
  }

  function closeMenu() {
    menu.classList.remove("open");
    overlay.classList.remove("open");
    document.body.classList.remove("mg-menu-open");
  }

  openButton.addEventListener("click", openMenu);

  document
    .getElementById("mgMenuClose")
    .addEventListener("click", closeMenu);

  overlay.addEventListener("click", closeMenu);

  document
    .getElementById("mgMenuSignOut")
    .addEventListener("click", async function () {
      this.disabled = true;
      this.textContent = "Signing Out…";

      try {
        if (window.mgSupabaseClient) {
          await window.mgSupabaseClient.auth.signOut({ scope: "local" });
        } else if (window.client) {
          await window.client.auth.signOut({ scope: "local" });
        }
      } finally {
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace("/index.html");
      }
    });

  window.addEventListener("mg-driver-ready", function (event) {
    const details = event.detail || {};

    document.getElementById("mgMenuUser").textContent =
      details.name || details.email || "MG Express Driver";
  });
})();
