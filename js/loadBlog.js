// ===== BLOG PAGINATION SYSTEM =====

let currentPage = 1
const limit = 6

async function loadBlog(page = 1){

  const container = document.getElementById("blog-container")
  const pagination = document.getElementById("pagination")

  if(!container) return

  container.innerHTML = "<p>Loading...</p>"

  const from = (page - 1) * limit
  const to = from + limit - 1

  // GET DATA + COUNT
  const { data, error, count } = await db
    .from("articles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  if(error){
    container.innerHTML = "<p>Error loading articles</p>"
    console.log(error)
    return
  }

  container.innerHTML = ""

  data.forEach(article => {

    const card = `
      <div class="blog-card">
        <img src="${article.thumbnail || 'images/default.jpg'}">

        <div class="blog-content">
          <span class="blog-category">${article.category || "General"}</span>

          <h3>${article.title}</h3>

          <p>${article.description || "Explore this article"}</p>

          <a href="/article.html?slug=${article.slug}">
            Read More →
          </a>
        </div>
      </div>
    `

    container.innerHTML += card
  })

  // ===== PAGINATION BUTTONS =====
  const totalPages = Math.ceil(count / limit)

  pagination.innerHTML = ""

  pagination.innerHTML = ""

// ===== PREVIOUS BUTTON =====
if(page > 1){
  const prev = document.createElement("button")
  prev.innerText = "← Prev"

  prev.onclick = () => {
    loadBlog(page - 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  pagination.appendChild(prev)
}

// ===== PAGE NUMBERS =====
for(let i = 1; i <= totalPages; i++){

  const btn = document.createElement("button")
  btn.innerText = i

  if(i === page){
    btn.classList.add("active-page")
  }

  btn.onclick = () => {
    loadBlog(i)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  pagination.appendChild(btn)
}

// ===== NEXT BUTTON =====
if(page < totalPages){
  const next = document.createElement("button")
  next.innerText = "Next →"

  next.onclick = () => {
    loadBlog(page + 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  pagination.appendChild(next)
}
}

// LOAD FIRST PAGE
loadBlog()