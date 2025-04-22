// public/login.js

// Called by <button onclick="login()">Login</button>
async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const messageEl = document.getElementById("message");

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (res.ok && data.success) {
      messageEl.textContent = "✅ Login successful! Redirecting to divisions...";
      // store username for later pages
      localStorage.setItem("username", username);
      // give user a moment to see the message
      setTimeout(() => {
        window.location.href = "/divisions.html";
      }, 500);
    } else {
      messageEl.textContent = data.message || "❌ Login failed.";
    }
  } catch (err) {
    console.error("Login error:", err);
    messageEl.textContent = "❌ An error occurred. Try again.";
  }
}

// Called by <button onclick="register()">Register</button>
async function register() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const messageEl = document.getElementById("message");

  try {
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (res.ok && data.success) {
      messageEl.textContent = "✅ Registration successful! You can now log in.";
    } else {
      messageEl.textContent = data.message || "❌ Registration failed.";
    }
  } catch (err) {
    console.error("Registration error:", err);
    messageEl.textContent = "❌ An error occurred. Try again.";
  }
}
