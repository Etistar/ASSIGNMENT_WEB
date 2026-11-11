// =====================================================
// Frame — JSON Slideshow Gallery
// COMP125 Assignment 5
// =====================================================

(function () {
  'use strict';

  // ---- Element references ----
  const uploadForm     = document.getElementById('uploadForm');
  const jsonInput      = document.getElementById('jsonInput');
  const errorMessage   = document.getElementById('errorMessage');

  const uploadPanel    = document.getElementById('uploadPanel');
  const slideshowPanel = document.getElementById('slideshowPanel');

  const slideImage     = document.getElementById('slideImage');
  const frameCurrent   = document.getElementById('frameCurrent');
  const frameTotal     = document.getElementById('frameTotal');

  const prevBtn        = document.getElementById('prevBtn');
  const nextBtn        = document.getElementById('nextBtn');
  const playPauseBtn   = document.getElementById('playPauseBtn');
  const iconPlay       = document.getElementById('iconPlay');
  const iconPause      = document.getElementById('iconPause');
  const progressFill   = document.getElementById('progressFill');
  const newReelBtn     = document.getElementById('newReelBtn');

  // ---- Slideshow state ----
  let slides = [];          // [{ filepath, duration }, ...]
  let currentIndex = 0;
  let isPlaying = true;
  let advanceTimer = null;  // setTimeout handle for auto-advance
  let progressStart = null; // timestamp progress animation began
  let progressDuration = 0;
  let currentObjectUrl = null; // tracks the blob URL currently shown, so it can be revoked
  let renderToken = 0;         // guards against out-of-order async image responses

  // =====================================================
  // Upload handling
  // =====================================================

  uploadForm.addEventListener('submit', function (event) {
    event.preventDefault();
    errorMessage.textContent = '';

    const files = jsonInput.files;
    if (!files || files.length === 0) {
      errorMessage.textContent = 'Please choose a .json file first.';
      return;
    }

    const file = files[0];
    const hasJsonExtension = /\.json$/i.test(file.name);

    if (!hasJsonExtension || (file.type && file.type !== '' && file.type !== 'application/json')) {
      if (!hasJsonExtension) {
        errorMessage.textContent = 'That file is not a .json file. Please choose a valid JSON reel.';
        return;
      }
    }

    loadJsonFileAsync(file);
  });

  // Reads the uploaded file's contents asynchronously via XMLHttpRequest,
  // using an object URL as the request target (files never leave the browser).
  function loadJsonFileAsync(file) {
    const objectUrl = URL.createObjectURL(file);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', objectUrl, true);
    xhr.responseType = 'text';

    xhr.onload = function () {
      URL.revokeObjectURL(objectUrl);

      if (xhr.status !== 0 && xhr.status !== 200) {
        errorMessage.textContent = 'Could not read the uploaded file. Please try again.';
        return;
      }

      let data;
      try {
        data = JSON.parse(xhr.responseText);
      } catch (err) {
        errorMessage.textContent = 'That JSON file could not be parsed. Please check its formatting.';
        return;
      }

      if (!validateSlides(data)) {
        errorMessage.textContent = 'The JSON file must be an array of { "filepath", "duration" } objects.';
        return;
      }

      slides = data.map(function (entry) {
        return {
          filepath: entry.filepath,
          duration: parseInt(entry.duration, 10)
        };
      });

      startSlideshow();
    };

    xhr.onerror = function () {
      URL.revokeObjectURL(objectUrl);
      errorMessage.textContent = 'There was a problem loading that file asynchronously. Please try again.';
    };

    xhr.send();
  }

  function validateSlides(data) {
    if (!Array.isArray(data) || data.length === 0) return false;
    return data.every(function (entry) {
      return entry &&
        typeof entry.filepath === 'string' && entry.filepath.length > 0 &&
        entry.duration !== undefined && !isNaN(parseInt(entry.duration, 10));
    });
  }

  // =====================================================
  // Slideshow lifecycle
  // =====================================================

  function startSlideshow() {
    currentIndex = 0;
    isPlaying = true;

    uploadPanel.classList.add('hidden');
    slideshowPanel.classList.remove('hidden');

    frameTotal.textContent = padNumber(slides.length);
    setPlayPauseIcon(true);

    renderSlide();
  }

  function renderSlide() {
    const slide = slides[currentIndex];

    frameCurrent.textContent = padNumber(currentIndex + 1);
    resetProgressBar();

    loadImageViaXHR(slide.filepath, currentIndex);

    if (isPlaying) {
      scheduleAdvance(slide.duration);
      animateProgressBar(slide.duration);
    }
  }

  // Loads a slideshow image asynchronously via XMLHttpRequest (as a blob),
  // then swaps it into the <img> element as an object URL once it arrives.
  function loadImageViaXHR(filepath, indexAtRequestTime) {
    const token = ++renderToken;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', filepath, true);
    xhr.responseType = 'blob';

    xhr.onload = function () {
      // If the user has already navigated to a different slide before this
      // request finished, discard the result instead of showing a stale image.
      if (token !== renderToken) return;

      if (xhr.status !== 0 && xhr.status !== 200) {
        errorMessage.textContent = 'Could not load image: ' + filepath;
        return;
      }

      const newObjectUrl = URL.createObjectURL(xhr.response);

      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
      currentObjectUrl = newObjectUrl;

      slideImage.src = newObjectUrl;
      slideImage.alt = 'Slideshow image ' + (indexAtRequestTime + 1) + ' of ' + slides.length;

      // Restart the fade-in animation on each slide change.
      slideImage.classList.remove('frame__image');
      void slideImage.offsetWidth; // force reflow
      slideImage.classList.add('frame__image');
    };

    xhr.onerror = function () {
      if (token !== renderToken) return;
      errorMessage.textContent = 'Network error loading image: ' + filepath;
    };

    xhr.send();
  }

  function scheduleAdvance(duration) {
    clearTimeout(advanceTimer);
    advanceTimer = setTimeout(function () {
      goToNext();
    }, duration);
  }

  function goToNext() {
    currentIndex = (currentIndex + 1) % slides.length; // loop forward
    renderSlide();
  }

  function goToPrevious() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length; // loop backward
    renderSlide();
  }

  // ---- Progress bar animation (visual cue for auto-advance timing) ----
  function resetProgressBar() {
    progressFill.classList.remove('animate');
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
  }

  function animateProgressBar(duration) {
    // Force reflow so the browser registers the 0% width before animating.
    void progressFill.offsetWidth;
    progressFill.style.transition = 'width ' + duration + 'ms linear';
    progressFill.classList.add('animate');
    progressFill.style.width = '100%';
  }

  function pauseProgressBar() {
    const computedWidth = getComputedStyle(progressFill).width;
    const parentWidth = getComputedStyle(progressFill.parentElement).width;
    progressFill.style.transition = 'none';
    progressFill.style.width = computedWidth;
  }

  // =====================================================
  // Controls
  // =====================================================

  nextBtn.addEventListener('click', function () {
    goToNext();
    if (isPlaying) restartAutoAdvance();
  });

  prevBtn.addEventListener('click', function () {
    goToPrevious();
    if (isPlaying) restartAutoAdvance();
  });

  function restartAutoAdvance() {
    // renderSlide() already schedules the timer/progress bar for the new slide,
    // so nothing extra is needed here — kept for clarity of intent.
  }

  playPauseBtn.addEventListener('click', function () {
    isPlaying = !isPlaying;
    setPlayPauseIcon(isPlaying);

    if (isPlaying) {
      const remaining = slides[currentIndex].duration;
      scheduleAdvance(remaining);
      animateProgressBar(remaining);
    } else {
      clearTimeout(advanceTimer);
      pauseProgressBar();
    }
  });

  function setPlayPauseIcon(playing) {
    if (playing) {
      iconPause.classList.remove('hidden');
      iconPlay.classList.add('hidden');
      playPauseBtn.setAttribute('aria-label', 'Pause slideshow');
    } else {
      iconPause.classList.add('hidden');
      iconPlay.classList.remove('hidden');
      playPauseBtn.setAttribute('aria-label', 'Resume slideshow');
    }
  }

  newReelBtn.addEventListener('click', function () {
    clearTimeout(advanceTimer);
    slides = [];
    currentIndex = 0;
    jsonInput.value = '';
    errorMessage.textContent = '';

    slideshowPanel.classList.add('hidden');
    uploadPanel.classList.remove('hidden');
  });

  // ---- Helpers ----
  function padNumber(n) {
    return n < 10 ? '0' + n : String(n);
  }

})();
