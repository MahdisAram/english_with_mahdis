const SUPABASE_URL = "https://pmroefvktvgujgtkjxtn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_R1U96jzlorvCDQwWIRcbwg_994ysgkc";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

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

// RADIO CARD EFFECTS
const radioOptions =
document.querySelectorAll(
".goal-option input"
);

radioOptions.forEach(radio=>{
    radio.addEventListener("change",()=>{
        console.log(
            "Selected:",
            radio.value
        );
        const goalGrid = document.querySelector(".goal-grid");
        goalGrid.classList.remove("error");
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
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
    bookingForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const submitButton = bookingForm.querySelector(".submit-btn");
        const originalButtonHTML = submitButton.innerHTML;
        // --------------------------------
        // BASIC FORM VALIDATION
        // --------------------------------
        const fullNameInput =
            document.getElementById("fullName");
        const emailInput =
            document.getElementById("email");
        const phoneInput =
            document.getElementById("phone");
        const ageInput =
            bookingForm.querySelector('input[type="number"]');
        const selectedGoal =
            document.querySelector(
                'input[name="goal"]:checked'
            );
        const notesInput =
            bookingForm.querySelector("textarea");
        let valid = true;

        // Check text inputs
        [
            fullNameInput,
            emailInput,
            phoneInput
        ].forEach(input => {
            if (input.value.trim() === "") {
                valid = false;
                input.style.borderColor =
                    "var(--red)";
            } else {
                input.style.borderColor =
                    "black";
            }
        });
        // Check goal
        const goalGrid = document.querySelector(".goal-grid");

        if (!selectedGoal) {
            valid = false;
            goalGrid.classList.add("error");
        } else {
            goalGrid.classList.remove("error");
        }
        // Check date
        if (!selectedDate) {
            valid = false;
        }
        // Check time
        if (!selectedTime) {
            valid = false;
        }
        if (!valid) {
            alert(
                "لطفاً تمام بخش‌های ضروری فرم را تکمیل کنید."
            );
            return;
        }
        // Prevent duplicate submissions while Supabase is processing
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            در حال ثبت...
        `;


        // --------------------------------
        // CONVERT JALALI DATE → GREGORIAN
        // --------------------------------
        const [
            jalaliYear,
            jalaliMonth,
            jalaliDay
        ] = selectedDate
            .split("-")
            .map(Number);
        const gregorianDate =
            jalaali.toGregorian(
                jalaliYear,
                jalaliMonth,
                jalaliDay
            );
        const bookingDate =
            `${gregorianDate.gy}-${String(gregorianDate.gm).padStart(2, "0")}-${String(gregorianDate.gd).padStart(2, "0")}`;
        
        // --------------------------------
        // CREATE BOOKING OBJECT
        // --------------------------------
        const bookingData = {
            full_name:
                fullNameInput.value.trim(),
            email:
                emailInput.value.trim(),
            phone:
                phoneInput.value.trim(),
            age:
                ageInput.value
                    ? Number(ageInput.value)
                    : null,
            goal:
                selectedGoal.value,
            booking_date:
                bookingDate,
            booking_time:
                selectedTime,
            notes:
                notesInput.value.trim() || null,
            status:
                "pending"
        };
        console.log(
            "Sending booking:",
            bookingData
        );

        // --------------------------------
        // SEND BOOKING TO SUPABASE
        // --------------------------------
        const { error: bookingError } =
        await supabaseClient
            .from("bookings")
            .insert([bookingData]);

        // --------------------------------
        // HANDLE BOOKING ERROR
        // --------------------------------
        if (bookingError) {
        console.error(
            "Booking submission error:",
            bookingError
        );
        if (bookingError.code === "23505") {
            alert(
                "متأسفانه این زمان توسط زبان‌آموز دیگری رزرو شده است. لطفاً زمان دیگری انتخاب کنید."
            );
        } else {
            alert(
                "ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید."
            );
        }
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHTML;
        return;
        }
        // --------------------------------
        // FIND AND MARK SLOT AS UNAVAILABLE
        // --------------------------------

        console.log("Looking for slot:");
        console.log("bookingDate:", bookingDate);
        console.log("selectedTime:", selectedTime);

        const { data: matchingSlots, error: findSlotError } =
            await supabaseClient
                .from("available_slots")
                .select("booking_date, booking_time, is_available")
                .eq("booking_date", bookingDate);

        console.log("Slots on this date:", matchingSlots);
        console.log("Find slot error:", findSlotError);

        if (findSlotError) {
            console.error("Could not find available slot:", findSlotError);
            alert("خطا در بررسی زمان انتخاب‌شده.");
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHTML;
            return;
        }

        // Find the exact time.
        // Database returns "14:20:00"
        // selectedTime is "14:20"
        const matchingSlot = matchingSlots.find(
            slot => slot.booking_time.substring(0, 5) === selectedTime
        );

        console.log("Matching slot:", matchingSlot);

        if (!matchingSlot) {
            console.error("No matching slot found.");
            alert("زمان انتخاب‌شده دیگر در دسترس نیست.");
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHTML;
            return;
        }

        // --------------------------------
        // MARK SLOT AS UNAVAILABLE
        // --------------------------------

        console.log("Attempting to disable slot:");
        console.log("Date:", bookingDate);
        console.log("Time:", matchingSlot.booking_time);

        const { data: updatedSlot, error: slotUpdateError } =
            await supabaseClient
                .from("available_slots")
                .update({
                    is_available: false
                })
                .eq("booking_date", bookingDate)
                .eq("booking_time", matchingSlot.booking_time)
                .select();

        console.log("Updated slot:", updatedSlot);
        console.log("Slot update error:", slotUpdateError);

        // Supabase can return no error but update ZERO rows.
        // Therefore we must check updatedSlot.length too.
        if (slotUpdateError || !updatedSlot || updatedSlot.length === 0) {

            console.error(
                "Slot was NOT updated.",
                {
                    error: slotUpdateError,
                    updatedRows: updatedSlot
                }
            );

            alert(
                "رزرو ثبت شد، اما زمان انتخاب‌شده از لیست زمان‌های موجود حذف نشد."
            );
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHTML;
            return;
        }

        console.log("SUCCESS: Slot is now unavailable.");
        // --------------------------------
        // SUCCESS
        // --------------------------------
        alert(
            "درخواست شما با موفقیت ثبت شد. به زودی با شما تماس خواهم گرفت."
        );
        // Reset form
        bookingForm.reset();
        // Restore the submit button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHTML;
        await loadAvailability();
        // Reset calendar selection
        selectedDate = null;
        selectedTime = "";
        document
            .querySelectorAll(".calendar-day")
            .forEach(button => {
                button.classList.remove("active");
            });
        timeGrid.innerHTML =
            "<p>لطفاً ابتدا تاریخ را انتخاب کنید.</p>";
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
let availability = {};
let selectedTime = "";

document
    .querySelectorAll(".time-btn")
    .forEach(btn => btn.remove());
timeGrid.innerHTML = "<p>لطفاً ابتدا تاریخ را انتخاب کنید.</p>";

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

async function loadAvailability() {
    const { data, error } = await supabaseClient
        .from("available_slots")
        .select("booking_date, booking_time")
        .eq("is_available", true)
        .order("booking_date")
        .order("booking_time");
    if (error) {
        console.error(
            "Could not load available slots:",
            error
        );
        timeGrid.innerHTML =
            "<p>خطا در دریافت زمان‌های موجود.</p>";
        return;
    }
    availability = {};
    data.forEach(slot => {
        // Convert database date into a JavaScript Date
        const [year, month, day] =
            slot.booking_date
            .split("-")
            .map(Number);
        // Convert Gregorian → Jalali
        const jalaliDate =
            jalaali.toJalaali(
                year,
                month,
                day
            );
        const dateKey =
            formatJalaliDate(
                jalaliDate.jy,
                jalaliDate.jm,
                jalaliDate.jd
            );
        
        if (!availability[dateKey]) {
            availability[dateKey] = [];
        }
        // Supabase time may come back as "17:00:00"
        const time =
            slot.booking_time.substring(0, 5);
        availability[dateKey].push(time);
    });
    generateCalendar();
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
        const button = document.createElement("button");
        button.type = "button"; // IMPORTANT: prevents form submission
        button.className = "calendar-day";
        button.textContent = persianNumber(day);

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
        button.addEventListener("click", () => {
            if (!availability[dateKey]) {
                return;
            }
            document
                .querySelectorAll(".calendar-day")
                .forEach(btn => {
                    btn.classList.remove("active");
                });
            button.classList.add("active");
            selectedDate = dateKey;
            // Reset previously selected time
            selectedTime = "";
            loadTimes(dateKey);
        });
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
function loadTimes(date) {
    timeGrid.innerHTML = "";
    const times = availability[date];

    if (!times || times.length === 0) {
        timeGrid.innerHTML =
            "<p>برای این تاریخ زمانی موجود نیست.</p>";
        return;
    }
    times.forEach(time => {
        const button =
            document.createElement("button");
        button.type = "button";
        button.className = "time-btn";
        button.textContent = time;
        button.addEventListener(
            "click",
            () => {
                document
                    .querySelectorAll(".time-btn")
                    .forEach(btn => {
                        btn.classList.remove("active");
                    });
                button.classList.add("active");
                selectedTime = time;
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

loadAvailability();