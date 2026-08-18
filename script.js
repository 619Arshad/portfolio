/* ==========================================================================
   SETUP
   ========================================================================== */
gsap.registerPlugin(ScrollTrigger);

const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --------------------------------------------------------------------------
   TEXT SPLITTING HELPER (DOM prep only — GSAP does the actual animating)
   -------------------------------------------------------------------------- */
function splitWords(el){
  const text = el.textContent.trim();
  el.innerHTML = "";
  text.split(" ").forEach((word, i, arr) => {
    const w = document.createElement("span");
    w.className = "word";
    w.style.display = "inline-block";
    w.style.willChange = "transform";
    w.textContent = word + (i < arr.length - 1 ? "\u00A0" : "");
    el.appendChild(w);
  });
  return el.querySelectorAll(".word");
}

/* ==========================================================================
   LOADER
   ========================================================================== */
function runLoader(onComplete){
  const countEl = document.getElementById("loaderCount");
  const barEl = document.getElementById("loaderBar");
  const loaderEl = document.getElementById("loader");
  const counter = { val: 0 };

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(loaderEl, {
        yPercent: -100,
        duration: 1.1,
        ease: "power4.inOut",
        onComplete: () => {
          loaderEl.style.display = "none";
          onComplete();
        }
      });
    }
  });

  tl.to(counter, {
    val: 100,
    duration: 2.2,
    ease: "power2.inOut",
    onUpdate: () => {
      const v = Math.floor(counter.val);
      countEl.textContent = v;
      barEl.style.width = v + "%";
    }
  });
}

/* ==========================================================================
   CUSTOM CURSOR
   ========================================================================== */
function initCursor(){
  if (isTouch) return;

  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const label = document.getElementById("cursorLabel");

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { x: pos.x, y: pos.y };

  window.addEventListener("mousemove", (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    gsap.to(dot, { x: pos.x, y: pos.y, duration: 0.1, ease: "power2.out" });
  });

  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.16;
    ringPos.y += (pos.y - ringPos.y) * 0.16;
    gsap.set(ring, { x: ringPos.x, y: ringPos.y });
  });

  document.querySelectorAll("[data-cursor='link']").forEach(el => {
    el.addEventListener("mouseenter", () => {
      ring.classList.add("is-link");
      gsap.to(ring, { width: 64, height: 64, duration: 0.35, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => {
      ring.classList.remove("is-link");
      gsap.to(ring, { width: 44, height: 44, duration: 0.35, ease: "power3.out" });
    });
  });

  document.querySelectorAll("[data-cursor='view']").forEach(el => {
    el.addEventListener("mouseenter", () => {
      ring.classList.add("is-view");
      label.textContent = "View";
      gsap.to(ring, { width: 84, height: 84, duration: 0.35, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => {
      ring.classList.remove("is-view");
      gsap.to(ring, { width: 44, height: 44, duration: 0.35, ease: "power3.out" });
    });
  });
}

/* ==========================================================================
   MAGNETIC BUTTONS
   ========================================================================== */
function initMagnetic(){
  if (isTouch) return;
  document.querySelectorAll(".magnetic").forEach(el => {
    const strength = 0.4;
    el.addEventListener("mousemove", (e) => {
      const b = el.getBoundingClientRect();
      const relX = e.clientX - (b.left + b.width / 2);
      const relY = e.clientY - (b.top + b.height / 2);
      gsap.to(el, {
        x: relX * strength,
        y: relY * strength,
        duration: 0.5,
        ease: "power3.out"
      });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
    });
  });
}

/* ==========================================================================
   NAVBAR — hide on scroll down, show on scroll up + background shift
   ========================================================================== */
function initNav(){
  const nav = document.getElementById("nav");
  let lastY = window.scrollY;

  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const y = window.scrollY;
      if (y > 140 && self.direction === 1) {
        gsap.to(nav, { yPercent: -140, duration: 0.5, ease: "power3.out" });
      } else {
        gsap.to(nav, { yPercent: 0, duration: 0.5, ease: "power3.out" });
      }
      lastY = y;
    }
  });

  const burger = document.getElementById("navBurger");
  const menu = document.getElementById("mobileMenu");
  if (burger){
    burger.addEventListener("click", () => {
      menu.classList.toggle("is-open");
    });
    menu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => menu.classList.remove("is-open"));
    });
  }
}

/* ==========================================================================
   HERO ENTRANCE
   ========================================================================== */
