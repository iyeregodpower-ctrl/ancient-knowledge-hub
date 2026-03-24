async function loadFeatured(){

const container = document.getElementById("featured-container")
if(!container) return

container.innerHTML = "<p>Loading featured articles...</p>"

const { data, error } = await db
.from("articles")
.select("*")
.eq("featured", true)
.order("created_at", { ascending: false })
.limit(3)

if(error){
console.log(error)
container.innerHTML = "<p>Error loading featured.</p>"
return
}

if(data.length === 0){
container.innerHTML = "<p>No featured articles yet.</p>"
return
}

container.innerHTML = ""

data.forEach(article => {

container.innerHTML += `
<div class="article-card">

<img src="${article.thumbnail}" class="article-image">

<h3>${article.title}</h3>

<p>${article.description || ""}</p>

<a href="/article.html?slug=${article.slug}" class="read-btn">
Read More
</a>

</div>
`

})

}

loadFeatured()