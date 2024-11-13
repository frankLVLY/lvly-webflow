// ========================================================================================
// Imports
// ========================================================================================

// CSS imports
import './styles.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

// Library imports
import barba from '@barba/core';
import { restartWebflow } from '@finsweet/ts-utils';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import Swiper from 'swiper';
import { EffectCoverflow, Navigation } from 'swiper/modules';

// Register libraries
gsap.registerPlugin(ScrollTrigger, SplitText);
Swiper.use([EffectCoverflow, Navigation]);

// ========================================================================================
// Barba JS
// ========================================================================================

let lenis;

function useScripts() {
  useAnchorLinks();
  useHistoryLinks();
  useResetScroll();
  globalNavbar();
  pageHome();
  pageProjectTemplate();
  pageEditorTemplate();
}

barba.init({
  sync: true,
  debug: true,
  timeout: 7000,
  transitions: [
    {
      name: 'default',
      async once() {
        useLenis();
        lenis.stop();
        lenis.start();
        useScripts();
      },
      async leave(data) {
        lenis.stop();
        // data.current.container.classList.add('pointer-events-none');
        // Select elements with data-animate-in attribute and animate them with stagger on leave
        const elementsToAnimate = $(data.current.container).find('[data-animate-in]');

        await gsap.to(elementsToAnimate, {
          y: '-2vw',
          opacity: 0,
          duration: 0.5,
          ease: 'power3.in',
          stagger: 0.08,
        });
      },
      async beforeEnter() {
        await restartWebflow();
        useLenis();
        lenis.start();
        useScripts();
      },
      async enter(data) {
        // Set page container to fixed
        data.next.container.classList.add('is-transitioning');
        // data.next.container.classList.add('pointer-events-none');

        // Select elements with data-animate-in attribute and animate them with stagger on enter
        const elementsToAnimate = $(data.next.container).find('[data-animate-in]');

        await gsap.from(elementsToAnimate, {
          y: '2vw',
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.08,
        });

        // Remove fixed class
        data.next.container.classList.remove('is-transitioning');
        // data.next.container.classList.remove('pointer-events-none');
        // data.current.container.classList.remove('pointer-events-none');
      },
      async afterEnter() {
        window.scrollTo(0, 0);
        ScrollTrigger.refresh();
      },
    },
  ],
});

// ========================================================================================
// Globals
// ========================================================================================

// ============================================
// Navbar
// ============================================
function globalNavbar() {
  let lastScrollTop = 0;
  const scrollThreshold = 50;
  let isNavbarHidden = false;

  // Check if the current URL is not the homepage
  if (window.location.pathname !== '/') {
    lenis.on('scroll', ({ scroll }) => {
      const nowScrollTop = scroll;

      if (nowScrollTop > lastScrollTop) {
        // Scrolling down
        if (nowScrollTop > scrollThreshold && !isNavbarHidden) {
          // Scroll down past threshold: hide navbar
          $('.nav_contain').addClass('active');
          isNavbarHidden = true;
        }
      } else {
        // Scrolling up
        if (isNavbarHidden) {
          // Scroll up: show navbar instantly
          $('.nav_contain').removeClass('active');
          isNavbarHidden = false;
        }
      }

      lastScrollTop = nowScrollTop;
    });
  }

  // Hamburger toggle
  const hamburger = $('.nav_hamburger'); // Open & close target
  const navWrap = $('.nav_wrap'); // Active class target
  const menuLinks = $('.nav_menu_upper_link'); // Menu links that should close the menu on click

  // Toggle the 'active' class on the hamburger
  hamburger.on('click', function () {
    navWrap.toggleClass('active');

    if (navWrap.hasClass('active')) {
      lenis.stop();
    } else {
      lenis.start();
    }
  });

  // Close the menu when clicking on any .nav_menu_upper_link if navWrap is active
  menuLinks.on('click', function () {
    if (navWrap.hasClass('active')) {
      navWrap.removeClass('active');
      lenis.start();
    }
  });

  // Escape key listener (added once, checks if menu is active)
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && navWrap.hasClass('active')) {
      navWrap.removeClass('active');
      lenis.start();
    }
  });
}

// ========================================================================================
// Pages
// ========================================================================================

// ============================================
// Homepage
// ============================================
function pageHome() {
  if (window.location.pathname === '/') {
    // Logo flip animation
    const state = Flip.getState('.insights_img_body_img');
    function switchItUp() {
      const imgElement = document.querySelector('.insights_img_body_img');
      const newContainer = document.querySelector('.insights_img_body_wrap');
      if (imgElement && newContainer) {
        newContainer.appendChild(imgElement);
      }
    }
    switchItUp();
    Flip.to(state, {
      duration: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.insights_wrap',
        start: '30% top',
        endTrigger: '.process_home_wrap',
        end: 'top top',
        scrub: true,
      },
    });
  }
}

