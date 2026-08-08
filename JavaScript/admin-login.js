// =========================================================
// SUPABASE CONNECTION
// =========================================================
const SUPABASE_URL =
    "https://pmroefvktvgujgtkjxtn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_R1U96jzlorvCDQwWIRcbwg_994ysgkc";
const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

// =========================================================
// DOM ELEMENTS
// =========================================================
const loginForm =
    document.getElementById("admin-login-form");
const emailInput =
    document.getElementById("email");
const passwordInput =
    document.getElementById("password");
const loginButton =
    document.getElementById("login-btn");
const loginError =
    document.getElementById("login-error");
const togglePassword =
    document.getElementById("toggle-password");

// =========================================================
// CHECK IF ALREADY LOGGED IN
// =========================================================
async function checkExistingSession() {
    const {
        data,
        error
    } = await supabaseClient.auth.getSession();
    if (error) {
        console.error(
            "Could not check session:",
            error
        );
        return;
    }
    if (data.session) {
        window.location.replace(
            "admin-dashboard.html"
        );
    }
}
// =========================================================
// PASSWORD VISIBILITY
// =========================================================
togglePassword.addEventListener(
    "click",
    function () {
        const isPassword =
            passwordInput.type === "password";
        passwordInput.type =
            isPassword
                ? "text"
                : "password";
        this.innerHTML =
            isPassword
                ? '<i class="fa-solid fa-eye-slash"></i>'
                : '<i class="fa-solid fa-eye"></i>';
    }
);
// =========================================================
// LOGIN
// =========================================================
loginForm.addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();
        loginError.textContent = "";
        const email =
            emailInput.value.trim();
        const password =
            passwordInput.value;
        if (!email || !password) {
            loginError.textContent =
                "لطفاً ایمیل و رمز عبور را وارد کنید.";
            return;
        }
        // Disable button
        loginButton.disabled = true;
        loginButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            در حال ورود...
        `;
        const {
            data,
            error
        } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        // =====================================================
        // LOGIN ERROR
        // =====================================================
        if (error) {
            console.error(
                "Login error:",
                error
            );
            loginError.textContent =
                "ایمیل یا رمز عبور صحیح نیست.";
            loginButton.disabled = false;
            loginButton.innerHTML = `
                <i class="fa-solid fa-right-to-bracket"></i>
                ورود به پنل
            `;
            return;
        }
        // =====================================================
        // LOGIN SUCCESS
        // =====================================================
        console.log(
            "Admin login successful:",
            data.user
        );
        window.location.replace(
            "admin-dashboard.html"
        );
    }
);
// =========================================================
// INITIAL CHECK
// =========================================================
checkExistingSession();