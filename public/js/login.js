//Send data to server
async function sendData(data) {
    try {
        let responseObject = await fetch("/login", {
            method: 'POST',
            headers: { "Accept": 'application/json',
                       "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        });
        console.log("Response object", responseObject);
        let parsedJSON = await responseObject.json();
        console.log("From the server", parsedJSON);
        if (parsedJSON.status == "fail") {
            document.getElementById("emailError").innerHTML="<small>*Please check your email</small>";
            document.getElementById("passwordError").innerHTML="<small>*Please check your password</small>";
        } else {
            if (parsedJSON.isAdmin) {
                window.location.replace("/dashboard");
            } else {
                window.location.replace("/main");
            }
        }
    } catch(error) {
        console.log(error);
    }
}

//Send user's email and password to server for authentication
document.getElementById("submit").addEventListener("click", function(e) {
    sendData({email: document.getElementById("userEmail").value,
                password: document.getElementById("userPassword").value
               });
});

function removeErrorMsg() {
    document.getElementById("emailError").innerHTML="";
            document.getElementById("passwordError").innerHTML="";
}
