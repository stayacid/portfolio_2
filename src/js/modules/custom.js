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

(function () {
  var bLazy = new Blazy();
})();

new WOW().init();