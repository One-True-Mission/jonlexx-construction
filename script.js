/* JonLexx Construction - shared behavior */

(function () {
  "use strict";

  /* Active nav state */
  var page = document.body.getAttribute("data-page");
  document.querySelectorAll(".nav-links a[data-nav]").forEach(function (link) {
    if (link.getAttribute("data-nav") === page) {
      link.classList.add("is-active");
    }
  });

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* Carousels.
     reviews: one card per view, auto-rotates.
     gallery: featured-center layout. Active slide centered full size,
     previous slide visible on the left, next slide on the right,
     both scaled down and dimmed. Auto-rotates. */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    var type = carousel.getAttribute("data-carousel");
    var track = carousel.querySelector(".carousel-track");
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = carousel.querySelector(".carousel-dots");
    var viewport = carousel.querySelector(".carousel-viewport");
    var index = 0;
    var timer = null;
    var delay = type === "gallery" ? 4500 : 6500;

    function gap() {
      return parseFloat(getComputedStyle(track).gap) || 24;
    }

    function goTo(n) {
      index = (n + slides.length) % slides.length;
      /* offsetWidth: layout width, unaffected by the scale() on side slides */
      var w = slides[0].offsetWidth;
      var offset;
      if (type === "gallery") {
        /* center the active slide in the viewport */
        var vw = viewport.offsetWidth;
        offset = index * (w + gap()) - (vw - w) / 2;
        slides.forEach(function (s, i) {
          s.classList.toggle("is-active", i === index);
        });
      } else {
        offset = index * (w + gap());
      }
      track.style.transform = "translateX(" + (-offset) + "px)";
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.classList.toggle("active", i === index);
      });
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function start() {
      if (reduce) return;
      stop();
      timer = setInterval(function () { goTo(index + 1); }, delay);
    }

    function buildDots() {
      dotsWrap.innerHTML = "";
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.className = "carousel-dot" + (i === index ? " active" : "");
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        dot.addEventListener("click", function () { goTo(i); start(); });
        dotsWrap.appendChild(dot);
      });
    }

    carousel.querySelectorAll(".carousel-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        goTo(index + (btn.getAttribute("data-dir") === "next" ? 1 : -1));
        start();
      });
    });

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { goTo(index); }, 150);
    });

    buildDots();
    goTo(0);
    start();
  });

  /* Basic form validation feedback */
  var form = document.getElementById("consult-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      var required = form.querySelectorAll("[required]");
      var ok = true;
      required.forEach(function (field) {
        if (!field.value.trim()) {
          ok = false;
          field.style.borderColor = "#b0453a";
        } else {
          field.style.borderColor = "";
        }
      });
      if (!ok) e.preventDefault();
    });
  }
})();
