
// // const API_KEY = "AIzaSyBUSJQ5Bsh8Jdd2oyHzQgQM3u4dcRfuMiw"
// // const PLAYLIST_ID = "UUpD9SiyLSWZDlV2C_giHSIA"

// // async function loadVideos() {
// //   const container = document.getElementById("youtube-videos");

// //   if (!container) return;

// //   container.innerHTML = "<p>Loading videos...</p>";

// //   try {
// //     const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=15&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;

// //     const response = await fetch(url);
// //     const data = await response.json();

// //     console.log("Playlist response:", data);

// //     if (!data.items || data.items.length === 0) {
// //       container.innerHTML = "<p>No videos found.</p>";
// //       return;
// //     }

// //     container.innerHTML = "";
// //     let count = 0;

// //     for (const video of data.items) {
// //       const title = video.snippet?.title;
// //       const videoId = video.snippet?.resourceId?.videoId;
// //       const thumbnail = video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url;

// //       if (!videoId || !thumbnail) continue;

// //       try {
// //         const detailsRes = await fetch(
// //           `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${API_KEY}`
// //         );
// //         const detailData = await detailsRes.json();

// //         console.log("Video details:", videoId, detailData);

// //         if (!detailData.items || detailData.items.length === 0) continue;

// //         const duration = detailData.items[0].contentDetails.duration;

// //         // Skip short-style videos under 60 seconds
// //         if (duration.includes("S") && !duration.includes("M") && !duration.includes("H")) {
// //           continue;
// //         }

// //         if (count >= 6) break;

// //         count++;

// //         container.innerHTML += `
// //           <div class="video-card">
// //             <img src="${thumbnail}" alt="${title}">
// //             <h3>${title}</h3>
// //             <a href="https://youtube.com/watch?v=${videoId}" target="_blank">
// //               Watch on YouTube
// //             </a>
// //           </div>
// //         `;
// //       } catch (err) {
// //         console.log("Error loading video details:", err);
// //       }
// //     }

// //     if (count === 0) {
// //       container.innerHTML = "<p>No long-form videos found.</p>";
// //     }

// //   } catch (error) {
// //     console.log("YouTube load error:", error);
// //     container.innerHTML = "<p>Could not load videos.</p>";
// //   }
// // }

// // loadVideos();

// const API_KEY = "AIzaSyBUSJQ5Bsh8Jdd2oyHzQgQM3u4dcRfuMiw";
// const PLAYLIST_ID = "UUpD9SiyLSWZDlV2C_giHSIA";

// // Convert YouTube duration format to seconds
// function durationToSeconds(duration) {

//   const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

//   const hours = match[1] ? parseInt(match[1]) : 0;
//   const minutes = match[2] ? parseInt(match[2]) : 0;
//   const seconds = match[3] ? parseInt(match[3]) : 0;

//   return hours * 3600 + minutes * 60 + seconds;
// }

// async function loadVideos() {

//   const container = document.getElementById("youtube-videos");

//   if (!container) return;

//   container.innerHTML = "<p>Loading videos...</p>";

//   try {

//     const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=15&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;

//     const response = await fetch(url);
//     const data = await response.json();

//     if (!data.items || data.items.length === 0) {
//       container.innerHTML = "<p>No videos found.</p>";
//       return;
//     }

//     container.innerHTML = "";
//     let count = 0;

//     for (const video of data.items) {

//       const title = video.snippet?.title;
//       const videoId = video.snippet?.resourceId?.videoId;
//       const thumbnail = video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url;

//       if (!videoId || !thumbnail) continue;

//       try {

//         const detailsRes = await fetch(
//           `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${API_KEY}`
//         );

//         const detailData = await detailsRes.json();

//         if (!detailData.items || detailData.items.length === 0) continue;

//         const duration = detailData.items[0].contentDetails.duration;

//         const seconds = durationToSeconds(duration);

//         // Remove videos shorter than 2 minutes
//         if (seconds < 120) {
//           continue;
//         }

//         if (count >= 6) break;

//         count++;

//         container.innerHTML += `
//           <div class="video-card">
//             <img src="${thumbnail}" alt="${title}">
//             <h3>${title}</h3>
//             <a href="https://youtube.com/watch?v=${videoId}" target="_blank">
//               Watch on YouTube
//             </a>
//           </div>
//         `;

//       } catch (err) {
//         console.log("Error loading video details:", err);
//       }

//     }

//     if (count === 0) {
//       container.innerHTML = "<p>No videos longer than 2 minutes found.</p>";
//     }

//   } catch (error) {
//     console.log("YouTube load error:", error);
//     container.innerHTML = "<p>Could not load videos.</p>";
//   }

// }

// loadVideos();

const API_KEY = "AIzaSyBUSJQ5Bsh8Jdd2oyHzQgQM3u4dcRfuMiw";
const PLAYLIST_ID = "UUpD9SiyLSWZDlV2C_giHSIA";

// Convert YouTube duration format (PT3M10S) to seconds
function durationToSeconds(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  return hours * 3600 + minutes * 60 + seconds;
}

async function loadVideos() {

  const container = document.getElementById("youtube-videos");

  if (!container) return;

  container.innerHTML = "<p>Loading videos...</p>";

  try {

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=15&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      container.innerHTML = "<p>No videos found.</p>";
      return;
    }

    container.innerHTML = "";
    let count = 0;

    for (const video of data.items) {

      const title = video.snippet?.title;
      const videoId = video.snippet?.resourceId?.videoId;
      const thumbnail = video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url;

      if (!videoId || !thumbnail) continue;

      try {

        const detailsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${API_KEY}`
        );

        const detailData = await detailsRes.json();

        if (!detailData.items || detailData.items.length === 0) continue;

        const duration = detailData.items[0].contentDetails.duration;
        const seconds = durationToSeconds(duration);

        // Remove videos shorter than 2 minutes
        if (seconds < 120) continue;

        if (count >= 6) break;

        count++;

        container.innerHTML += `
          <div class="video-card">

            <iframe
              src="https://www.youtube.com/embed/${videoId}"
              frameborder="0"
              allowfullscreen>
            </iframe>

            <h3>${title}</h3>

            <a href="https://youtube.com/watch?v=${videoId}" target="_blank">
              Watch on YouTube
            </a>

          </div>
        `;

      } catch (err) {
        console.log("Error loading video details:", err);
      }

    }

    if (count === 0) {
      container.innerHTML = "<p>No videos longer than 2 minutes found.</p>";
    }

  } catch (error) {

    console.log("YouTube load error:", error);
    container.innerHTML = "<p>Could not load videos.</p>";

  }

}

loadVideos();
