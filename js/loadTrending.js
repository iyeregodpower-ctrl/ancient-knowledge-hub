async function loadTrending(){

const container = document.getElementById("trending-container")
if(!container) return

container.innerHTML = "<p>Loading trending articles...</p>"

// FETCH MOST VIEWED ARTICLES
const { data, error } = await db
.from("articles")
.select("*")
.order("views", { ascending: false })
.limit(6)

if(error){
console.log(error)
container.innerHTML = "<p>Error loading trending articles.</p>"
return
}

if(data.length === 0){
container.innerHTML = "<p>No trending articles yet.</p>"
return
}

container.innerHTML = ""

// LOOP
data.forEach(article => {

const card = `
<div class="article-card">

<img src="${article.thumbnail || 'images/fallback.jpg'}" class="article-image">

<h3>${article.title}</h3>

<p>${article.description || "Explore this mystery."}</p>

<a href="/article.html?slug=${article.slug}" class="read-btn">
Read More
</a>

</div>
`

container.innerHTML += card

})

}

loadTrending()