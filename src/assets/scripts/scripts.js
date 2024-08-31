$(document).ready(() => {
    // Initialize AOS
    AOS.init();
    // Initialize lightGallery
    lightGallery(document.getElementById('main-home-cards'), {
        plugins: [lgZoom, lgThumbnail],
        licenseKey: '0000-0000-000-0000',
        thumbnail: true,
        download: false,
        zoom: true,
        speed: 500,
    });

    lightGallery(document.getElementById('projects-gallery'), {
        plugins: [lgZoom, lgThumbnail],
        licenseKey: '0000-0000-000-0000',
        thumbnail: true,
        download: false,
        zoom: true,
        speed: 500,
    });
    //Navigation
    $('.nav__btn').on('click', () => {
        $('.header').toggleClass('active');
    })

    $('.nav__link').on('click', (e) => {
        $('.nav__link').removeClass('active');
        const headerHeight = $('.header').outerHeight();
        $('.header').removeClass('active');

        $(e.currentTarget).addClass('active');
        const targetId = $(e.currentTarget).attr('href');
        const targetSection = $(`${targetId}`);

        if (targetSection.length) {
            $('html, body').animate({
                scrollTop: targetSection.offset().top - $('.header').outerHeight()
            }, 500); // Adjust the duration (in milliseconds) as needed
        } else {
            console.error(`Current section with ID "${targetId}" undefined`);
        }
    })

    const handleScroll = () => {
        $('.main__item').each(function () {
            const $section = $(this);
            const sectionTop = $section.offset().top;
            const sectionHeight = $section.outerHeight();

            if ($(window).scrollTop() >= sectionTop - (sectionHeight * 0.5)) {
                const sectionId = $section.attr('id');
                const menuItem = $(`${'.nav__link'}[href="#${sectionId}"]`);

                $('.nav__link').removeClass('active');
                menuItem.addClass('active');
            }
        });
    }

    $(window).on('scroll', handleScroll);
})