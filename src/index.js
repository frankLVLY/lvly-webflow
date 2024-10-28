// ========================================================================================
// Imports
// ========================================================================================

// CSS imports
import './styles.css';
import 'swiper/css';
import 'swiper/css/navigation';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
// Library imports
import Lenis from 'lenis';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

gsap.registerPlugin(ScrollTrigger, SplitText);

// ========================================================================================
// Init all scripts
// ========================================================================================

$(document).ready(() => {
  useLenis();
  useAnchorLinks();
  useHistoryLinks();
  globalNavbar();
  pageProjectTemplate();
  pageEditorTemplate();
});

let lenis;

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

// ========================================================================================
// Pages
// ========================================================================================

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

  // Play video active slide
  // const video = $('.swiper-slide-active').find('video')[0];

  // if (video) {
  //   video.play();
  // }

  // Editor Lightbox Swiper
  const lightboxSwiper = new Swiper('.swiper.is-editor', {
    modules: [Navigation],
    speed: 700,
    loop: true,
    loopedSlides: 4,
    slidesPerView: 1,
    navigation: {
      nextEl: '.lightbox_arrow_wrap',
    },
    grabCursor: true,
    // on: {
    //   slideChange: function () {
    //     // Pause all videos
    //     $('video').each(function () {
    //       $(this).get(0).pause();
    //     });

    //     // Play video of the active slide
    //     const video = $('.swiper-slide-active').find('video')[0];

    //     if (video) {
    //       video.play();
    //     }
    //   },
    // },
  });
}

// ========================================================================================
// Functions
// ========================================================================================

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
