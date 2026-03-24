async function loadArticles() {

  const container = document.getElementById("articles-container");

  if (!container) return;

  const { data, error } = await db
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error loading articles:", error);
    container.innerHTML = "<p>Error loading articles</p>";
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "<p>No articles available</p>";
    return;
  }

  container.innerHTML = "";

  data.forEach(article => {

    const div = document.createElement("div");
    div.className = "article-card";

    div.innerHTML = `
      <img src="${article.thumbnail || 'images/default.jpg'}" class="article-image">

      <h3>${article.title}</h3>

      <p>${article.description || "Explore this article"}</p>

      <a href="article.html?id=${article.id}" class="read-btn">
        View Article →
      </a>
    `;

    container.appendChild(div);
  });

}

// RUN
document.addEventListener("DOMContentLoaded", loadArticles);