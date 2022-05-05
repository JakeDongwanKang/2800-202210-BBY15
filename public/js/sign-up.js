//Send data to server
console.log("I am here");
async function sendData(data) {
    try {
        let responseObject = await fetch("/add-user", {
            method: 'POST',
            headers: { "Accept": 'application/json',
                       "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        });
        console.log("Response object", responseObject);
        let parsedJSON = await responseObject.json();
        console.log("From the server", parsedJSON);
    } catch(error) {
        console.log(error);
    }
}


//Send user's email and password to server for authentication
document.getElementById("signUpButton").addEventListener("click", function(e) {
    sendData({firstName: document.getElementById("firstName").value,
              lastName: document.getElementById("lastName").value,
              email: document.getElementById("userEmail").value,
              password: document.getElementById("userPassword").value
            });
});