function changeImg() {
    document.getElementById("ghibli-event").addEventListener("click", function(e) {
        var image = document.getElementById('myImg');
        if(image.src.match("/assets/team_name_drawing.png")) {
            image.src = "/assets/team_ghibli_drawing.png";
        } else {
            image.src = "/assets/team_name_drawing.png";
        }
    }); 
}