// HAMBURGER MENU
const hamburger = document.querySelector(".hamburger");
const navLinks = document.getElementById("nav-links");

// Open and close the hamburger menu
hamburger.addEventListener("click", function (event) {
    navLinks.classList.toggle("active");

    // Prevent the document click listener from firing
    event.stopPropagation();
});

// CLOSE HAMBURGER AFTER CLICKING
// A NAVBAR LINK (EXCEPT LESSONS)
const links = document.querySelectorAll(".nav-links a");

links.forEach(link => {
    link.addEventListener("click", function () {

        // Don't close the hamburger menu
        // when clicking the Lessons button.
        if (link.id === "lessons-btn") {
            return;
        }
        navLinks.classList.remove("active");
    });
});

// LESSONS DROPDOWN MENU
const lessonsBtn = document.getElementById("lessons-btn");
const lessonsMenu = document.getElementById("lessons-menu");

// Open and close the Lessons dropdown menu
lessonsBtn.addEventListener("click", function (e) {
    e.preventDefault();
    lessonsMenu.classList.toggle("show");
});

// CLOSE MENUS WHEN CLICKING OUTSIDE
document.addEventListener("click", function (event) {

    // Close the hamburger menu if the user clicks outside of it.
    if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(event.target) &&
        !hamburger.contains(event.target)
    ) {
        navLinks.classList.remove("active");
    }

    // Close the Lessons dropdown menu if the user clicks outside of it.
    if (
        !lessonsBtn.contains(event.target) &&
        !lessonsMenu.contains(event.target)
    ) {
        lessonsMenu.classList.remove("show");
    }
});

const readMoreButtons = document.querySelectorAll(".read-more-btn");

readMoreButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const moreText = button
            .closest(".card-body")
            .querySelector(".more-text");
        moreText.classList.toggle("show");
        if (moreText.classList.contains("show")) {
            button.textContent = "بستن";
        } else {
            button.textContent = "ادامه مطلب";
        }
    });
});