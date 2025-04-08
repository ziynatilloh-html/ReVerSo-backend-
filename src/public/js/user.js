// 🔍 Search filter
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("user-search");
  const tableRows = document.querySelectorAll("#users-table-body tr");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const keyword = this.value.toLowerCase();
      tableRows.forEach((row) => {
        const name = row.children[0].innerText.toLowerCase();
        const phone = row.children[1].innerText.toLowerCase();
        const email = row.children[2].innerText.toLowerCase();
        row.style.display =
          name.includes(keyword) ||
          phone.includes(keyword) ||
          email.includes(keyword)
            ? ""
            : "none";
      });
    });
  }

  // 🔄 Status update handler
  document.querySelectorAll(".member-status-btn").forEach((dropdown) => {
    dropdown.addEventListener("change", function () {
      const newStatus = this.value;
      const userId = this.dataset.id;

      fetch("/admin/edit/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: userId,
          memberStatus: newStatus,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            this.className = `member-status-btn ${newStatus.toLowerCase()}`;
            alert("✅ Sucessfully updated user status.");
          } else {
            alert("❌ Failed to update user status.");
          }
        })
        .catch(() => {
          alert("⚠️ Error updating user status.");
        });
    });
  });
});
