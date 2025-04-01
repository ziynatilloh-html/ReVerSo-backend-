document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".login-container");
  const usernameInput = document.querySelector(".member-nick");
  const passwordInput = document.querySelector(".member-password");

  loginForm.addEventListener("submit", function (event) {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      event.preventDefault();
      alert("Please fill in both username and password.");
    }
  });

  // Eye icon toggle (keep this part)
  $(document).ready(function () {
    $(".eye-icon").on("click", function () {
      const passwordInput = $(this).siblings("input");
      const isPassword = passwordInput.attr("type") === "password";

      passwordInput.attr("type", isPassword ? "text" : "password");
      $(this).toggleClass("eye-closed");
      $(this).find(".eye-strike").toggle();
    });
  });
});
function switchLoginInput() {
  const selected = document.getElementById("loginType").value;
  const input = document.getElementById("loginInput");

  input.name = selected;

  input.placeholder =
    selected === "memberNick"
      ? "Enter your nickname"
      : selected === "memberPhone"
      ? "Enter your phone number"
      : "Enter your email";
}
