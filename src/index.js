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

  // Hamburger toggle
  const hamburger = $('.nav_hamburger'); // Open & close target
  const navWrap = $('.nav_wrap'); // Active class target

  // Toggle the 'active' class on the hamburger
  hamburger.on('click', function () {
    navWrap.toggleClass('active');

    if (navWrap.hasClass('active')) {
      lenis.stop();
    } else {
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
