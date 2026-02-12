// =========================================================
//  Festbau — GSAP Animation Engine
//  Smooth, professional scroll-driven animations
//  Built for performance: only transforms & opacity (GPU)
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

  // ── 0  Override existing CSS animations ──────────────────
  var animSelectors =
    ".fade-in-up, .fade-in, .slide-in-left, .slide-in-right, " +
    ".scale-in, .reveal, .reveal-left, .reveal-right, " +
    ".reveal-scale, .animate-on-scroll";

  document.querySelectorAll(animSelectors).forEach(function (el) {
    el.style.animation = "none";
    el.style.animationDelay = "0s";
  });

  // ── 1  Hero Section (runs on page load) ──────────────────
  (function heroAnimation() {
    var hero = document.querySelector("main > section:first-child");
    if (!hero) return;

    var tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 0.8 * speed },
    });

    // a) Background image — cinematic settle
    var bgImg = hero.querySelector("img.object-cover") ||
                hero.querySelector("img[class*='object-cover']");
    if (bgImg) {
      gsap.fromTo(
        bgImg,
        { scale: 1.06, opacity: 0.6 },
        { scale: 1, opacity: 1, duration: 2 * speed, ease: "power2.out" }
      );
    }

    // b) Hero content — staggered entrance
    var contentWrap = hero.querySelector("[data-gsap='hero-content']");
    if (contentWrap) {
      var children = Array.from(contentWrap.querySelectorAll(":scope > *"));
      tl.fromTo(
        children,
        { opacity: 0, y: 40 * dist },
        {
          opacity: 1, y: 0,
          stagger: 0.12,
          clearProps: "transform",
        },
        0.3
      );
    }

    // c) Floating badge (ISO, etc.) — slide from right
    var badge = hero.querySelector("[data-gsap='hero-badge']");
    if (badge) {
      tl.fromTo(
        badge,
        { opacity: 0, x: 50 * dist, y: 10 * dist },
        {
          opacity: 1, x: 0, y: 0,
          duration: 0.9 * speed,
          ease: "back.out(1.3)",
          clearProps: "transform",
        },
        0.7
      );
    }
  })();

  // ── 2  Scroll-triggered fade-up ──────────────────────────
  gsap.utils
    .toArray(".fade-in-up, .reveal, .animate-on-scroll, [data-gsap='fade-up']")
    .forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 * dist },
        {
          opacity: 1, y: 0,
          duration: 0.7 * speed,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
    });

  // ── 3  Scroll-triggered fade-in (no movement) ───────────
  gsap.utils
    .toArray(".fade-in, [data-gsap='fade-in']")
    .forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8 * speed,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
    });

  // ── 4  Slide from left ───────────────────────────────────
  gsap.utils
    .toArray(".slide-in-left, .reveal-left, [data-gsap='slide-left']")
    .forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, x: -40 * dist },
        {
          opacity: 1, x: 0,
          duration: 0.8 * speed,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }
      );
    });

  // ── 5  Slide from right ──────────────────────────────────
  gsap.utils
    .toArray(".slide-in-right, .reveal-right, [data-gsap='slide-right']")
    .forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, x: 40 * dist },
        {
          opacity: 1, x: 0,
          duration: 0.8 * speed,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }
      );
    });

  // ── 6  Scale in ──────────────────────────────────────────
  gsap.utils
    .toArray(".scale-in, .reveal-scale, [data-gsap='scale-in']")
    .forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1, scale: 1,
          duration: 0.6 * speed,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }
      );
    });

  // ── 7  Stagger grids ────────────────────────────────────
  gsap.utils
    .toArray("[data-gsap='stagger'], .stagger-children")
    .forEach(function (container) {
      var items = container.children;
      gsap.set(items, { opacity: 0 });
      gsap.fromTo(
        items,
        { opacity: 0, y: 35 * dist },
        {
          opacity: 1, y: 0,
          duration: 0.55 * speed,
          stagger: 0.1,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: { trigger: container, start: "top 85%", once: true },
        }
      );
    });

  // ── 8  Split content (text + image side by side) ────────
  gsap.utils.toArray("[data-gsap='split']").forEach(function (container) {
    var left = container.querySelector("[data-gsap='split-left']");
    var right = container.querySelector("[data-gsap='split-right']");
    var tl = gsap.timeline({
      scrollTrigger: { trigger: container, start: "top 82%", once: true },
    });

    if (left) {
      tl.fromTo(
        left,
        { opacity: 0, x: -30 * dist },
        {
          opacity: 1, x: 0,
          duration: 0.8 * speed,
          ease: "power3.out",
          clearProps: "transform",
        }
      );
    }
    if (right) {
      tl.fromTo(
        right,
        { opacity: 0, x: 30 * dist },
        {
          opacity: 1, x: 0,
          duration: 0.8 * speed,
          ease: "power3.out",
          clearProps: "transform",
        },
        left ? "-=0.5" : 0
      );
    }
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
      "h2, h3, p, a.bg-white, a.bg-primary, a.bg-accent-yellow, .text-5xl, .text-4xl, .text-3xl"
    );
    if (!els.length) return;
    gsap.fromTo(
      els,
      { opacity: 0, y: 25 * dist },
      {
        opacity: 1, y: 0,
        duration: 0.7 * speed,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: { trigger: section, start: "top 85%", once: true },
      }
    );
  });

  // ── 11  Footer columns stagger ──────────────────────────
  (function footerAnimation() {
    var footer = document.querySelector("footer");
    if (!footer) return;

    var columns = footer.querySelectorAll(".grid > div");
    var bottomBar = footer.querySelector(".pt-12.border-t");

    if (columns.length) {
      gsap.fromTo(
        columns,
        { opacity: 0, y: 25 * dist },
        {
          opacity: 1, y: 0,
          duration: 0.6 * speed,
          stagger: 0.12,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: { trigger: footer, start: "top 92%", once: true },
        }
      );
    }

    if (bottomBar) {
      gsap.fromTo(
        bottomBar,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5 * speed,
          ease: "power2.out",
          scrollTrigger: { trigger: bottomBar, start: "top 96%", once: true },
        }
      );
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

  // ── 13  Hover lift micro-interaction ────────────────────
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

  // ── 14  Parallax backgrounds ────────────────────────────
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

  // ── Refresh ScrollTrigger after all images load ─────────
  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
})();
