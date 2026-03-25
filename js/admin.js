let editId = null;
let convertedImage = null;

// ==========================
// 🔒 AUTH CHECK
// ==========================
async function checkAuth() {
  const { data } = await db.auth.getUser();

  if (!data.user) {
    window.location.href = "login.html";
    return;
  }

  const allowedEmail = "mythsandmysteries2000@gmail.com";

  if (data.user.email !== allowedEmail) {
    alert("Access denied");
    window.location.href = "index.html";
    return;
  }

  console.log("Admin verified:", data.user.email);
}

checkAuth();

// ==========================
// 🎥 EXTRACT YOUTUBE ID
// ==========================
function extractYouTubeId(url) {
  if (!url) return "";
  const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regExp);
  return match ? match[1] : url;
}

// ==========================
// 🖼 IMAGE UPLOAD
// ==========================
async function uploadImage(file) {
  // Use Date.now() to ensure unique filenames in Supabase Storage
  const fileName = Date.now() + "-" + file.name;

  const { error } = await db.storage
    .from("images")
    .upload(fileName, file);

  if (error) {
    alert("UPLOAD ERROR: " + error.message);
    console.log(error);
    return null;
  }

  const { data } = db.storage
    .from("images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

// ==========================
// ✏️ AUTO SLUG
// ==========================
document.getElementById("title").addEventListener("input", function () {
  const slug = this.value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  document.getElementById("slug").value = slug;
});

// ==========================
// 🔄 UPLOAD WEBP FILE CONVERSION
// ==========================
const input = document.getElementById("imageUpload");

input.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  const reader = new FileReader();

  reader.onload = (e) => {
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);

  img.onload = () => {
    const canvas = document.createElement("canvas");

    const maxWidth = 1200;
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height = height * (maxWidth / width);
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        convertedImage = new File([blob], "article.webp", {
          type: "image/webp",
        });

        console.log("✅ Converted to WebP successfully");
      },
      "image/webp",
      0.7
    );
  };
});

// ==========================
// 📤 SUBMIT FORM
// ==========================
document.getElementById("article-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  let imageUrl = document.getElementById("thumbnail").value;
  const file = document.getElementById("imageUpload").files[0];

  // Handle Image Upload if a file is selected
  if (file) {
    const fileToUpload = convertedImage || file; // 🔥 Use WebP if ready
    const uploaded = await uploadImage(fileToUpload);
    if (uploaded) imageUrl = uploaded;
  }

  // Get field values safely
  const titleVal = document.getElementById("title").value;
  let slugVal = document.getElementById("slug").value;
  const categoryVal = document.getElementById("category").value;
  const youtubeVal = document.getElementById("youtube").value;
  const descriptionVal = document.getElementById("description").value;
  const contentVal = document.getElementById("content").value;
  const featuredVal = document.getElementById("featured").checked;

  // Add timestamp to slug ONLY if it's a new article to prevent changing URLs later
  if (!editId) {
    slugVal = slugVal + "-" + Date.now();
  }

  const article = {
    title: titleVal,
    slug: slugVal,
    thumbnail: imageUrl,
    category: categoryVal,
    youtube: extractYouTubeId(youtubeVal),
    description: descriptionVal,
    content: contentVal,
    featured: featuredVal,
  };

  let error;

  if (editId) {
    // UPDATE
    const res = await db.from("articles").update(article).eq("id", editId);
    error = res.error;
    editId = null;
  } else {
    // INSERT
    const res = await db.from("articles").insert([article]);
    error = res.error;
  }

  if (error) {
    alert("ERROR: " + error.message);
    console.log(error);
    return;
  }

  // Reset form and variables
  this.reset();
  convertedImage = null; // Clear out the saved WebP image
  loadArticles();
});

// ==========================
// 📥 LOAD ARTICLES
// ==========================
async function loadArticles() {
  const { data } = await db
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  const container = document.getElementById("admin-list");
  container.innerHTML = "";

  data.forEach((article) => {
    const div = document.createElement("div");
    div.className = "admin-item";

    div.innerHTML = `
      <span>${article.title}</span>
      <div class="admin-actions">
        <button onclick="editArticle('${article.id}')">Edit</button>
        <button class="delete-btn" onclick="deleteArticle('${article.id}')">Delete</button>
      </div>
    `;

    container.appendChild(div);
  });
}

// ==========================
// 🗑 DELETE
// ==========================
async function deleteArticle(id) {
  if (!confirm("Delete this article?")) return;
  await db.from("articles").delete().eq("id", id);
  loadArticles();
}

// ==========================
// ✏️ EDIT
// ==========================
async function editArticle(id) {
  const { data } = await db
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  // Populate inputs safely
  document.getElementById("title").value = data.title;
  document.getElementById("slug").value = data.slug;
  document.getElementById("thumbnail").value = data.thumbnail || "";
  document.getElementById("category").value = data.category;
  document.getElementById("youtube").value = data.youtube || "";
  document.getElementById("description").value = data.description || "";
  document.getElementById("content").value = data.content || "";
  document.getElementById("featured").checked = data.featured;

  editId = id;
}

// ==========================
// 🔓 LOGOUT
// ==========================
async function logout() {
  await db.auth.signOut();
  window.location.href = "/login.html";
}

// ==========================
// 🔥 REALTIME UPDATE
// ==========================
db.channel("admin-changes")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "articles" },
    () => loadArticles()
  )
  .subscribe();

// ==========================
// 🚀 INIT
// ==========================
loadArticles();