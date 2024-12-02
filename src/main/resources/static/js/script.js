const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

function showLoadingLogin() {
  const loading = document.getElementById("loading");
  loading.style.display = "flex";

  document.body.classList.add("fade");
  setTimeout(() => {
    window.location.href = "/register";
  }, 500);
}

function showLoadingRegister() {
  document.getElementById('loading').style.display = 'block';

  document.body.classList.add("fade");
  setTimeout(function () {
    window.location.href = '/';
  }, 500);
}

function showLoadingProducts() {
  document.getElementById('loading').style.display = 'block';

  document.body.classList.add("fade");
  setTimeout(function () {
  }, 500);
}

window.onload = function () {
  document.body.classList.add("fade", "in");
};

const togglePassword = document.getElementById("eyeIcon");
const passwordField = document.getElementById("password");

togglePassword.addEventListener("click", function () {
  const type = passwordField.type === "password" ? "text" : "password";
  passwordField.type = type;

  togglePassword.classList.toggle("fa-eye-slash");
  togglePassword.classList.toggle("fa-eye");
});