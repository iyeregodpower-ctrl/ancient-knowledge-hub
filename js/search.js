// ===== LIVE SEARCH SYSTEM (GOOGLE STYLE) =====

function initSearch(){

  const input = document.getElementById("search-input")
  const dropdown = document.getElementById("search-dropdown")

  if(!input || !dropdown) return

  // ==========================
  // 🔍 LIVE SEARCH
  // ==========================
  input.addEventListener("input", async function(){

    const query = this.value.trim()

    if(query.length < 2){
      dropdown.style.display = "none"
      return
    }

    const { data, error } = await db
      .from("articles")
      .select("*")
      .ilike("title", `%${query}%`)
      .limit(5)

    if(error){
      console.log(error)
      return
    }

    dropdown.innerHTML = ""

    if(data.length === 0){
      dropdown.innerHTML = "<div class='dropdown-item'>No results</div>"
      dropdown.style.display = "block"
      return
    }

    data.forEach(article => {

      const div = document.createElement("div")
      div.className = "dropdown-item"

      div.innerHTML = `
        <img src="${article.thumbnail || 'images/default.jpg'}">
        <span>${article.title}</span>
      `

      div.onclick = () => {
        window.location.href = `article.html?slug=${article.slug}`
      }

      dropdown.appendChild(div)
    })

    dropdown.style.display = "block"
  })

  // ==========================
  // ⌨️ ENTER KEY
  // ==========================
  input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
      const query = input.value.trim()

      if(!query) return

      saveSearch(query)

      window.location.href = `search.html?q=${encodeURIComponent(query)}`
    }
  })

  // ==========================
  // 💾 SAVE SEARCH HISTORY
  // ==========================
  function saveSearch(query){

    let history = JSON.parse(localStorage.getItem("searchHistory")) || []

    history = history.filter(item => item !== query)
    history.unshift(query)
    history = history.slice(0, 5)

    localStorage.setItem("searchHistory", JSON.stringify(history))
  }

  // ==========================
  // 🕘 SHOW HISTORY
  // ==========================
  input.addEventListener("focus", () => {

    const history = JSON.parse(localStorage.getItem("searchHistory")) || []

    if(history.length === 0) return

    dropdown.innerHTML = ""

    history.forEach(item => {

      const div = document.createElement("div")
      div.className = "dropdown-item history"

      div.innerText = item

      div.onclick = () => {
        window.location.href = `search.html?q=${encodeURIComponent(item)}`
      }

      dropdown.appendChild(div)
    })

    dropdown.style.display = "block"
  })

  // ==========================
  // ❌ CLICK OUTSIDE
  // ==========================
  document.addEventListener("click", (e) => {
    if(!e.target.closest(".search-box")){
      dropdown.style.display = "none"
    }
  })

}

// WAIT FOR HEADER LOAD
setTimeout(initSearch, 500)