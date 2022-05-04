// Add this to bottom of sign-up.html
// <script src="..\..\public\js\sign-up.js"></script>
function createAccount() {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
}

document.getElementById("SignUpButton").onclick = function() {createAccount()};