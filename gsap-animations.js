// =========================================================
//  Festbau — GSAP Animation Engine
//  Smooth, professional scroll-driven animations
//  Built for performance: only transforms & opacity (GPU)
//  Single source of truth — no CSS @keyframes conflicts
// =========================================================

(function () {
  "use strict";

  gsap.registerPlugin(ScrollTrigger);

  // ── Preferences ──────────────────────────────────────────
  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var dist = prefersReduced ? 0 : 1;
  var speed = prefersReduced ? 0.01 : 1;

  // ── Mobile detection ─────────────────────────────────────
  var isMobile = window.innerWidth < 768;

  // Reduced motion values for mobile to prevent overflow
  var xDist = isMobile ? 20 : 50;   // horizontal slide distance
  var xDistSm = isMobile ? 15 : 40; // smaller horizontal slide
  var yDist = isMobile ? 25 : 40;   // vertical reveal distance
  var yDistHero = isMobile ? 20 : 50; // hero vertical distance

  // ── Helper: check if element is visible ──────────────────
  function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  // ── Helper: filter to visible elements only ──────────────
  function filterVisible(els) {
    return Array.prototype.filter.call(els, function (el) {
      return isVisible(el);
    });
  }

  // ── 1  Hero Section (runs on page load) ──────────────────
  (function heroAnimation() {
    var hero = document.querySelector("main > section:first-child");
    if (!hero) return;

    // a) Background image — cinematic settle
    var bgImg = hero.querySelector("img.object-cover") ||
                hero.querySelector("img[class*='object-cover']");
    if (bgImg) {
      gsap.fromTo(
        bgImg,
        { scale: 1.05, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 1.8 * speed, ease: "power2.out" }
      );
    }

    // b) Hero content — smooth staggered entrance
    var contentWrap = hero.querySelector("[data-gsap='hero-content']");
    if (contentWrap) {
      var children = filterVisible(contentWrap.querySelectorAll(":scope > *"));

      gsap.set(children, { opacity: 0, y: yDistHero * dist });

      var tl = gsap.timeline({ delay: 0.2 });
      children.forEach(function (child, i) {
        tl.to(child, {
          opacity: 1,
          y: 0,
          duration: 0.8 * speed,
          ease: "power3.out",
          clearProps: "transform"
        }, i * 0.15);
      });
    }

    // c) Floating badge (ISO, etc.) — only on desktop
    var badge = hero.querySelector("[data-gsap='hero-badge']");
    if (badge && isVisible(badge)) {
      gsap.fromTo(
        badge,
        { opacity: 0, x: xDist * dist, y: 10 * dist },
        {
          opacity: 1, x: 0, y: 0,
          duration: 1.0 * speed,
          ease: "power3.out",
          delay: 0.8,
          clearProps: "transform",
        }
      );
    }
  })();

  // ── 2  Scroll-triggered fade-up ──────────────────────────
  gsap.utils
    .toArray(".fade-in-up, .reveal, .animate-on-scroll, [data-gsap='fade-up']")
    .forEach(function (el) {
      // Skip elements inside hero (already animated by hero timeline)
      if (el.closest("main > section:first-child [data-gsap='hero-content']")) return;

      gsap.set(el, { opacity: 0, y: yDist * dist });

      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: function () {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.8 * speed,
            ease: "power3.out",
            clearProps: "transform"
          });
        }
      });
    });

  // ── 3  Scroll-triggered fade-in (no movement) ───────────
  gsap.utils
    .toArray(".fade-in, [data-gsap='fade-in']")
    .forEach(function (el) {
      gsap.set(el, { opacity: 0 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: function () {
          gsap.to(el, {
            opacity: 1,
            duration: 0.9 * speed,
            ease: "power2.out"
          });
        }
      });
    });

  // ── 4  Slide from left ───────────────────────────────────
  gsap.utils
    .toArray(".slide-in-left, .reveal-left, [data-gsap='slide-left']")
    .forEach(function (el) {
      gsap.set(el, { opacity: 0, x: -xDist * dist });

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: function () {
          gsap.to(el, {
            opacity: 1,
            x: 0,
            duration: 0.9 * speed,
            ease: "power3.out",
            clearProps: "transform"
          });
        }
      });
    });

  // ── 5  Slide from right ──────────────────────────────────
  gsap.utils
    .toArray(".slide-in-right, .reveal-right, [data-gsap='slide-right']")
    .forEach(function (el) {
      gsap.set(el, { opacity: 0, x: xDist * dist });

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: function () {
          gsap.to(el, {
            opacity: 1,
            x: 0,
            duration: 0.9 * speed,
            ease: "power3.out",
            clearProps: "transform"
          });
        }
      });
    });

  // ── 6  Scale in ──────────────────────────────────────────
  gsap.utils
    .toArray(".scale-in, .reveal-scale, [data-gsap='scale-in']")
    .forEach(function (el) {
      gsap.set(el, { opacity: 0, scale: 0.93 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: function () {
          gsap.to(el, {
            opacity: 1,
            scale: 1,
            duration: 0.7 * speed,
            ease: "power2.out",
            clearProps: "transform"
          });
        }
      });
    });

  // ── 7  Stagger grids ────────────────────────────────────
  gsap.utils
    .toArray("[data-gsap='stagger'], .stagger-children")
    .forEach(function (container) {
      var items = filterVisible(container.children);
      if (!items.length) return;

      gsap.set(items, { opacity: 0, y: yDist * dist });

      ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        once: true,
        onEnter: function () {
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.7 * speed,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "transform"
          });
        }
      });
    });

  // ── 8  Split content (text + image side by side) ────────
  gsap.utils.toArray("[data-gsap='split']").forEach(function (container) {
    var left = container.querySelector("[data-gsap='split-left']");
    var right = container.querySelector("[data-gsap='split-right']");

    if (left) gsap.set(left, { opacity: 0, x: -xDistSm * dist });
    if (right) gsap.set(right, { opacity: 0, x: xDistSm * dist });

    ScrollTrigger.create({
      trigger: container,
      start: "top 82%",
      once: true,
      onEnter: function () {
        if (left) {
          gsap.to(left, {
            opacity: 1,
            x: 0,
            duration: 0.9 * speed,
            ease: "power3.out",
            clearProps: "transform"
          });
        }
        if (right) {
          gsap.to(right, {
            opacity: 1,
            x: 0,
            duration: 0.9 * speed,
            delay: 0.2,
            ease: "power3.out",
            clearProps: "transform"
          });
        }
      }
    });
  });

  // ── 9  Counter animation ─────────────────────────────────
  gsap.utils.toArray("[data-gsap='counter']").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-target")) || 0;
    var decimals = parseInt(el.getAttribute("data-decimals")) || 0;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: function () {
        gsap.to(obj, {
          val: target,
          duration: 2 * speed,
          ease: "power1.inOut",
          onUpdate: function () {
            el.textContent =
              prefix +
              (decimals > 0 ? obj.val.toFixed(decimals) : Math.ceil(obj.val)) +
              suffix;
          },
        });
      },
    });
  });

  // ── 10  CTA sections ────────────────────────────────────
  gsap.utils.toArray("[data-gsap='cta']").forEach(function (section) {
    var els = section.querySelectorAll(
      "h2, h3, p, a.bg-white, a.bg-primary, a.bg-accent-yellow, .text-5xl, .text-4xl, .text-3xl, span.material-symbols-outlined"
    );
    if (!els.length) return;

    gsap.set(els, { opacity: 0, y: (isMobile ? 20 : 30) * dist });

    ScrollTrigger.create({
      trigger: section,
      start: "top 85%",
      once: true,
      onEnter: function () {
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 0.8 * speed,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "transform"
        });
      }
    });
  });

  // ── 11  Footer columns stagger ──────────────────────────
  (function footerAnimation() {
    var footer = document.querySelector("footer");
    if (!footer) return;

    var columns = footer.querySelectorAll(".grid > div");
    var bottomBar = footer.querySelector(".pt-12.border-t");

    if (columns.length) {
      gsap.set(columns, { opacity: 0, y: (isMobile ? 15 : 30) * dist });

      ScrollTrigger.create({
        trigger: footer,
        start: "top 92%",
        once: true,
        onEnter: function () {
          gsap.to(columns, {
            opacity: 1,
            y: 0,
            duration: 0.7 * speed,
            stagger: 0.15,
            ease: "power3.out",
            clearProps: "transform"
          });
        }
      });
    }

    if (bottomBar) {
      gsap.set(bottomBar, { opacity: 0 });

      ScrollTrigger.create({
        trigger: bottomBar,
        start: "top 96%",
        once: true,
        onEnter: function () {
          gsap.to(bottomBar, {
            opacity: 1,
            duration: 0.6 * speed,
            ease: "power2.out"
          });
        }
      });
    }
  })();

  // ── 12  Image clip-path reveals ─────────────────────────
  gsap.utils.toArray("[data-gsap='clip-reveal']").forEach(function (el) {
    gsap.fromTo(
      el,
      { clipPath: "inset(0 100% 0 0)" },
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.0 * speed,
        ease: "power3.inOut",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      }
    );
  });

  // ── 13  Hover lift micro-interaction (desktop only) ─────
  if (!isMobile) {
    document
      .querySelectorAll("[data-gsap='hover-lift']")
      .forEach(function (el) {
        el.addEventListener("mouseenter", function () {
          gsap.to(el, { y: -5, duration: 0.3, ease: "power2.out" });
        });
        el.addEventListener("mouseleave", function () {
          gsap.to(el, { y: 0, duration: 0.3, ease: "power2.out" });
        });
      });
  }

  // ── 14  Parallax backgrounds (desktop only) ─────────────
  if (!isMobile) {
    gsap.utils.toArray("[data-gsap='parallax']").forEach(function (el) {
      var sp = parseFloat(el.getAttribute("data-speed")) || 0.15;
      gsap.to(el, {
        yPercent: sp * 30,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section") || el.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }

  // ── 15  Timeline bars (modular-prefabrications) ─────────
  (function timelineBars() {
    var section = document.getElementById("timeline-section");
    if (!section) return;

    var bars = section.querySelectorAll(".timeline-bar");
    if (!bars.length) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      once: true,
      onEnter: function () {
        bars.forEach(function (bar) {
          bar.classList.add("animate");
        });
      }
    });
  })();

  // ── Refresh ScrollTrigger after all images load ─────────
  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
})();
