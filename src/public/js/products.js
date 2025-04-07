// ✅ 1. Image preview when file is selected
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".product-form");

  form.addEventListener("submit", function (e) {
    const nameInput = document.querySelector("input[name='productName']");
    const priceInput = document.querySelector("input[name='productPrice']");
    const sizeInput = document.querySelector("select[name='productSize']");
    const countInput = document.querySelector("input[name='productLeftCount']");
    const genderInput = document.querySelector("select[name='productGender']");
    const categoryInput = document.querySelector(
      "select[name='productCategory']"
    );

    if (!nameInput.value.trim()) {
      alert("Product name is required.");
      e.preventDefault();
      return;
    }

    if (!priceInput.value.trim()) {
      alert("Product price is required.");
      e.preventDefault();
      return;
    }

    if (!sizeInput.value) {
      alert("Please select a size.");
      e.preventDefault();
      return;
    }

    if (!countInput.value.trim()) {
      alert("Please enter stock count.");
      e.preventDefault();
      return;
    }

    if (!genderInput.value) {
      alert("Please select gender.");
      e.preventDefault();
      return;
    }

    if (!categoryInput.value) {
      alert("Please select a category.");
      e.preventDefault();
      return;
    }
  });
});
function previewFile(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById("preview-image").src = e.target.result;
  };
  reader.readAsDataURL(file);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".product-status-btn").forEach((dropdown) => {
    dropdown.addEventListener("change", function () {
      this.classList.remove("delete", "pause", "process");
      const selected = this.value.toLowerCase();
      this.classList.add(selected);
    });
  });

  const toggleBtn = document.getElementById("toggleForm");
  const cancelBtn = document.getElementById("cancelForm");
  const formContainer = document.getElementById("formContainer");
  const form = document.querySelector(".product-form"); // ✅ You need this

  if (toggleBtn && formContainer) {
    toggleBtn.onclick = () => {
      formContainer.scrollIntoView({ behavior: "smooth" });
    };
  }

  if (cancelBtn && form && formContainer) {
    cancelBtn.addEventListener("click", () => {
      alert("You really want to reset the inputs?");
      form.reset(); // ✅ This now works
      const previewImage = document.getElementById("preview-image");
      if (previewImage) {
        previewImage.src = "/img/adminlogo.jpg";
      }
    });
  }
});
document
  .querySelector(".search-bar input")
  .addEventListener("input", function () {
    const keyword = this.value.toLowerCase();
    document.querySelectorAll(".products-table tbody tr").forEach((row) => {
      const name = row.children[0].innerText.toLowerCase();
      const type = row.children[1].innerText.toLowerCase();
      row.style.display =
        name.includes(keyword) || type.includes(keyword) ? "" : "none";
    });
  });

document.querySelectorAll(".product-status-btn").forEach((dropdown) => {
  dropdown.addEventListener("change", function () {
    const newStatus = this.value;
    const productId = this.id;

    fetch(`/admin/product/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productStatus: newStatus }),
    })
      .then((res) => res.json())
      .then(() => {
        this.classList.remove("delete", "pause", "process");
        this.classList.add(newStatus.toLowerCase());
      })
      .catch(() => {
        alert("Failed to update status. Please try again.");
      });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".product-form");
  const imageInput = document.querySelector("#productImages");

  if (form && imageInput) {
    form.addEventListener("submit", function (e) {
      if (!imageInput.files || imageInput.files.length === 0) {
        e.preventDefault();
        alert("Please upload at least one product image.");
        imageInput.focus(); // optional: focuses on the input
      }
    });
  }
});
