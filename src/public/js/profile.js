// Profile dropdown toggle
function toggleSettings() {
  const section = document.getElementById("settings-section");
  section.classList.toggle("show");
  section.classList.toggle("hidden");

  if (section.classList.contains("show")) {
    setTimeout(() => {
      section.scrollIntoView({ behavior: "smooth" });
    }, 200);
  }
}

// AJAX Profile Update
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settingsForm");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch("/admin/update", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message || "Something went wrong while updating.");
      } else {
        alert("Profile updated successfully!");
        location.reload();
      }
    } catch (err) {
      console.error("AJAX update error:", err);
      alert("An unexpected error occurred.");
    }
  });
});
