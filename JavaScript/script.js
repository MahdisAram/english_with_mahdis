const SUPABASE_URL = "https://pmroefvktvgujgtkjxtn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_R1U96jzlorvCDQwWIRcbwg_994ysgkc";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
// ==========================
// HAMBURGER MENU
// ==========================
const hamburger = document.querySelector(".hamburger");
const navLinks = document.getElementById("nav-links");
if (hamburger && navLinks) {
    hamburger.addEventListener("click", (event) => {
        navLinks.classList.toggle("active");
        event.stopPropagation();
    });
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });
}
// ==========================
// LESSONS DROPDOWN
// ==========================
const lessonsDropdown = document.querySelector(".lessons-dropdown");
const lessonsBtn = document.getElementById("lessons-btn");
const lessonsMenu = document.getElementById("lessons-menu");

if (lessonsDropdown && lessonsMenu) {
    lessonsDropdown.addEventListener("mouseenter", () => {
        lessonsMenu.classList.add("show");
    });
    lessonsDropdown.addEventListener("mouseleave", () => {
        lessonsMenu.classList.remove("show");
    });
}
// ==========================
// CLOSE NAV MENUS OUTSIDE CLICK
// ==========================
document.addEventListener("click", (event) => {
    if (
        navLinks &&
        hamburger &&
        navLinks.classList.contains("active") &&
        !navLinks.contains(event.target) &&
        !hamburger.contains(event.target)
    ) {
        navLinks.classList.remove("active");
    }
    if (
        lessonsDropdown &&
        lessonsMenu &&
        !lessonsDropdown.contains(event.target)
    ) {
        lessonsMenu.classList.remove("show");
    }
});
// ==========================
// READ MORE BUTTONS
// ==========================
document.querySelectorAll(".read-more-btn")
.forEach(button => {
    button.addEventListener("click", () => {
        const moreText =
            button
            .closest(".card-body")
            .querySelector(".more-text");
        moreText.classList.toggle("show");
        button.textContent =
            moreText.classList.contains("show")
            ? "بستن"
            : "ادامه مطلب";
    });
});
// ==========================
// GOAL RADIO BUTTONS
// ==========================
document.querySelectorAll(".goal-option input")
.forEach(radio => {
    radio.addEventListener("change", () => {
        const goalGrid =
            document.querySelector(".goal-grid");
        if (goalGrid) {
            goalGrid.classList.remove("error");
        }
    });
});
// ==========================
// FAQ ACCORDION
// ==========================
document.querySelectorAll(".faq-question")
.forEach(question => {
    question.addEventListener("click", () => {
        const answer =
            question.nextElementSibling;
        const isOpen =
            answer.classList.contains("show");
        document.querySelectorAll(".faq-answer")
        .forEach(item => {
            item.classList.remove("show");
        });
        document.querySelectorAll(".faq-question")
        .forEach(button => {
            button.classList.remove("active");
        });
        if (!isOpen) {
            answer.classList.add("show");
            question.classList.add("active");
        }
    });
});
// ==========================
// FORM SUBMISSION
// ==========================
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton =
        bookingForm.querySelector(".submit-btn");
    const originalButtonHTML =
        submitButton.innerHTML;
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
    const goalGrid =
        document.querySelector(".goal-grid");
    if (!selectedGoal) {
        valid = false;
        goalGrid.classList.add("error");
    } else {
        goalGrid.classList.remove("error");
    }
    if (!selectedDate || !selectedTime) {
        valid = false;
    }
    if (!valid) {
        alert(
            "لطفاً تمام بخش‌های ضروری فرم را تکمیل کنید."
        );
        return;
    }
    submitButton.disabled = true;
    submitButton.innerHTML =
    `
        <i class="fa-solid fa-spinner fa-spin"></i>
        در حال ثبت...
    `;
    const [
        jalaliYear,
        jalaliMonth,
        jalaliDay
    ] = selectedDate.split("-").map(Number);
    const gregorian =
        jalaali.toGregorian(
            jalaliYear,
            jalaliMonth,
            jalaliDay
        );
    const bookingDate =
        `${gregorian.gy}-${String(gregorian.gm).padStart(2,"0")}-${String(gregorian.gd).padStart(2,"0")}`;
    const { error } =
        await supabaseClient.rpc(
            "create_booking",
            {
                p_full_name:
                    fullNameInput.value.trim(),
                p_email:
                    emailInput.value.trim(),
                p_phone:
                    phoneInput.value.trim(),
                p_age:
                    ageInput.value
                    ? Number(ageInput.value)
                    : null,
                p_goal:
                    selectedGoal.value,
                p_booking_date:
                    bookingDate,
                p_booking_time:
                    selectedTime,
                p_notes:
                    notesInput.value.trim() || null
            }
        );
    if (error) {
        if (
            error.message.includes("SLOT_UNAVAILABLE")
        ) {
            alert(
                "متأسفانه این زمان توسط زبان‌آموز دیگری رزرو شده است."
            );
        } else if (
            error.message.includes("BOOKING_ALREADY_EXISTS")
        ) {
            alert(
                "این درخواست قبلاً ثبت شده است."
            );
        } else {
            alert(
                "ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید."
            );
        }
        submitButton.disabled = false;
        submitButton.innerHTML =
            originalButtonHTML;
        return;
    }
    alert(
        "درخواست شما با موفقیت ثبت شد. به زودی با شما تماس خواهم گرفت."
    );
    bookingForm.reset();
    submitButton.disabled = false;
    submitButton.innerHTML =
        originalButtonHTML;
    await loadAvailability();
    selectedDate = null;
    selectedTime = "";

    document.querySelectorAll(".calendar-day")
    .forEach(button => {
        button.classList.remove("active");
    });
    timeGrid.innerHTML =
        "<p>لطفاً ابتدا تاریخ را انتخاب کنید.</p>";
});
}
// ==========================
// PERSIAN (JALALI) CALENDAR
// ==========================
const monthName =
    document.getElementById("month-name");
