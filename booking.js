/* =========================================================
   BOOKING PAGE JAVASCRIPT
   English With Mahdis
========================================================= */


/* =========================================================
   HAMBURGER MENU
========================================================= */


const hamburger = document.querySelector(".hamburger");
const navLinks = document.getElementById("nav-links");


if(hamburger && navLinks){

    hamburger.addEventListener("click", function(event){

        event.stopPropagation();

        navLinks.classList.toggle("active");

    });


    document.addEventListener("click", function(event){

        if(
            navLinks.classList.contains("active") &&
            !navLinks.contains(event.target) &&
            !hamburger.contains(event.target)
        ){

            navLinks.classList.remove("active");

        }

    });


}



/* =========================================================
   LESSONS DROPDOWN
========================================================= */


const lessonsBtn =
document.getElementById("lessons-btn");


const lessonsMenu =
document.getElementById("lessons-menu");



if(lessonsBtn && lessonsMenu){


    lessonsBtn.addEventListener("click",function(e){


        e.preventDefault();


        lessonsMenu.classList.toggle("show");


    });



    document.addEventListener("click",function(event){


        if(
            !lessonsBtn.contains(event.target) &&
            !lessonsMenu.contains(event.target)
        ){

            lessonsMenu.classList.remove("show");

        }


    });


}



/* =========================================================
   SELECT PREFERRED DAYS
========================================================= */


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



/* =========================================================
   SELECT PREFERRED TIME
========================================================= */


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



/* =========================================================
   RADIO CARD EFFECTS
========================================================= */


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



/* =========================================================
   FAQ ACCORDION
========================================================= */


const faqButtons =
document.querySelectorAll(".faq-question");



faqButtons.forEach(button=>{


    button.addEventListener("click",()=>{


        const answer =
        button.nextElementSibling;



        answer.classList.toggle("show");



        const icon =
        button.querySelector("i");



        if(icon){


            icon.classList.toggle(
                "fa-chevron-down"
            );


            icon.classList.toggle(
                "fa-chevron-up"
            );


        }


    });


});



/* =========================================================
   FORM SUBMISSION
========================================================= */


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