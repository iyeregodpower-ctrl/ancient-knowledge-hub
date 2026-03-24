document.addEventListener("DOMContentLoaded", function () {

    const topBtn = document.getElementById("scrollTopBtn");
    const bottomBtn = document.getElementById("scrollBottomBtn");

    // Show button when scrolling
    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            topBtn.style.display = "block";
            bottomBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
            bottomBtn.style.display = "none";
        }
    });

    // Scroll to top
    topBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // Scroll to bottom
    bottomBtn.addEventListener("click", () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    });

});