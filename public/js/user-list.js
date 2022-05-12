async function sendData(data) {
    try {
        let responseObject = await fetch("/update-user", {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        });
        let parsedJSON = await responseObject.json();
        if (parsedJSON.status == "success") {
            console.log("thank goodness");
        } 
    } catch (error) {}
}


let records = document.getElementsByTagName("span");
                        for(let i = 0; i < records.length; i++) {
                            records[i].addEventListener("click", editCell);
                        }

function editCell(e) {
    let span_text = e.target.innerHTML;
    let parent = e.target.parentNode; //gets parent, so we know which user we're editing
    let text_box = document.createElement("input"); //creates the text box for accepting changes
    text_box.value = span_text;
    text_box.addEventListener("keyup", function(e) {
        if(e.which == 13) {//recognize enter key
            let val = text_box.value;
            let filled_box = document.createElement("span"); //creates the HTML for after done editing
            filled_box.addEventListener("click", editCell); //makes thing clickable for next time want to edit
            filled_box.innerHTML = val;
            parent.innerHTML = ""; //clears parent node pointer
            parent.appendChild(filled_box);
            let dataToSend = {id : parent.parentNode.querySelector(".id").innerHTML,
                      firstName : parent.parentNode.querySelector(".first_name :nth-child(1)").innerHTML,
                      lastName : parent.parentNode.querySelector(".last_name :nth-child(1)").innerHTML,
                      email : parent.parentNode.querySelector(".email :nth-child(1)").innerHTML,
                      password : parent.parentNode.querySelector(".password :nth-child(1)").innerHTML
                };
            sendData(dataToSend);
            }
        });
        parent.innerHTML = "";
        parent.appendChild(text_box);
    }

    async function sendDataToDelete(e) {
        e.preventDefault();
        let parent = e.target.parentNode;
        let dataToSend = {
            id: parent.parentNode.querySelector(".id").innerHTML
        };
        try {
            let responseObject = await fetch("/delete-user", {
                method: 'POST',
                headers: {
                    "Accept": 'application/json',
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });
            let parsedJSON = await responseObject.json();
            if (parsedJSON.status == "success") {
                console.log("thank goodness");
                parent.parentNode.remove();
            } 
        } catch (error) {}
    }

    let deleteRecords = document.getElementsByClassName("deleteUser");
    for(let i = 0; i < deleteRecords.length; i++) {
        deleteRecords[i].addEventListener("click", sendDataToDelete);
    }

    // function deleteCell(e) {
    //     e.preventDefault();
    //     let parent = e.target.parentNode;
    //     let dataToSend = {
    //         id: parent.parentNode.querySelector(".id").innerHTML
    //     };
    //     sendDataToDelete(dataToSend);
    //     parent.parentNode.remove();
    // }
