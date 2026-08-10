// =========================================================
// MOBILE MENU
// =========================================================
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("change", () => {
    navLinks.classList.toggle("active", menuToggle.checked);
});
// =========================================================
// LESSONS DROPDOWN
// =========================================================
const lessonsBtn = document.getElementById("lessons-btn");
const lessonsMenu = document.getElementById("lessons-menu");

lessonsBtn.addEventListener("click", (event) => {
    event.preventDefault();
    lessonsMenu.classList.toggle("show");
});
// =========================================================
// CLOSE DROPDOWN WHEN CLICKING OUTSIDE
// =========================================================
document.addEventListener("click", (event) => {
    if (
        !lessonsBtn.contains(event.target) &&
        !lessonsMenu.contains(event.target)
    ) {
        lessonsMenu.classList.remove("show");
    }
});
// =========================================================
// CLOSE MOBILE MENU AFTER NAVIGATION
// =========================================================
const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach((link) => {
    link.addEventListener("click", () => {
        if (event.target === lessonsBtn) {
            return;
        }
        menuToggle.checked = false;
        navLinks.classList.remove("active");
    });
});
// =========================================================
// AUDIO PLAYBACK
// Only one lesson plays at a time.
// =========================================================
const audioPlayers = document.querySelectorAll("audio");

audioPlayers.forEach((audio) => {
    audio.addEventListener("play", () => {
        audioPlayers.forEach((otherAudio) => {
            if (otherAudio !== audio) {
                otherAudio.pause();
            }
        });
    });
});