const calendarGrid =
    document.getElementById("calendarGrid");
const timeGrid =
    document.getElementById("timeGrid");
const prevMonth =
    document.getElementById("prevMonth");
const nextMonth =
    document.getElementById("nextMonth");
// ==========================
// CALENDAR STATE
// ==========================
// Get today's date based on Iran's timezone
const iranDate = new Date(
    new Date().toLocaleString("en-US", {
        timeZone: "Asia/Tehran"
    })
);
const today =
    jalaali.toJalaali(iranDate);
let currentYear =
    today.jy;
let currentMonth =
    today.jm;
let selectedDate =
    null;
let selectedTime =
    "";
let availability =
    {};
// ==========================
// INITIAL CALENDAR SETUP
// ==========================
if (timeGrid) {
    timeGrid.innerHTML =
        "<p>لطفاً ابتدا تاریخ را انتخاب کنید.</p>";
}
loadAvailability();
// ==========================
// PERSIAN NUMBERS
// ==========================
function persianNumber(number) {
    return number
        .toString()
        .replace(/\d/g, digit =>
            "۰۱۲۳۴۵۶۷۸۹"[digit]
        );
}
// ==========================
// PERSIAN MONTH NAMES
// ==========================
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
// ==========================
// FORMAT JALALI DATE
// ==========================
function formatJalaliDate(
    year,
    month,
    day
) {
    return (
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    );
}
// ==========================
// LOAD AVAILABLE SLOTS
// ==========================
async function loadAvailability() {
    const { data, error } =
        await supabaseClient
            .from("available_slots")
            .select(
                "booking_date, booking_time"
            )
            .eq("is_available", true)
            .order("booking_date")
            .order("booking_time");
    if (error) {
        timeGrid.innerHTML =
            "<p>خطا در دریافت زمان‌های موجود.</p>";
        return;
    }
    availability = {};
    data.forEach(slot => {
        const [
            year,
            month,
            day
        ] = slot.booking_date
            .split("-")
            .map(Number);
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
        const time =
            slot.booking_time.substring(0, 5);
        availability[dateKey].push(time);
    });
    generateCalendar();
}
// ==========================
// GENERATE CALENDAR
// ==========================
function generateCalendar() {
    calendarGrid.innerHTML = "";
    monthName.textContent =
        persianMonths[currentMonth - 1]
        + " "
        + persianNumber(currentYear);
    const daysInMonth =
        jalaali.jalaaliMonthLength(
            currentYear,
            currentMonth
        );
    // Find weekday of first day
    const gregorianFirstDay =
        jalaali.toGregorian(
            currentYear,
            currentMonth,
            1
        );
    const firstDay =
        new Date(
            gregorianFirstDay.gy,
            gregorianFirstDay.gm - 1,
            gregorianFirstDay.gd
        );
    // JavaScript:
    // Sunday = 0
    // Saturday = 6
    //
    // We want:
    // Saturday = 0
    const offset =
        (firstDay.getDay() + 1) % 7;
    // Empty cells before first day
    for (
        let i = 0;
        i < offset;
        i++
    ) {
        const empty =
            document.createElement("div");
        calendarGrid.appendChild(empty);
    }
    // Create calendar days
    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {
        const button =
            document.createElement("button");
        button.type =
            "button";
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
        // Mark available dates
        if (availability[dateKey]) {
            button.classList.add(
                "available"
            );
        }
        // Disable past dates
        if (
            isPastDate(
                currentYear,
                currentMonth,
                day
            )
        ) {
            button.disabled = true;
            button.classList.add(
                "disabled"
            );
        }
        // Date selection
        button.addEventListener(
            "click",
            () => {
                if (!availability[dateKey]) {
                    return;
                }
                document
                    .querySelectorAll(
                        ".calendar-day"
                    )
                    .forEach(btn => {
                        btn.classList.remove(
                            "active"
                        );
                    });
                button.classList.add(
                    "active"
                );
                selectedDate =
                    dateKey;
                selectedTime =
                    "";
                loadTimes(dateKey);
            }
        );
        calendarGrid.appendChild(
            button
        );
    }
}
// ==========================
// CHECK PAST DATE
// ==========================
function isPastDate(
    year,
    month,
    day
) {
    const selected =
        jalaali.toGregorian(
            year,
            month,
            day
        );
    const selectedGregorian =
        new Date(
            selected.gy,
            selected.gm - 1,
            selected.gd
        );
    const now =
        new Date();
    now.setHours(
        0,
        0,
        0,
        0
    );
    return (
        selectedGregorian < now
    );
}
// ==========================
// GENERATE AVAILABLE TIMES
// ==========================
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
        button.type =
            "button";
        button.className =
            "time-btn";
        button.textContent =
            time;
        button.addEventListener(
            "click",
            () => {
                document
                    .querySelectorAll(".time-btn")
                    .forEach(btn => {
                        btn.classList.remove(
                            "active"
                        );
                    });
                button.classList.add(
                    "active"
                );
                selectedTime =
                    time;
            }
        );
        timeGrid.appendChild(
            button
        );
    });
}
// ==========================
// PREVIOUS MONTH
// ==========================
prevMonth.addEventListener(
    "click",
    () => {
        currentMonth--;
        if (currentMonth === 0) {
            currentMonth = 12;
            currentYear--;
        }
        generateCalendar();
    }
);
// ==========================
// NEXT MONTH
// ==========================
nextMonth.addEventListener(
    "click",
    () => {
        currentMonth++;
        if (currentMonth === 13) {
            currentMonth = 1;
            currentYear++;
        }
        generateCalendar();
    }
);