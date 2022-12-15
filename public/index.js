const toast_success = document.getElementById("toast-success");
const button = document.getElementById("submit");

const URI = "http://127.0.0.1:8080/api/productos/";

button.addEventListener("click", async (el) => {
  el.preventDefault();
  await fetch(URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: document.getElementById("name").value,
      price: document.getElementById("price").value,
      thumbnail: document.getElementById("thumbnail").value,
    }),
  });

  toast_success.style.display = "flex";

  setTimeout(function () {
    toast_success.style.display = "none";
  }, 1500);
});
