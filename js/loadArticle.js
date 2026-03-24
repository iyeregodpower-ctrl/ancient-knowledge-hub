async function loadArticle() {

const params = new URLSearchParams(window.location.search);

const id = params.get("id");
const slug = params.get("slug");


let data = null;
let error = null;

// =====================
// TRY ID FIRST
// =====================
if (id) {
  const res = await db
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  data = res.data;
  error = res.error;
}

// =====================
// FALLBACK TO SLUG
// =====================
if (!data && slug) {
  const res = await db
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  data = res.data;
  error = res.error;
}

// =====================
// IF STILL NO ARTICLE
// =====================
if (!data) {
  document.getElementById("article-title").innerText = "Article not found";
  console.log(error);
  return;
}

// =====================
// DISPLAY ARTICLE
// =====================
document.getElementById("article-title").innerText = data.title;
document.getElementById("article-image").src = data.thumbnail;
document.getElementById("article-image").alt = data.title;
document.getElementById("article-subtitle").innerText = data.description || "";
document.getElementById("article-description").innerText = data.description || "";
document.getElementById("article-content").innerHTML = data.content || "";
document.getElementById("article-views").innerText = data.views || 0;

// ===== SEO (FIXED) =====
document.title = data.title + " | Ancient Knowledge Hub";

let metaDesc = document.querySelector("meta[name='description']");
if (metaDesc) {
  metaDesc.setAttribute("content", data.description || data.title);
}

let ogTitle = document.querySelector("meta[property='og:title']");
if (ogTitle) ogTitle.setAttribute("content", data.title);

let ogDesc = document.querySelector("meta[property='og:description']");
if (ogDesc) ogDesc.setAttribute("content", data.description || data.title);

let ogImage = document.querySelector("meta[property='og:image']");
if (ogImage && data.thumbnail) ogImage.setAttribute("content", data.thumbnail);

let canonical = document.querySelector("link[rel='canonical']");
if (canonical) {
  canonical.setAttribute("href", window.location.href);

  let ogUrl = document.querySelector("meta[property='og:url']");
if (ogUrl) ogUrl.setAttribute("content", window.location.href);
}

// ===== STRUCTURED DATA =====
const schema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": data.title,
  "description": data.description,
  "image": data.thumbnail,
  "author": {
    "@type": "Organization",
    "name": "Ancient Knowledge Hub"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Ancient Knowledge Hub"
  },
  "mainEntityOfPage": window.location.href
};

const script = document.createElement("script");
script.type = "application/ld+json";
script.textContent = JSON.stringify(schema);

document.head.appendChild(script);

// =====================
// FIX COMMENTS SYSTEM 🔥
// =====================
window.currentArticleId = data.id;

// =====================
// YOUTUBE
// =====================
if (data.youtube) {
document.getElementById("article-video").innerHTML = `
<div class="video-container">
<iframe 
src="https://www.youtube.com/embed/${data.youtube}?rel=0&modestbranding=1"
frameborder="0" 
allowfullscreen>
</iframe>
</div>
`;
}

// =====================
// UPDATE VIEWS
// =====================
await db
.from("articles")
.update({ views: (data.views || 0) + 1 })
.eq("id", data.id);

}

loadArticle();

// HIDE LOADER AFTER CONTENT LOAD
const loader = document.getElementById("loader");

if (loader) {
  loader.classList.add("loader-hide");

  
}
