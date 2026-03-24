async function loadSearchResults(){

  const stopWords = ["the", "a", "is", "of", "and", "in"]

function highlight(text, keyword){

  if(stopWords.includes(keyword.toLowerCase())) return text

  if(keyword.length < 4) return text

  const regex = new RegExp(`(${keyword})`, "gi")

  return text.replace(regex, `<span class="highlight">$1</span>`)
}

  const params = new URLSearchParams(window.location.search)
  const query = params.get("q")

  if(!query) return

  const { data, error } = await db
    .from("articles")
    .select("*")
    .ilike("title", `%${query}%`)

  const container = document.getElementById("search-results")

  if(error){
    container.innerHTML = "<p>Error loading search.</p>"
    return
  }

  if(data.length === 0){
    container.innerHTML = "<p>No results found.</p>"
    return
  }

  container.innerHTML = ""

  // 🔥 FUNCTION: highlight keyword
  function highlight(text, keyword){

  // ❌ Ignore short words (like "the", "a", "is")
  if(keyword.length < 4) return text

  const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  const regex = new RegExp(`(${safeKeyword})`, "gi")

  return text.replace(regex, `<span class="highlight">$1</span>`)
}

  data.forEach(article => {

    // ⏱ reading time estimate
    const words = (article.content || "").split(" ").length
    const readTime = Math.max(1, Math.round(words / 200))

    const card = `
      <div class="search-card">

        <img src="${article.thumbnail || 'images/default.jpg'}" class="search-img">

        <div class="search-content">

          <div class="search-top">

            <span class="category-badge">
              ${article.category || "Article"}
            </span>

            <span class="read-time">
              ${readTime} min read
            </span>

          </div>

          <h3>
            ${highlight(article.title, query)}
          </h3>

          <p>
            ${article.description || "Explore this article"}
          </p>

          <a href="/article.html?slug=${article.slug}" class="search-btn">
            Read Article →
          </a>

        </div>

      </div>
    `

    container.innerHTML += card

  })

}

loadSearchResults()