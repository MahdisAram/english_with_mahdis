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

// SELECT PREFERRED DAYS
const dayButtons =
document.querySelectorAll(".day-btn");
let selectedDays = [];

dayButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        button.classList.toggle("active");

        const day = button.textContent.trim();

        if(selectedDays.includes(day)){
            selectedDays =
            selectedDays.filter(
                item => item !== day
            );
        }
        else{
            selectedDays.push(day);
        }
        console.log(
            "Selected days:",
            selectedDays
        );
    });
});

// SELECT PREFERRED TIME
const timeButtons =
document.querySelectorAll(".time-btn");
let selectedTime = "";

timeButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        timeButtons.forEach(btn=>{
            btn.classList.remove("active");
        });
        button.classList.add("active");
        selectedTime =
        button.textContent.trim();
        console.log(
            "Selected time:",
            selectedTime
        );
    });
});

// RADIO CARD EFFECTS
const radioOptions =
document.querySelectorAll(
".level-option input, .goal-option input"
);

radioOptions.forEach(radio=>{
    radio.addEventListener("change",()=>{
        console.log(
            "Selected:",
            radio.value
        );
    });
});


// FAQ ACCORDION
document.addEventListener("DOMContentLoaded", () => {

    const questions = document.querySelectorAll(".faq-question");

    questions.forEach(question => {

        question.addEventListener("click", () => {

            const answer = question.nextElementSibling;
            const isOpen = answer.classList.contains("show");

            // Close every FAQ
            document.querySelectorAll(".faq-answer").forEach(item => {
                item.classList.remove("show");
            });

            document.querySelectorAll(".faq-question").forEach(btn => {
                btn.classList.remove("active");
            });

            // If it wasn't already open, open it
            if (!isOpen) {
                answer.classList.add("show");
                question.classList.add("active");
            }

        });

    });

});

// FORM SUBMISSION
const bookingForm =
document.querySelector(".booking-form");

if(bookingForm){
bookingForm.addEventListener(
"submit",
function(event){
    event.preventDefault();

    const requiredInputs =
    bookingForm.querySelectorAll(
        "input[required]"
    );
    let valid = true;

    requiredInputs.forEach(input=>{
        if(input.value.trim()===""){
            valid=false;
            input.style.borderColor=
            "var(--red)";
        }
        else{
            input.style.borderColor=
            "black";
        }
    });

    const selectedLevel =
    document.querySelector(
        'input[name="level"]:checked'
    );
    const selectedGoal =
    document.querySelector(
        'input[name="goal"]:checked'
    );

    if(!selectedLevel){
        valid=false;
    }
    if(!selectedGoal){
        valid=false;
    }

    if(selectedDays.length===0){
        valid=false;
    }
    if(selectedTime===""){
        valid=false;
    }
    if(!valid){
        alert(
        "لطفاً تمام بخش‌های ضروری فرم را تکمیل کنید."
        );
        return;
    }

    const formData = {
        name:
        bookingForm
        .querySelector(
        'input[type="text"]'
        )
        .value,
        email:
        bookingForm
        .querySelector(
        'input[type="email"]'
        )
        .value,
        phone:
        bookingForm
        .querySelector(
        'input[type="tel"]'
        )
        .value,
        age:
        bookingForm
        .querySelector(
        'input[type="number"]'
        )
        .value,
        level:
        selectedLevel.value,
        goal:
        selectedGoal.value,
        days:
        selectedDays,
        time:
        selectedTime,
        notes:
        bookingForm
        .querySelector("textarea")
        .value
    };

    console.log(
        "Booking request:",
        formData
    );
    alert(
    "درخواست شما با موفقیت ثبت شد. به زودی با شما تماس خواهم گرفت."
    );
    bookingForm.reset();

    dayButtons.forEach(button=>{
        button.classList.remove("active");
    });
    timeButtons.forEach(button=>{
        button.classList.remove("active");
    });

    selectedDays=[];
    selectedTime="";
});
}