function heroEntrance(){
  const lineInners = document.querySelectorAll(".hero-title .split-inner");
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.set(lineInners, { yPercent: 120 })
    .set(".hero-noise-shape", { scale: 0.6, opacity: 0 })
    .to(".eyebrow.reveal-line span", { opacity: 1, y: 0, duration: 0.8 }, 0.1)
    .to(lineInners, { yPercent: 0, duration: 1.2, stagger: 0.12 }, 0.15)
    .to(".hero-noise-shape", { scale: 1, opacity: 0.35, duration: 1.6, ease: "power3.out" }, 0.2)
    .to(".hero-sub.reveal-line span", { opacity: 1, y: 0, duration: 1 }, "-=0.7")
    .to(".hero-cta-group .btn", { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, "-=0.8")
    .to(".hero-float", { opacity: 1, duration: 1, stagger: 0.15 }, "-=0.6")
    .to(".scroll-cue", { opacity: 1, duration: 0.8 }, "-=0.4")
    .to(".nav", { opacity: 1, duration: 0.6 }, "-=1.4");
}

/* ==========================================================================
   FLOATING / AMBIENT CONTINUOUS ANIMATION
   ========================================================================== */
function ambientFloats(){
  if (prefersReduced) return;
  gsap.to(".hero-float-1", { y: -26, x: 10, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to(".hero-float-2", { y: 22, x: -14, duration: 6.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to(".hero-float-3", { y: -16, x: -8, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to(".hero-noise-shape", { rotate: 360, duration: 40, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
}

/* ==========================================================================
   SCROLL REVEALS — eyebrow / section titles / generic reveal-lines
   ========================================================================== */
function scrollReveals(){
  // Section titles built with reveal-line > span
  document.querySelectorAll(".section-title.reveal-line, .contact-title.reveal-line").forEach(el => {
    const spanEl = el.querySelector("span");
    const words = splitWords(spanEl);
    gsap.set(words, { yPercent: 110, opacity: 0 });
    gsap.to(words, {
      yPercent: 0,
      opacity: 1,
      duration: 1,
      ease: "power4.out",
      stagger: 0.03,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      }
    });
  });

  // About paragraph — word by word fade as it enters
  const aboutText = document.getElementById("aboutText");
  if (aboutText){
    const words = splitWords(aboutText);
    gsap.set(words, { opacity: 0.15 });
    gsap.to(words, {
      opacity: 1,
      stagger: 0.02,
      ease: "none",
      scrollTrigger: {
        trigger: aboutText,
        start: "top 80%",
        end: "bottom 40%",
        scrub: 0.6
      }
    });
  }

  // Stats stagger + counters
  gsap.from("[data-stagger]", {
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.12,
    scrollTrigger: {
      trigger: ".about-stats",
      start: "top 82%"
    }
  });

  document.querySelectorAll(".stat-num").forEach(el => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const counter = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => { el.textContent = Math.floor(counter.val); }
        });
      }
    });
  });

  // Service cards
  gsap.utils.toArray(".service-card").forEach((card, i) => {
    gsap.from(card, {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 90%"
      },
      delay: (i % 4) * 0.08
    });
  });

  // Project cards
  gsap.utils.toArray(".project-card").forEach(card => {
    const media = card.querySelector(".project-media");
    const info = card.querySelectorAll(".project-info > *");
    gsap.set(media, { clipPath: "inset(8% 8% 8% 8% round 18px)", opacity: 0 });
    gsap.to(media, {
      clipPath: "inset(0% 0% 0% 0% round 18px)",
      opacity: 1,
      duration: 1.1,
      ease: "power4.out",
      scrollTrigger: { trigger: card, start: "top 82%" }
    });
    gsap.from(info, {
      y: 30,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 78%" }
    });
  });

  // Contact
  gsap.from(".contact-email", {
    y: 40, opacity: 0, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".contact-email", start: "top 88%" }
  });
  gsap.from(".contact-row > *", {
    y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
    scrollTrigger: { trigger: ".contact-row", start: "top 92%" }
  });
}

/* ==========================================================================
   PARALLAX
   ========================================================================== */
function parallax(){
  // hero background drift
  gsap.to("#heroBg", {
    yPercent: 18,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });

  // project images parallax inside their frame
  gsap.utils.toArray("[data-parallax-img]").forEach(img => {
    gsap.fromTo(img, { yPercent: -12 }, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: img.closest(".project-media"),
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // contact background parallax
  gsap.to("[data-parallax-bg]", {
    yPercent: 20,
    ease: "none",
    scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom top", scrub: true }
  });
}

/* ==========================================================================
   MARQUEE — GSAP-driven infinite scroll (no manual JS animation loop math
   beyond the tween itself)
   ========================================================================== */
function initMarquees(){
  document.querySelectorAll(".marquee").forEach(wrapper => {
    const tracks = wrapper.querySelectorAll(".marquee-track");
    const reverse = wrapper.querySelector(".marquee-track-reverse") !== null;
    // width of a single track
    requestAnimationFrame(() => {
      const w = tracks[0].getBoundingClientRect().width;
      gsap.set(wrapper, { x: reverse ? -w : 0 });
      gsap.to(wrapper, {
        x: reverse ? 0 : -w,
        duration: 22,
        ease: "none",
        repeat: -1
      });
    });
  });

  // subtle scroll-linked speed variation via scrub timeline scale on hover
  document.querySelectorAll(".marquee-section").forEach(section => {
    gsap.from(section, {
      opacity: 0.4,
      duration: 1,
      scrollTrigger: { trigger: section, start: "top 95%" }
    });
  });
}

/* ==========================================================================
   SECTION TRANSITIONS — subtle fade/slide as each section enters
   ========================================================================== */
function sectionTransitions(){
  gsap.utils.toArray("section").forEach(section => {
    if (section.classList.contains("hero")) return;
    gsap.from(section, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 88%"
      }
    });
  });
}

/* ==========================================================================
   MISC — local time in contact section
   ========================================================================== */
function initLocalTime(){
  const el = document.getElementById("localTime");
  if (!el) return;
  const update = () => {
    const t = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit", minute: "2-digit", timeZone: "Europe/Lisbon"
    });
    el.textContent = "Local time " + t + " WET";
  };
  update();
  setInterval(update, 30000);
}

/* ==========================================================================
   INIT
   ========================================================================== */
window.addEventListener("DOMContentLoaded", () => {
  gsap.set(".nav", { opacity: 0 });
  gsap.set([".eyebrow.reveal-line span", ".hero-sub.reveal-line span"], { opacity: 0, y: 20 });
  gsap.set(".hero-cta-group .btn", { opacity: 0, y: 20 });
  gsap.set(".hero-float", { opacity: 0 });
  gsap.set(".scroll-cue", { opacity: 0 });

  initCursor();
  initLocalTime();

  runLoader(() => {
    heroEntrance();
    ambientFloats();
    initNav();
    initMagnetic();
    scrollReveals();
    parallax();
    initMarquees();
    sectionTransitions();
    ScrollTrigger.refresh();
  });
});

window.addEventListener("load", () => ScrollTrigger.refresh());