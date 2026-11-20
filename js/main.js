(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("#site-nav");

  if (header && toggle && nav) {
    var links = Array.prototype.slice.call(nav.querySelectorAll("a"));

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
    }

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!open);
    });

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) setOpen(false);
    });

    if ("IntersectionObserver" in window) {
      var sections = links
        .map(function (link) {
          return document.querySelector(link.getAttribute("href"));
        })
        .filter(Boolean);

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (link) {
              link.removeAttribute("aria-current");
            });
            var current = nav.querySelector('a[href="#' + entry.target.id + '"]');
            if (current) current.setAttribute("aria-current", "true");
          });
        },
        { rootMargin: "-45% 0px -48% 0px", threshold: 0 }
      );

      sections.forEach(function (section) {
        observer.observe(section);
      });
    }
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!reduce && "IntersectionObserver" in window) {
    var revealNodes = document.querySelectorAll(".reveal");
    revealNodes.forEach(function (el) {
      var parent = el.parentElement;
      if (!parent) return;
      var siblings = parent.querySelectorAll(":scope > .reveal");
      var index = Array.prototype.indexOf.call(siblings, el);
      if (index > 0) el.style.transitionDelay = Math.min(index, 5) * 55 + "ms";
    });
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -32px 0px", threshold: 0.01 }
    );
    revealNodes.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  var glow = document.querySelector(".cursor-glow");
  if (glow && fine && !reduce) {
    document.body.classList.add("has-glow");
    window.addEventListener(
      "pointermove",
      function (event) {
        glow.style.transform = "translate3d(" + event.clientX + "px," + event.clientY + "px,0)";
      },
      { passive: true }
    );
  }

  if (fine && !reduce) {
    document.querySelectorAll(".project").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        var px = (event.clientX - rect.left) / rect.width - 0.5;
        var py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--ry", (px * 5).toFixed(2) + "deg");
        card.style.setProperty("--rx", (-py * 4).toFixed(2) + "deg");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    });
  }

  if (window.PortfolioI18n) window.PortfolioI18n.init();
})();
