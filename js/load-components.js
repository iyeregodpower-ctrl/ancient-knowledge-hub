// ===== LOAD HEADER & FOOTER + AUTH CHECK (FINAL FIXED VERSION) =====

async function loadComponents(){

  try{

    // LOAD HEADER & FOOTER
    const [headerHTML, footerHTML] = await Promise.all([
      fetch("components/header.html").then(res => res.text()),
      fetch("components/footer.html").then(res => res.text())
    ])

    // INSERT HEADER
    const headerContainer = document.getElementById("header")
    if(headerContainer){
      headerContainer.innerHTML = headerHTML
      headerContainer.classList.add("loaded")
    }
    setTimeout(() => {
    const script = document.createElement("script");
    script.src = "js/search.js";
    document.body.appendChild(script);
}, 500);

    // INSERT FOOTER
    const footerContainer = document.getElementById("footer")
    if(footerContainer){
      footerContainer.innerHTML = footerHTML
    }

    // ==========================
    // 🔒 ADMIN VISIBILITY CONTROL
    // ==========================

    try{
      const { data } = await db.auth.getUser()

      const adminLink = document.getElementById("admin-link")

      const allowedEmail = "mythsandmysteries2000@gmail.com"

      if(data?.user && data.user.email === allowedEmail){
        if(adminLink){
          adminLink.style.display = "block"
        }
      }else{
        if(adminLink){
          adminLink.style.display = "none"
        }
      }

    }catch(err){
      console.log("Auth error:", err)
    }

    // ==========================
    // 🔥 ACTIVE NAV LINK FIX
    // ==========================

setTimeout(() => {

  const links = document.querySelectorAll(".nav-links a");

  const currentPath = window.location.pathname;
  const currentParams = window.location.search;

  links.forEach(link => {

    const href = link.getAttribute("href");
    if (!href) return;

    const [linkPath, linkQuery] = href.split("?");

    // NORMAL PAGE
    if (!linkQuery && currentPath.endsWith(linkPath)) {
      link.classList.add("active");
    }

    // CATEGORY PAGE
    if (linkQuery && currentPath.endsWith(linkPath) && currentParams.includes(linkQuery)) {
      link.classList.add("active");
    }

  });

}, 300); // wait for header to render

  }catch(error){
    console.log("Component load error:", error)
  }

}

// 🚀 RUN IMMEDIATELY
loadComponents()

// ===== MOBILE MENU TOGGLE =====
setTimeout(() => {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }
}, 500);

// ===== SMART NAVBAR (MOBILE ONLY) =====
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {

  if (window.innerWidth > 768) return; // only mobile

  const header = document.querySelector(".main-header");
  if (!header) return;

  if (window.scrollY > lastScrollY) {
    // scrolling DOWN → hide
    header.classList.add("hide-nav");
  } else {
    // scrolling UP → show
    header.classList.remove("hide-nav");
  }

  lastScrollY = window.scrollY;

});

// 🔥 AUTO CLOSE MENU ON SCROLL

window.addEventListener("scroll", () => {

  const nav = document.querySelector(".nav-links");

  if (nav && nav.classList.contains("active")) {
    nav.classList.remove("active");
  }

});

// 🔥 AUTO CLOSE MENU ON SCROLL

window.addEventListener("scroll", () => {

  const nav = document.querySelector(".nav-links");

  if (nav && nav.classList.contains("active")) {
    nav.classList.remove("active");
  }

});
// ===== FINAL COOKIE SYSTEM (FIXED) =====

function handleCookies(){

  const banner = document.getElementById("cookie-banner");
  const overlay = document.getElementById("cookie-overlay");
  const acceptBtn = document.getElementById("accept-cookies");
  const declineBtn = document.getElementById("decline-cookies");

  if(!banner) return;

  const consent = localStorage.getItem("cookieConsent");

  // IF USER ALREADY CHOSE → DO NOTHING
  if(consent === "accepted" || consent === "declined"){
    banner.style.display = "none";
    if(overlay) overlay.style.display = "none";
    return;
  }

  // FORCE INITIAL STATE (hidden first)
  banner.classList.remove("show");

  // SHOW AFTER SMALL DELAY (ensures DOM ready)
  setTimeout(() => {
    banner.classList.add("show");
    if(overlay) overlay.classList.add("active");
  }, 300);

  // ACCEPT
  acceptBtn?.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "accepted");
    banner.style.display = "none";
    if(overlay) overlay.style.display = "none";
  });

  // DECLINE
  declineBtn?.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "declined");
    banner.style.display = "none";
    if(overlay) overlay.style.display = "none";
  });

}

// 🔥 IMPORTANT: WAIT FOR FOOTER TO LOAD FIRST
setTimeout(handleCookies, 800);

document.addEventListener("DOMContentLoaded", () => {

  const links = document.querySelectorAll(".nav-links a");

  const currentPath = window.location.pathname;
  const currentParams = window.location.search;

  links.forEach(link => {

    const href = link.getAttribute("href");

    if (!href) return;

    // SPLIT link into path + query
    const [linkPath, linkQuery] = href.split("?");

    // CASE 1: NORMAL PAGE (index.html, blog.html)
    if (!linkQuery && currentPath.endsWith(linkPath)) {
      link.classList.add("active");
    }

    // CASE 2: CATEGORY PAGE (VERY IMPORTANT)
    if (linkQuery && currentPath.endsWith(linkPath) && currentParams.includes(linkQuery)) {
      link.classList.add("active");
    }

  });

});