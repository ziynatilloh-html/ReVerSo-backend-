console.log("Signup frontend JavaScript file");

$(document).ready(function () {
  // File Upload Handling
  $(".file-box .upload-hidden").on("change", function () {
    if (window.FileReader) {
      const uploadFile = this.files[0];

      if (uploadFile) {
        const fileType = uploadFile.type;
        const validImageTypes = ["image/jpg", "image/jpeg", "image/png"];

        if (!validImageTypes.includes(fileType)) {
          alert("Please insert only JPEG, JPG, or PNG images!");
          $(".upload-img-frame")
            .attr("src", "/img/signup.jpg")
            .removeClass("success");
          return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
          $(".upload-img-frame")
            .attr("src", e.target.result)
            .addClass("success");
        };
        reader.readAsDataURL(uploadFile);

        $(this).siblings(".upload-name").val(uploadFile.name);
      }
    }
  });

  $(document).ready(function () {
    $(".eye-icon").on("click", function () {
      const passwordInput = $(this).siblings("input");
      const isPassword = passwordInput.attr("type") === "password";

      passwordInput.attr("type", isPassword ? "text" : "password");
      $(this).toggleClass("eye-closed");
      $(this).find(".eye-strike").toggle();
    });
  });

  // Form Validation
  $("form").on("submit", function (event) {
    if (!validateSignupForm()) {
      event.preventDefault();
    }
  });

  function validateSignupForm() {
    const memberNick = $(".member-nick").val().trim();
    const memberPhone = $(".member-phone").val().trim();
    const memberEmail = $(".member-email").val().trim();
    const memberPassword = $(".member-password").val().trim();
    const confirmPassword = $(".confirm-password").val().trim();
    const memberImage = $(".member-image").get(0).files[0];

    if (
      !memberNick ||
      !memberPhone ||
      !memberPassword ||
      !confirmPassword ||
      !memberEmail
    ) {
      alert("Please fill in all required fields!");
      return false;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

    if (!memberEmail.includes("@gmail.com")) {
      alert("Your email must end with @gmail.com (e.g., example@gmail.com).");
      return false;
    }

    if (!emailPattern.test(memberEmail)) {
      alert(
        "Invalid Gmail address format! Please enter a valid email like example@gmail.com."
      );
      return false;
    }
    if (memberPassword !== confirmPassword) {
      alert("Passwords do not match! Please check again.");
      return false;
    }

    if (!memberImage) {
      alert("Please upload a user photo!");
      return false;
    }

    return true;
  }
});
