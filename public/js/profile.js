const upLoadForm = document.getElementById("upload-images-form");
upLoadForm.addEventListener("submit", uploadImages);

function uploadImages(e) {
    e.preventDefault();

    const imageUpload = document.querySelector('#image-upload');
    const formData = new FormData();

    for (let i = 0; i < imageUpload.files.length; i++) {
        // put the images from the input into the form data
        formData.append("files", imageUpload.files[i]);
    }

    const options = {
        method: 'POST',
        body: formData,
        // don't put a header in, the browser will do that for us
        //                headers: {
        //                  "Content-Type": "multipart/form-data"
        //                }
    };
    //delete options.headers['Content-Type'];

    // now use fetch
    fetch("/upload-images", options).then(function (res) {
        console.log(res);
    }).catch(function (err) {
        ("Error:", err)
    });
}