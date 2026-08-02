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


/* ==========================
   PERSIAN (JALALI) CALENDAR
========================== */


const monthName = document.getElementById("month-name");
const calendarGrid = document.getElementById("calendarGrid");
const timeGrid = document.getElementById("timeGrid");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");


// Current Persian date
let today = jalaali.toJalaali(new Date());

let currentYear = today.jy;
let currentMonth = today.jm;

let selectedDate = null;



/*
    Available class times

    Format:

    "Jalali Year-Month-Day"

*/

const availability = {

    "1405-05-15": [
        "09:00",
        "11:00",
        "15:00"
    ],

    "1405-05-18": [
        "14:00",
        "17:00"
    ],

    "1405-05-22": [
        "10:00",
        "12:00",
        "18:00"
    ],

    "1405-06-02": [
        "09:00",
        "13:00"
    ],

    "1405-06-10": [
        "11:00",
        "16:00"
    ]

};



/*
    Convert numbers into Persian format
*/

function persianNumber(number){

    return number
    .toString()
    .replace(/\d/g,function(d){
        return "۰۱۲۳۴۵۶۷۸۹"[d];
    });

}



/*
    Persian month names
*/

const persianMonths = [

    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند"

];



/*
    Convert Jalali date to string

    Example:

    1405-05-15

*/

function formatJalaliDate(year,month,day){

    return (
        year +
        "-" +
        String(month).padStart(2,"0") +
        "-" +
        String(day).padStart(2,"0")
    );

}




function generateCalendar(){


    calendarGrid.innerHTML="";


    /*
        Show month title
    */

    monthName.textContent =
        persianMonths[currentMonth-1]
        +
        " "
        +
        persianNumber(currentYear);



    /*
        Number of days in this month
    */

    const daysInMonth =
        jalaali.jalaaliMonthLength(
            currentYear,
            currentMonth
        );



    /*
        Find first weekday

        Calendar starts Saturday

    */

    const gregorianFirstDay =
        jalaali.toGregorian(
            currentYear,
            currentMonth,
            1
        );


    const firstDay =
        new Date(
            gregorianFirstDay.gy,
            gregorianFirstDay.gm-1,
            gregorianFirstDay.gd
        );



    /*
        JavaScript:

        Sunday = 0

        We need:

        Saturday = 0

    */

    let offset =
        (firstDay.getDay()+1)%7;



    /*
        Empty boxes before month starts
    */

    for(
        let i=0;
        i<offset;
        i++
    ){

        const empty =
        document.createElement("div");

        calendarGrid.appendChild(empty);

    }




    /*
        Create days
    */

    for(
        let day=1;
        day<=daysInMonth;
        day++
    ){


        const button =
        document.createElement("button");


        button.className =
        "calendar-day";


        button.textContent =
        persianNumber(day);



        const dateKey =
        formatJalaliDate(
            currentYear,
            currentMonth,
            day
        );



        /*
            Check availability
        */

        if(
            availability[dateKey]
        ){

            button.classList.add(
                "available"
            );

        }



        /*
            Disable past dates
        */

        if(
            isPastDate(
                currentYear,
                currentMonth,
                day
            )
        ){

            button.disabled=true;

            button.classList.add(
                "disabled"
            );

        }



        button.addEventListener(
            "click",
            ()=>{


                if(
                    !availability[dateKey]
                )
                return;



                document
                .querySelectorAll(
                    ".calendar-day"
                )
                .forEach(btn=>{
                    btn.classList.remove(
                        "active"
                    );
                });



                button.classList.add(
                    "active"
                );


                selectedDate=dateKey;


                loadTimes(dateKey);


            }
        );



        calendarGrid.appendChild(button);


    }


}




/*
    Check if selected date is before today
*/


function isPastDate(
    year,
    month,
    day
){


    const selected =
    jalaali.toGregorian(
        year,
        month,
        day
    );


    const selectedGregorian =
    new Date(
        selected.gy,
        selected.gm-1,
        selected.gd
    );


    const now =
    new Date();


    now.setHours(
        0,0,0,0
    );


    return selectedGregorian < now;

}





/*
    Generate available times
*/


function loadTimes(date){


    timeGrid.innerHTML="";


    const times =
    availability[date];


    if(!times){

        timeGrid.innerHTML =
        "<p>No available times.</p>";

        return;

    }



    times.forEach(time=>{


        const button =
        document.createElement(
            "button"
        );


        button.type="button";


        button.className =
        "time-btn";


        button.textContent =
        time;



        button.addEventListener(
            "click",
            ()=>{


                document
                .querySelectorAll(
                    ".time-btn"
                )
                .forEach(btn=>{
                    btn.classList.remove(
                        "active"
                    );
                });


                button.classList.add(
                    "active"
                );


            }
        );


        timeGrid.appendChild(button);


    });


}




/*
    Previous month
*/

prevMonth.addEventListener(
    "click",
    ()=>{


        currentMonth--;


        if(currentMonth===0){

            currentMonth=12;

            currentYear--;

        }


        generateCalendar();


    }
);




/*
    Next month
*/

nextMonth.addEventListener(
    "click",
    ()=>{


        currentMonth++;


        if(currentMonth===13){

            currentMonth=1;

            currentYear++;

        }


        generateCalendar();


    }
);




generateCalendar();