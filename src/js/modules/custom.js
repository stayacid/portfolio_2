$(window).scroll(function() {
    if ($(this).scrollTop() > $(this).height()) {
        $('.top').addClass('active');
    } else {
        $('.top').removeClass('active');
    }
});

$('.top').click(function() {
    $('html, body').stop().animate({scrollTop: 0}, 'slow', 'swing');
});

(function() {
    var bLazy = new Blazy();
})();

new WOW().init();