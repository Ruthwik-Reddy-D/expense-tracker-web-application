const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const message = document.getElementById("auth-message");
const tabs = document.querySelectorAll(".tab");

const showMessage = (text, isError = true) => {
  message.textContent = text;
  message.style.color = isError ? "#ef4444" : "#16a34a";
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    document.querySelectorAll(".form-section").forEach((section) => {
      section.classList.remove("active");
    });

    const target = document.getElementById(`${tab.dataset.tab}-form`);
    target.classList.add("active");
    showMessage("");
  });
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      showMessage(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "/dashboard.html";
  } catch (error) {
    showMessage("Unable to login right now");
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      showMessage(data.message || "Registration failed");
      return;
    }

    showMessage("Account created. Please login.", false);
    document.querySelector(".tab[data-tab='login']").click();
  } catch (error) {
    showMessage("Unable to register right now");
  }
});
