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

  /* Carousels (reviews + gallery) */
  function slidesPerView() {
    var w = window.innerWidth;
    if (w <= 560) return 1;
    if (w <= 1100) return 2;
    return 3;
  }

  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    var track = carousel.querySelector(".carousel-track");
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = carousel.querySelector(".carousel-dots");
    var index = 0;

    function pageCount() {
      return Math.max(1, slides.length - slidesPerView() + 1);
    }

    function buildDots() {
      dotsWrap.innerHTML = "";
      for (var i = 0; i < pageCount(); i++) {
        var dot = document.createElement("button");
        dot.className = "carousel-dot" + (i === index ? " active" : "");
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        (function (n) {
          dot.addEventListener("click", function () { goTo(n); });
        })(i);
        dotsWrap.appendChild(dot);
      }
    }

    function goTo(n) {
      var max = pageCount() - 1;
      index = Math.max(0, Math.min(n, max));
      var slide = slides[0];
      var gap = parseFloat(getComputedStyle(track).gap) || 24;
      var offset = index * (slide.getBoundingClientRect().width + gap);
      track.style.transform = "translateX(-" + offset + "px)";
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.classList.toggle("active", i === index);
      });
    }

    carousel.querySelectorAll(".carousel-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        goTo(index + (btn.getAttribute("data-dir") === "next" ? 1 : -1));
      });
    });

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        buildDots();
        goTo(index);
      }, 150);
    });

    buildDots();
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
