const toast_success = document.getElementById("toast-success");
const button = document.getElementById("submit");

const URI = "http://127.0.0.1:8080/api/productos/";

document.querySelector('#price').addEventListener('keyup', function () {
  console.log(this.value)
  console.log(button)
  if (/^[1-9][0-9]*$/.test(this.value)) {
    button.disabled = false
  } else {
    button.disabled = true
  }
})


button.addEventListener("click", async (el) => {
  toast_success.style.display = "flex";

  setTimeout(function () {
    toast_success.style.display = "none";
  }, 1500);
});
