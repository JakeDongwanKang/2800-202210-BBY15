"use strict";
//Hambuger menu
const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})

// Original jQuery code from https://css-tricks.com/text-fade-read-more/
// Modified by Vincent Lam
$(".card .button").click(function() {
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