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
    // $('.nav__btn').on('click', () => {
    //     $('.header').toggleClass('active');
    // })
    //
    // $('.nav__link').on('click', (e) => {
    //     $('.nav__link').removeClass('active');
    //     const headerHeight = $('.header').outerHeight();
    //     $('.header').removeClass('active');
    //
    //     $(e.currentTarget).addClass('active');
    //     const targetId = $(e.currentTarget).attr('href');
    //     const targetSection = $(`${targetId}`);
    //
    //     if (targetSection.length) {
    //         $('html, body').animate({
    //             scrollTop: targetSection.offset().top - $('.header').outerHeight()
    //         }, 500); // Adjust the duration (in milliseconds) as needed
    //     } else {
    //         console.error(`Current section with ID "${targetId}" undefined`);
    //     }
    // })
    //
    // const handleScroll = () => {
    //     $('.main__item').each(function () {
    //         const $section = $(this);
    //         const sectionTop = $section.offset().top;
    //         const sectionHeight = $section.outerHeight();
    //
    //         if ($(window).scrollTop() >= sectionTop - (sectionHeight * 0.5)) {
    //             const sectionId = $section.attr('id');
    //             const menuItem = $(`${'.nav__link'}[href="#${sectionId}"]`);
    //
    //             $('.nav__link').removeClass('active');
    //             menuItem.addClass('active');
    //         }
    //     });
    // }
    //
    // $(window).on('scroll', handleScroll);

    class Navigation {
        constructor(headerSelector = ".header", navSelector = ".nav") {
            // Select header element
            this.header = document.querySelector(headerSelector);
            if (!this.header)
                throw new Error(
                    `Navigation element with selector "${headerSelector}" not found`
                );
            // Select main navigation element
            this.nav = document.querySelector(navSelector);
            if (!this.nav)
                throw new Error(
                    `Navigation element with selector "${navSelector}" not found`
                );
            this.mobileView = this.reviewViewport();

            // Select key elements
            this.hamburger = this.header.querySelector(".nav__btn");
            this.navContainer = this.nav.querySelector(".nav__container");
            this.navItemsLeft = this.nav.querySelector(".nav__items_left");
            this.navItemsRight = this.nav.querySelector(".nav__items_right");

            // Define class names for mobile menu
            this.mobileMenuClass = "nav__items_mobile";
            this.activeClass = "active";

            this.init();
        }

        // Initialize event listeners
        init() {
            this.hamburger.addEventListener("click", () => {
                this.toggleMobileMenu();
            });

            this.initDesktopMenu();

            this.handleResize();
        }

        // Initialize desktop menu
        initDesktopMenu() {
            this.hamburger.removeEventListener("click", () => {
                this.toggleMobileMenu();
            });
            this.navItemsLeft.addEventListener("click", (event) => {
                this.smoothScroll(event);
            });
            this.navItemsRight.addEventListener("click", (event) => {
                this.smoothScroll(event);
            });
        }

        //
        handleResize() {
            window.addEventListener("resize", () => {
                this.mobileView = this.reviewViewport();
            });
        }

        reviewViewport() {
            return window.innerWidth < 992;
        }
        // Toggle mobile menu visibility
        toggleMobileMenu() {
            this.hamburger.classList.toggle("nav__btn_active");

            if (this.hamburger.classList.contains("nav__btn_active")) {
                this.createMobileMenu();
            } else {
                this.removeMobileMenu();
            }
        }
        // Add event listener to mobile menu items
        smoothScroll(event) {
            const target = event.target;

            if (target.closest(".nav__link")) {
                const targetId = target.getAttribute("href");
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    event.preventDefault();
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    // Close mobile menu after scrolling
                    this.mobileView && this.toggleMobileMenu();
                    // Remove active class to navigation items
                    !this.mobileView && this.removeActiveClass(".nav__link");
                    // Add active class to clicked item
                    !this.mobileView && this.addActiveClass(target);
                } else {
                    console.error(`Current section with ID "${targetId}" undefined`);
                }
            }
        }
        // Remove active class to navigation items
        removeActiveClass(selector) {
            const elements = document.querySelectorAll(selector);

            elements.forEach((element) => {
                element.classList.remove(this.activeClass);
            });
        }

        addActiveClass(el) {
            el.classList.add(this.activeClass);
        }

        // Create and display mobile menu
        createMobileMenu() {
            const allNavItems = [
                ...this.navItemsLeft.children,
                ...this.navItemsRight.children
            ];
            const mobileNavItems = document.createElement("ul");
            mobileNavItems.className = `nav__items ${this.mobileMenuClass}`;

            // Clone nav items and add to mobile menu
            allNavItems.forEach((item, index) => {
                const clonedItem = item.cloneNode(true);
                clonedItem.style.setProperty("--item-index", index + 1);
                mobileNavItems.appendChild(clonedItem);
            });

            this.navContainer.appendChild(mobileNavItems);
            this.removeActiveClass('.nav__link');

            // Force reflow to ensure the initial state is applied before adding the 'active' class
            mobileNavItems.offsetHeight;
            this.header.classList.add(this.activeClass);
            document.body.style.overflow = "hidden";

            mobileNavItems.addEventListener("click", (event) => this.smoothScroll(event));
        }

        // Remove mobile menu
        removeMobileMenu() {
            const mobileNavItems = this.nav.querySelector(`.${this.mobileMenuClass}`);
            document.body.style.overflow = "auto";

            if (mobileNavItems) {
                this.header.classList.remove(this.activeClass);

                setTimeout(() => {
                    mobileNavItems.remove();
                    mobileNavItems.removeEventListener("click", (event) => this.smoothScroll(event));
                }, 500);
            }
        }
    }

    // Usage
    try {
        const navigation = new Navigation();
    } catch (error) {
        console.error("Failed to initialize navigation:", error.message);
    }

})