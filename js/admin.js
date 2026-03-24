let editId = null

// ==========================
// 🔒 AUTH CHECK
// ==========================
async function checkAuth(){

const { data } = await db.auth.getUser()

if(!data.user){
window.location.href = "/login.html"
return
}

const allowedEmail = "mythsandmysteries2000@gmail.com"

if(data.user.email !== allowedEmail){
alert("Access denied")
window.location.href = "/index.html"
return
}

console.log("Admin verified:", data.user.email)

}

checkAuth()

// ==========================
// 🎥 EXTRACT YOUTUBE ID
// ==========================
function extractYouTubeId(url){

if(!url) return ""

const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&]+)/

const match = url.match(regExp)

return match ? match[1] : url

}

// ==========================
// 🖼 IMAGE UPLOAD
// ==========================
async function uploadImage(file){

const fileName = Date.now() + "-" + file.name

const { error } = await db.storage
.from("images")
.upload(fileName, file)

if(error){
alert("UPLOAD ERROR: " + error.message)
console.log(error)
return null
}

const { data } = db.storage
.from("images")
.getPublicUrl(fileName)

return data.publicUrl

}

// ==========================
// ✏️ AUTO SLUG
// ==========================
document.getElementById("title").addEventListener("input", function(){

const slug = this.value
.toLowerCase()
.replace(/\s+/g, "-")
.replace(/[^\w-]+/g, "")

document.getElementById("slug").value = slug

})

// ==========================
// 📤 SUBMIT FORM
// ==========================
document.getElementById("article-form").addEventListener("submit", async function(e){

e.preventDefault()

let imageUrl = document.getElementById("thumbnail").value

const file = document.getElementById("imageUpload").files[0]

if(file){
const uploaded = await uploadImage(file)
if(uploaded) imageUrl = uploaded
}

const article = {
title: title.value,
slug: slug.value + "-" + Date.now(), // 🔥 prevent duplicate slug
thumbnail: imageUrl,
category: category.value,
youtube: extractYouTubeId(youtube.value),
description: description.value,
content: content.value,
featured: document.getElementById("featured").checked
}

let error

if(editId){

// UPDATE
const res = await db
.from("articles")
.update(article)
.eq("id", editId)

error = res.error
editId = null

}else{

// INSERT
const res = await db
.from("articles")
.insert([article])

error = res.error

}

if(error){
alert("ERROR: " + error.message)
console.log(error)
return
}

this.reset()
loadArticles()

})

// ==========================
// 📥 LOAD ARTICLES
// ==========================
async function loadArticles(){

const { data } = await db
.from("articles")
.select("*")
.order("created_at", { ascending: false })

const container = document.getElementById("admin-list")
container.innerHTML = ""

data.forEach(article => {

const div = document.createElement("div")
div.className = "admin-item"

div.innerHTML = `
<span>${article.title}</span>

<div class="admin-actions">

<button onclick="editArticle('${article.id}')">Edit</button>

<button class="delete-btn" onclick="deleteArticle('${article.id}')">
Delete
</button>

</div>
`

container.appendChild(div)

})

}

// ==========================
// 🗑 DELETE
// ==========================
async function deleteArticle(id){

if(!confirm("Delete this article?")) return

await db.from("articles").delete().eq("id", id)

loadArticles()

}

// ==========================
// ✏️ EDIT
// ==========================
async function editArticle(id){

const { data } = await db
.from("articles")
.select("*")
.eq("id", id)
.single()

title.value = data.title
slug.value = data.slug
thumbnail.value = data.thumbnail
category.value = data.category
youtube.value = data.youtube
description.value = data.description
content.value = data.content
featured.checked = data.featured

editId = id

}

// ==========================
// 🔓 LOGOUT
// ==========================
async function logout(){

await db.auth.signOut()
window.location.href = "/login.html"

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
.subscribe()

// ==========================
// 🚀 INIT
// ==========================
loadArticles()