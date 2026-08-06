// =========================================================
// SUPABASE CONNECTION
// =========================================================
const SUPABASE_URL = "https://pmroefvktvgujgtkjxtn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_R1U96jzlorvCDQwWIRcbwg_994ysgkc";
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
// =========================================================
// ADMIN AUTHENTICATION
// =========================================================
async function requireAdminLogin() {
    const {
        data,
        error
    } = await supabaseClient.auth.getSession();
    if (error) {
        console.error(
            "Could not verify admin session:",
            error
        );
        window.location.replace(
            "admin-login.html"
        );
        return false;
    }
    if (!data.session) {
        window.location.replace(
            "admin-login.html"
        );
        return false;
    }
    return true;
}
// =========================================================
// DOM ELEMENTS
// =========================================================
const bookingTable =
    document.getElementById("bookingTable");
const totalBookings =
    document.getElementById("totalBookings");
const pendingBookings =
    document.getElementById("pendingBookings");
const confirmedBookings =
    document.getElementById("confirmedBookings");
const cancelledBookings =
    document.getElementById("cancelledBookings");
// =========================================================
// LOAD BOOKINGS
// =========================================================
async function loadBookings() {
    // Show loading state
    bookingTable.innerHTML = `
        <tr>
            <td colspan="8">
                در حال دریافت اطلاعات...
            </td>
        </tr>
    `;
    const { data, error } = await supabaseClient
        .from("bookings")
        .select(`
            id,
            full_name,
            email,
            phone,
            age,
            goal,
            booking_date,
            booking_time,
            notes,
            status
        `)
        .order("booking_date", {
            ascending: true
        })
        .order("booking_time", {
            ascending: true
        });
        console.log("BOOKINGS DATA:", data);
        console.log("BOOKINGS ERROR:", error);
    // -----------------------------------------------------
    // HANDLE ERROR
    // -----------------------------------------------------
    if (error) {
        console.error(
            "Could not load bookings:",
            error
        );
        bookingTable.innerHTML = `
            <tr>
                <td colspan="8">
                    دریافت اطلاعات رزروها با خطا مواجه شد.
                </td>
            </tr>
        `;
        return;
    }
    // -----------------------------------------------------
    // UPDATE STATISTICS
    // -----------------------------------------------------
    updateStatistics(data);
    // -----------------------------------------------------
    // HANDLE EMPTY TABLE
    // -----------------------------------------------------
    if (!data || data.length === 0) {
        bookingTable.innerHTML = `
            <tr>
                <td colspan="8">
                    هنوز هیچ درخواستی ثبت نشده است.
                </td>
            </tr>
        `;
        return;
    }
    // -----------------------------------------------------
    // DISPLAY BOOKINGS
    // -----------------------------------------------------
    bookingTable.innerHTML = "";
    data.forEach(booking => {
        const row =
            document.createElement("tr");
        row.innerHTML = `
            <td>
                ${escapeHTML(booking.full_name)}
            </td>
            <td>
                ${escapeHTML(booking.email)}
            </td>
            <td>
                ${escapeHTML(booking.phone)}
            </td>
            <td>
                ${formatGoal(booking.goal)}
            </td>
            <td>
                ${formatDate(booking.booking_date)}
            </td>
            <td>
                ${formatTime(booking.booking_time)}
            </td>
            <td>
                ${createStatusBadge(booking.status)}
            </td>
            <td>
                ${createActionButtons(booking)}
            </td>
        `;
        bookingTable.appendChild(row);
    });
    // -----------------------------------------------------
    // ADD BUTTON EVENTS
    // -----------------------------------------------------
    attachActionListeners();
}
// =========================================================
// UPDATE STATISTICS
// =========================================================
function updateStatistics(bookings) {
    const total =
        bookings.length;
    const pending =
        bookings.filter(
            booking =>
                booking.status === "pending"
        ).length;
    const confirmed =
        bookings.filter(
            booking =>
                booking.status === "confirmed"
        ).length;
    const cancelled =
        bookings.filter(
            booking =>
                booking.status === "cancelled"
        ).length;
    totalBookings.textContent =
        persianNumber(total);
    pendingBookings.textContent =
        persianNumber(pending);
    confirmedBookings.textContent =
        persianNumber(confirmed);
    cancelledBookings.textContent =
        persianNumber(cancelled);
}
// =========================================================
// CREATE STATUS BADGE
// =========================================================
function createStatusBadge(status) {
    switch (status) {
        case "pending":
            return `
                <span class="status-badge pending">
                    در انتظار بررسی
                </span>
            `;
        case "confirmed":
            return `
                <span class="status-badge confirmed">
                    تأیید شده
                </span>
            `;
        case "cancelled":
            return `
                <span class="status-badge cancelled">
                    لغو شده
                </span>
            `;
        default:
            return `
                <span class="status-badge">
                    ${escapeHTML(status || "نامشخص")}
                </span>
            `;
    }
}
// =========================================================
// CREATE ACTION BUTTONS
// =========================================================
function createActionButtons(booking) {
    // ---------------------------------------------
    // PENDING BOOKING
    // ---------------------------------------------
    if (booking.status === "pending") {
        return `
            <div class="action-buttons">
                <button
                    type="button"
                    class="confirm-btn"
                    data-action="confirm"
                    data-id="${booking.id}"
                >
                    <i class="fa-solid fa-check"></i>
                    تأیید
                </button>
                <button
                    type="button"
                    class="cancel-btn"
                    data-action="cancel"
                    data-id="${booking.id}"
                >
                    <i class="fa-solid fa-xmark"></i>
                    لغو
                </button>
            </div>
        `;
    }
    // ---------------------------------------------
    // CONFIRMED BOOKING
    // ---------------------------------------------
    if (booking.status === "confirmed") {
        return `
            <div class="action-buttons">
                <button
                    type="button"
                    class="cancel-btn"
                    data-action="cancel"
                    data-id="${booking.id}"
                >
                    <i class="fa-solid fa-xmark"></i>
                    لغو
                </button>
            </div>
        `;
    }
    // ---------------------------------------------
    // CANCELLED BOOKING
    // ---------------------------------------------
    if (booking.status === "cancelled") {
        return `
            <div class="action-buttons">
                <button
                    type="button"
                    class="confirm-btn"
                    data-action="confirm"
                    data-id="${booking.id}"
                >
                    <i class="fa-solid fa-check"></i>
                    تأیید مجدد
                </button>
            </div>
        `;
    }
    return `
        <span>
            -
        </span>
    `;
}
// =========================================================
// ATTACH ACTION BUTTON EVENTS
// =========================================================
function attachActionListeners() {
    const buttons =
        document.querySelectorAll(
            "[data-action]"
        );
    buttons.forEach(button => {
        button.addEventListener(
            "click",
            async function () {
                const bookingId =
                    this.dataset.id;
                const action =
                    this.dataset.action;
                if (action === "confirm") {
                    await updateBookingStatus(
                        bookingId,
                        "confirmed"
                    );
                }
                if (action === "cancel") {
                    await updateBookingStatus(
                        bookingId,
                        "cancelled"
                    );
                }
            }
        );
    });
}
// =========================================================
// UPDATE BOOKING STATUS
// =========================================================
async function updateBookingStatus(
    bookingId,
    newStatus
) {
    let confirmationMessage = "";
    if (newStatus === "confirmed") {
        confirmationMessage =
            "آیا از تأیید این درخواست مطمئن هستید؟";
    }
    if (newStatus === "cancelled") {
        confirmationMessage =
            "آیا از لغو این درخواست مطمئن هستید؟";
    }
    const confirmed =
        window.confirm(
            confirmationMessage
        );
    if (!confirmed) {
        return;
    }
    // Find clicked button
    const buttons =
        document.querySelectorAll(
            `[data-id="${bookingId}"]`
        );
    // Disable buttons while processing
    buttons.forEach(button => {
        button.disabled = true;
    });
    const { error } =
        await supabaseClient
            .from("bookings")
            .update({
                status: newStatus
            })
            .eq("id", bookingId);
    // -----------------------------------------------------
    // HANDLE ERROR
    // -----------------------------------------------------
    if (error) {
        console.error(
            "Could not update booking status:",
            error
        );
        alert(
            "تغییر وضعیت رزرو انجام نشد. لطفاً دوباره تلاش کنید."
        );
        buttons.forEach(button => {
            button.disabled = false;
        });
        return;
    }
    // -----------------------------------------------------
    // SUCCESS
    // -----------------------------------------------------
    if (newStatus === "confirmed") {
        alert(
            "درخواست رزرو با موفقیت تأیید شد."
        );
    } else {
        alert(
            "درخواست رزرو لغو شد."
        );
    }
    // Reload everything
    await loadBookings();
}
// =========================================================
// FORMAT DATE
// =========================================================
function formatDate(dateString) {
    if (!dateString) {
        return "-";
    }
    const [
        year,
        month,
        day
    ] = dateString.split("-");
    return (
        persianNumber(day) +
        "/" +
        persianNumber(month) +
        "/" +
        persianNumber(year)
    );
}
// =========================================================
// FORMAT TIME
// =========================================================
function formatTime(timeString) {
    if (!timeString) {
        return "-";
    }
    return timeString.substring(0, 5);
}
// =========================================================
// FORMAT GOAL
// =========================================================
function formatGoal(goal) {
    switch (goal) {
        case "general":
        case "general-english":
        case "General English":
            return "انگلیسی عمومی";
        case "conversation":
        case "Conversation":
            return "مکالمه";
        case "ielts":
        case "IELTS":
            return "IELTS";
        default:
            return escapeHTML(
                goal || "-"
            );
    }
}
// =========================================================
// PERSIAN NUMBERS
// =========================================================
function persianNumber(number) {
    return String(number)
        .replace(
            /\d/g,
            digit =>
                "۰۱۲۳۴۵۶۷۸۹"[digit]
        );
}
// =========================================================
// SECURITY
// =========================================================
// Prevent database text from being interpreted as HTML.
function escapeHTML(value) {
    if (value === null || value === undefined) {
        return "";
    }
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
// =========================================================
// INITIAL LOAD
// =========================================================
(async function initAdminDashboard() {
    const authenticated =
        await requireAdminLogin();
    if (!authenticated) {
        return;
    }
    await loadBookings();
})();