// ============================================
// Project Template Page
// ============================================
function pageProjectTemplate() {
  // Project video interaction
  $('.project_hero_video_wrap').on('click', function () {
    const video = $(this).find('video')[0];

    // Add the 'active' class only if it's not already present
    if (!$(this).hasClass('active')) {
      $(this).addClass('active');
    }

    // Play the video
    if (video) {
      video.play();
    }
  });

  // Credits toggle
  const creditsWrapper = $('.project_hero_credits_wrap');
  const creditsContent = $('.project_credits_wrap');
  $('.project_toggle_wrap').on('click', function () {
    creditsWrapper.toggleClass('active');

    if (creditsWrapper.hasClass('active')) {
      const scrollHeight = creditsContent.prop('scrollHeight');
      creditsContent.css('max-height', `${scrollHeight}px`);
    } else {
      creditsContent.css('max-height', '7.5em');
    }
  });
}

// ============================================
// Editor Template Page
// ============================================
function pageEditorTemplate() {
  // Lightbox animation
  const lightboxWrap = $('.editor_lightbox_wrap');

  $('.work_link').on('click', function () {
    // Toggle the lightbox active state
    lightboxWrap.toggleClass('active');

    if (lightboxWrap.hasClass('active')) {
      lenis.stop(); // Stop Lenis scrolling when lightbox is active

      // Get the data-editor-id of the clicked item
      const editorId = $(this).attr('data-editor-id');

      // Find the corresponding slide with the same data-editor-id
      const correspondingSlide = $('.swiper-slide[data-editor-id="' + editorId + '"]');

      // Get the index of the corresponding slide
      const slideIndex = correspondingSlide.index();

      // Use Swiper's slideTo method to move to the corresponding slide
      lightboxSwiper.slideTo(slideIndex);
    } else {
      lenis.start(); // Start Lenis scrolling when lightbox is inactive
    }
  });

  // Close the overlay when clicking the close icon
  $('[data-close-icon="overlay"]').on('click', function () {
    lightboxWrap.removeClass('active');
    lenis.start(); // Start Lenis when overlay is closed
  });

  // Close the overlay on pressing the Escape key
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      lightboxWrap.removeClass('active');
      lenis.start(); // Start Lenis when Escape key is pressed
    }
  });

  // Editor Lightbox Swiper
  const lightboxSwiper = new Swiper('.swiper.is-editor', {
    modules: [Navigation, EffectCoverflow],
    slidesPerView: 'auto',
    loopedSlides: 3,
    speed: 500,
    loop: true,
    keyboard: true,
    grabCursor: true,
    navigation: {
      nextEl: '.swiper-next',
    },
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 0,
      scale: 0.9,
      slideShadows: false,
    },
  });

  // Play the video of the active slide and show controls
  const videos = $('.lightbox_visual_video video');
  const activeVideo = $('.swiper-slide-active .lightbox_visual_video video');

  // Check if there are any videos on the page
  if (videos.length && activeVideo.length) {
    // Play the video of the active slide and show controls
    activeVideo[0].setAttribute('controls', 'true');
    activeVideo[0].play();

    // Listen for slide change to control video playback
    lightboxSwiper.on('slideChangeTransitionEnd', function () {
      const activeVideo = $('.swiper-slide-active .lightbox_visual_video video');

      // Ensure activeVideo exists before attempting to manipulate it
      if (activeVideo.length) {
        $(videos).each(function () {
          this.pause(); // Pause the video
          this.currentTime = 0; // Reset to the start
          $(this).removeAttr('controls'); // Optionally remove controls
        });

        activeVideo[0].setAttribute('controls', 'true');
        activeVideo[0].play();
      }
    });
  }
}

// ========================================================================================
// Functions
// ========================================================================================

// ============================================
// Delay
// ============================================
function delay(n) {
  n = n || 2000;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}

// ============================================
// Lenis Smooth Scroll
// ============================================
function useLenis() {
  lenis = new Lenis({
    duration: 1,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Create data attributes
  $('[data-lenis-start]').on('click', function () {
    lenis.start();
  });

  $('[data-lenis-stop]').on('click', function () {
    lenis.stop();
  });

  $('[data-lenis-toggle]').on('click', function () {
    $(this).toggleClass('stop-scroll');
    if ($(this).hasClass('stop-scroll')) {
      lenis.stop();
    } else {
      lenis.start();
    }
  });
}

// ============================================
// Lenis Anchor Links
// ============================================
function useAnchorLinks() {
  $('[data-anchor-target]').click(function () {
    let targetAnchorLinks = $(this).attr('data-anchor-target');
    scroll.scrollTo(targetAnchorLinks, {
      easing: (x) => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2),
      duration: 1,
    });
  });
}

// ============================================
// History Links
// ============================================
function useHistoryLinks() {
  $('[data-back-link="true"]').on('click', function (event) {
    event.preventDefault();

    if (window.history.length > 1) {
      // There is history to go back to
      window.history.back();
    } else {
      // No history, redirect to default URL
      window.location.href = 'https://lvly-tv.webflow.io/work';
    }
  });
}

// ============================================
// Reset scroll to top on page load
// ============================================
function useResetScroll() {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
}
