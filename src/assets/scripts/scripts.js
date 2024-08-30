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
    // ... other scripts
    $('.header__mobile-nav').on('click', () => {
        $('.header').toggleClass('active');
    })

    $('.header__nav-link').on('click', (e) => {
        $('.header__nav-link').removeClass('active');
        const headerHeight = $('.header').outerHeight();

        $(e.currentTarget).addClass('active');
        const targetId = $(e.currentTarget).attr('href');
        const targetSection = $(`${targetId}`);
        console.log(headerHeight);

        if (targetSection.length) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error(`Current section with ID "${targetId}" unfinded`);
        }
    })

    const handleScroll = () => {
        $('.main__item').each(function () {
            const $section = $(this);
            const sectionTop = $section.offset().top;
            const sectionHeight = $section.outerHeight();
            console.log(sectionTop);

            if ($(window).scrollTop() >= sectionTop - (sectionHeight * 0.5)) {
                const sectionId = $section.attr('id');
                const menuItem = $(`${'.header__nav-link'}[href="#${sectionId}"]`);

                $('.header__nav-link').removeClass('active');
                menuItem.addClass('active');
            }
        });
    }

    $(window).on('scroll', handleScroll);
})