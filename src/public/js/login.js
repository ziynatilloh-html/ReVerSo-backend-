document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".login-container");
  const usernameInput = document.querySelector(".member-nick");
  const passwordInput = document.querySelector(".member-password");

  loginForm.addEventListener("submit", function (event) {
    if (
      usernameInput.value.trim() === "" ||
      passwordInput.value.trim() === ""
    ) {
      event.preventDefault();
      alert("Please fill in both fields.");
    }
  });

  // Add enter key event listener
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      loginForm.submit();
    }
  });
});
