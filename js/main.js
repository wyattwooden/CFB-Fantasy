$(document).ready(function(){
    $('.slider').bxSlider({
        mode: 'fade',
        auto: true,
        pause: 10000, // 10 seconds
        controls: false,
        pager: false,
        touchEnabled: true,
        infiniteLoop: true,
        speed: 1000,
        easing: 'ease-in-out',
        preloadImages: 'all',
        randomStart: false,
        startSlide: 0,
        hideControlOnEnd: true,
        minSlides: 1,
        maxSlides: 1,
        slideWidth: '100%',
        onSlideBefore: function($slideElement) {
            // Add any additional functionality before slide change
        },
        onSlideAfter: function($slideElement) {
            // Add any additional functionality after slide change
        }
    });
}); 