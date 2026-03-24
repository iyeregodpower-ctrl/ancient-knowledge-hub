// ===== CATEGORY PAGINATION SYSTEM =====

let currentPage = 1
const limit = 6

async function loadCategory(page = 1){

  const params = new URLSearchParams(window.location.search)
  let category = params.get("category")

  const container = document.getElementById("articles-container")
  const pagination = document.getElementById("category-pagination")

  if(!category){
    document.getElementById("category-title").innerText = "Category not found"
    return
  }

  category = category.toLowerCase().trim()

  // FORMAT TITLE
  const formattedTitle = category
    .replace(/-/g, " ")
    .toUpperCase()

  document.getElementById("category-title").innerText = formattedTitle

  container.innerHTML = "<p>Loading...</p>"

  const from = (page - 1) * limit
  const to = from + limit - 1

  // FETCH DATA
  const { data, error, count } = await db
    .from("articles")
    .select("*", { count: "exact" })
    .eq("category", category)
    .order("created_at", { ascending: false })
    .range(from, to)

  if(error){
    container.innerHTML = "<p>Error loading articles</p>"
    console.log(error)
    return
  }

  if(!data || data.length === 0){
    container.innerHTML = "<p>No articles found</p>"
    return
  }

  container.innerHTML = ""

  data.forEach(article => {

    const card = `
      <div class="blog-card">

        <img src="${article.thumbnail || 'images/default.jpg'}">

        <div class="blog-content">

          <span class="blog-category">
            ${article.category || "General"}
          </span>

          <h3>${article.title}</h3>

          <p>${article.description || "Explore this article"}</p>

          <a href="article.html?slug=${article.slug}">
            Read More →
          </a>

        </div>

      </div>
    `

    container.innerHTML += card

  })

  // ===== PAGINATION =====
  const totalPages = Math.ceil(count / limit)

  pagination.innerHTML = ""

  for(let i = 1; i <= totalPages; i++){

    const btn = document.createElement("button")
    btn.innerText = i

    if(i === page){
      btn.classList.add("active-page")
    }

    btn.onclick = () => {
      currentPage = i
      loadCategory(i)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    pagination.appendChild(btn)
  }

}

// LOAD FIRST PAGE
loadCategory()