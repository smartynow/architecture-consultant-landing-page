$(document).ready(() => {
    AOS.init();

    $('.header__mobile-nav').on('click', () => {
        $('.header').toggleClass('active');
    })
})