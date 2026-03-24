// ===== DYNAMIC PLAYLIST SYSTEM =====

// 🔥 ADD YOUR PLAYLISTS HERE
const playlists = [
  {
    title: "Biblical Mysteries & Forbidden Text",
    id: "PL1hLs6po5IZug8w-o8_vuFJOpW2jXGy4P"
  },
  {
    title: "The Fallen Angels & The Watchers",
    id: "PL1hLs6po5IZtAhY6TqhM9v71u4cCnXYIc"
  },
  {
    title: "Ancient World Mysteries",
    id: "PL1hLs6po5IZtJMvKmtq-HdwmAx41nvHZV"
  },
  {
    title: "Mythological Parallels",
    id: "PL1hLs6po5IZs-NKvdu8K4vQMVtu4p_HmL&index=1"
  }
  
  
]

function loadPlaylists(){

  const tabs = document.getElementById("playlist-tabs")
  const player = document.getElementById("playlist-player")

  if(!tabs || !player) return

  tabs.innerHTML = ""

  playlists.forEach((playlist, index) => {

    const btn = document.createElement("button")
    btn.innerText = playlist.title

    // DEFAULT ACTIVE
    if(index === 0){
      btn.classList.add("active-tab")
      player.src = `https://www.youtube.com/embed/videoseries?list=${playlist.id}`
    }

    btn.onclick = () => {

      // REMOVE ACTIVE
      document.querySelectorAll(".playlist-tabs button")
        .forEach(b => b.classList.remove("active-tab"))

      btn.classList.add("active-tab")

      player.src = `https://www.youtube.com/embed/videoseries?list=${playlist.id}`
    }

    tabs.appendChild(btn)

  })
}

loadPlaylists()