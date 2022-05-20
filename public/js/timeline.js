"use strict";
//Hambuger menu
const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})

// Original jQuery code from https://css-tricks.com/text-fade-read-more/
// Modified by Vincent Lam
$(".card .read-more-button").click(function() {
    var totalHeight = 0
  
    var $el = $(this);
    var $p  = $el.parent();
    var $up = $p.parent();
    var $ps = $up.find("div");
    
    $ps.each(function() {
      totalHeight += $(this).outerHeight();
      totalHeight += 12;
    });
          
    $up
      .css({
        "height": $up.height(),
        "max-height": 9999
      })
      .animate({
        "height": totalHeight
      });
  
    $p.fadeOut();
    return false;
  });

document.getElementById("search-button").addEventListener("click", function(e) {
    sendData({searchTerm: document.getElementById("allevents-search-keyword").value});
})

async function sendData(data) {
    try {
        let responseObject = await fetch("/search-timeline", {
            method: 'POST',
            headers: { "Accept": 'application/json',
                       "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        });
        let parsedJSON = await responseObject.json();
        if(parsedJSON.status == "success") {
            document.querySelector('.post_content').innerHTML = parsedJSON.message;
        }
    } catch(error) {}
}