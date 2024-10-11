// ========================================================================================
// Imports
// ========================================================================================

// CSS import
import './styles.css';

// JS import
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

// gsap.registerPlugin(ScrollTrigger, SplitText);

// ========================================================================================
// Globals
// ========================================================================================

// ========================================================================================
// Init Lenis
// ========================================================================================

const lenis = new Lenis({
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

// ========================================================================================
// Init all scripts
// ========================================================================================

$(document).ready(() => {});
