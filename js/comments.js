// ===== ADMIN MODE =====
let isAdmin = false;

// CHECK ADMIN FROM SUPABASE
async function checkAdmin() {
  const { data } = await db.auth.getUser();

  if (data?.user?.email === "mythsandmysteries2000@gmail.com") {
    isAdmin = true;
  }

  loadComments(); // load AFTER check
}

checkAdmin();


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


// LOAD COMMENTS
async function loadComments() {

  await waitForArticle();

  const container = document.getElementById("comments-container");

  const { data, error } = await db
    .from("comments")
    .select("*")
    .eq("article_id", window.currentArticleId)
    .order("created_at", { ascending: true });

  if (error) {
    console.log("❌ LOAD COMMENTS ERROR:", error);
    return;
  }

  container.innerHTML = "";

  const main = data.filter(c => !c.parent_id);
  const replies = data.filter(c => c.parent_id);

  main.forEach(comment => {

    const div = document.createElement("div");
    div.className = "comment";

    div.innerHTML = `
      <strong>${comment.name === 'Admin' ? '👑 Admin' : comment.name}</strong>
      <p>${comment.comment}</p>

      <button onclick="replyBox('${comment.id}')">Reply</button>

      ${isAdmin ? `<button onclick="deleteComment('${comment.id}')">🗑 Delete</button>` : ""}

      <div id="replies-${comment.id}" class="replies"></div>
      <div id="reply-box-${comment.id}"></div>
    `;

    // LOAD REPLIES
    replies
      .filter(r => r.parent_id === comment.id)
      .forEach(reply => {

        div.querySelector(`#replies-${comment.id}`).innerHTML += `
          <div class="reply-item ${reply.name === 'Admin' ? 'admin-reply' : ''}">
            <strong>${reply.name === 'Admin' ? '👑 Admin' : reply.name}</strong>
            <p>${reply.comment}</p>

            ${isAdmin ? `<button onclick="deleteComment('${reply.id}')">🗑</button>` : ""}
          </div>
        `;
      });

    container.appendChild(div);
  });
}


// CREATE REPLY BOX
function replyBox(parentId) {

  const box = document.getElementById(`reply-box-${parentId}`);

  if (box.innerHTML !== "") {
    box.innerHTML = "";
    return;
  }

  box.innerHTML = `
    ${!isAdmin ? `<input id="rname-${parentId}" placeholder="Your name">` : ""}
    <textarea id="rtext-${parentId}" placeholder="Reply..."></textarea>
    <button onclick="submitReply('${parentId}')">Send Reply</button>
  `;
}


// SUBMIT REPLY
async function submitReply(parentId) {

  const name = isAdmin
    ? "Admin"
    : document.getElementById(`rname-${parentId}`).value;

  const comment = document.getElementById(`rtext-${parentId}`).value;

  if (!comment || (!isAdmin && !name)) return alert("Fill all fields");

  const { error } = await db.from("comments").insert([{
    article_id: window.currentArticleId,
    parent_id: parentId,
    name,
    comment
  }]);

  if (error) {
    console.log("❌ REPLY ERROR:", error);
    alert("Failed to send reply");
  }

  loadComments();
}


// DELETE COMMENT (SECURE CHECK)
async function deleteComment(commentId) {

  if (!isAdmin) {
    alert("❌ Only admin can delete");
    return;
  }

  const confirmDelete = confirm("Delete this comment?");
  if (!confirmDelete) return;

  const { error } = await db
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    console.log("❌ DELETE ERROR:", error);
    alert("Failed to delete");
    return;
  }

  loadComments();
}


// POST COMMENT
document.getElementById("comment-form").addEventListener("submit", async e => {
  e.preventDefault();

  const name = isAdmin
    ? "Admin"
    : document.getElementById("comment-name").value;

  const comment = document.getElementById("comment-text").value;

  if (!comment || (!isAdmin && !name)) return alert("Fill all fields");

  const { error } = await db.from("comments").insert([{
    article_id: window.currentArticleId,
    name,
    comment
  }]);

  if (error) {
    console.log("❌ COMMENT ERROR:", error);
    alert("Failed to post comment");
  }

  e.target.reset();
  loadComments();
});