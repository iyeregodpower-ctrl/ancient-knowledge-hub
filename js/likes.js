// WAIT UNTIL ARTICLE IS READY
async function waitForArticle() {
  return new Promise(resolve => {
    const check = setInterval(() => {
      if (window.currentArticleId && typeof db !== "undefined") {
        clearInterval(check);
        resolve();
      }
    }, 100);
  });
}

// LOAD LIKES
async function loadLikes() {

  const { data, error } = await db
    .from("articles")
    .select("likes")
    .eq("id", window.currentArticleId)
    .single();

  if (error) {
    console.log("❌ LOAD LIKES ERROR:", error);
    return;
  }

  document.getElementById("like-count").innerText = data?.likes || 0;
}

// LIKE FUNCTION
async function likeArticle() {

  const { data, error } = await db
    .from("articles")
    .select("likes")
    .eq("id", window.currentArticleId)
    .single();

  if (error) {
    console.log("❌ FETCH ERROR:", error);
    return;
  }

  const newLikes = (data?.likes || 0) + 1;

  const { error: updateError } = await db
    .from("articles")
    .update({ likes: newLikes })
    .eq("id", window.currentArticleId);

  if (updateError) {
    console.log("❌ UPDATE ERROR:", updateError);
    return;
  }

  loadLikes();
}

// INIT
async function initLikes() {

  await waitForArticle();

  loadLikes();

  const topBtn = document.getElementById("like-btn");
  const bottomBtn = document.getElementById("like-btn-bottom");

  if (topBtn) topBtn.onclick = likeArticle;
  if (bottomBtn) bottomBtn.onclick = likeArticle;
}

initLikes();