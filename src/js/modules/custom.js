/// button scroll to top
const btnScrollToTop = document.querySelector('.top')

window.addEventListener('scroll', showScrollBtn)

function showScrollBtn() {
  if (window.scrollY > window.innerHeight) {
    btnScrollToTop.classList.add('active')
  } else {
    btnScrollToTop.classList.remove('active')
  }
}

$('.top').click(function () {
  $('html, body').stop().animate({
    scrollTop: 0
  });
});

// lazy load for image
(function () {
  var bLazy = new Blazy();
})();

// wow animation
new WOW().init();

//glasses animation
let block = document.querySelector('.glasses')
let controller = new ScrollMagic.Controller();

let scene = new ScrollMagic.Scene({
    duration: 150
  })
  .setTween(block, {
    top: '280px',
  })
  .addTo(controller);//