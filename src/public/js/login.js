document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("form[action='/admin/login']");
  const loginInput = document.getElementById("loginInput");
  const passwordInput = document.querySelector(".member-password");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      const username = loginInput.value.trim();
      const password = passwordInput.value.trim();

      if (!username || !password) {
        event.preventDefault();
        alert("Please fill in both username and password.");

        if (!username) {
          loginInput.classList.add("shake");
          setTimeout(() => loginInput.classList.remove("shake"), 500);
        }
        if (!password) {
          passwordInput.classList.add("shake");
          setTimeout(() => passwordInput.classList.remove("shake"), 500);
        }
      }
    });
  }

  // 👁 Eye toggle logic
  $(".eye-icon").on("click", function () {
    const input = $(this).siblings("input");
    const isPassword = input.attr("type") === "password";
    input.attr("type", isPassword ? "text" : "password");
    $(this).toggleClass("eye-closed");
    $(this).find(".eye-strike").toggle();
  });
});
