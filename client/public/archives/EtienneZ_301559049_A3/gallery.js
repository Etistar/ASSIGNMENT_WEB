/*
  Author     : Etienne ZONON
  Student ID : 301559049
  Date       : 31/05/2026
  Course     : COMP125 – Assignment 3
  File       : gallery.js
  Description: Chapter 5 lightbox pattern + favourites with alert at max 5.
*/

/* ══════════════════════════════════════════════════════════════
   1. DATA  –  Replace src/caption values with YOUR own images
══════════════════════════════════════════════════════════════ */

// Title shown above the slideshow
let lightboxTitle = "Our Menu";

// File paths of your images
let imgFiles  = [
"images/burger.jpg", 
"images/chicken_brochette.jfif",
"images/Chicken_Caesar_Salad.jfif", 
 "images/Chicken_Nuggets.jfif",
 "images/Fish_and_Chips.jfif", 
 "images/hot_dog.jfif", 
"images/pizza.jfif", 
"images/POUTINE.jfif", 
"images/Shawarma.jfif",
"images/Street_Tacos.jfif", 
];

// Captions matching each image (same index)
let imgCaptions = new Array(imgFiles.length);
imgCaptions[0] = "Classic Burger";
imgCaptions[1] = "Brochettes";
imgCaptions[2] = "Salade César";
imgCaptions[3] = "Nuggets";
imgCaptions[4] = "Pané fish";
imgCaptions[5] = "Hot-dog";
imgCaptions[6] = "Pizza";
imgCaptions[7] = "Poutine";
imgCaptions[8] = "Shawarma";
imgCaptions[7] = "Tacos";


let imgCount = imgFiles.length;

/* ══════════════════════════════════════════════════════════════
   2. STATE VARIABLES
══════════════════════════════════════════════════════════════ */
let currentImg     = 1;      // counter shown in the badge (1-based)
let timeID;                  // interval id for play/pause
let favouriteCount = 0;      // number of favourites currently in the grid
let currentSrc     = "";     // src of image open in the overlay
let currentAlt     = "";     // alt/caption of image open in the overlay

const MAX_FAVOURITES = 5;

/* ══════════════════════════════════════════════════════════════
   3. CREATE LIGHTBOX  ← exact Chapter 5 structure
   Appends: lbCounter, lbPrev, lbNext, lbImages (with <img> children)
══════════════════════════════════════════════════════════════ */
function createLightbox() {

  // --- Lightbox container (already in HTML as <div id="lightbox">) ---
  let lightBox = document.getElementById("lightbox");

  // --- Title ---
  document.getElementById("lbTitle").textContent = lightboxTitle;

  // --- Slide counter ---
  let lbCounter = document.createElement("div");
  lbCounter.id          = "lbCounter";
  lbCounter.textContent = currentImg + " / " + imgCount;
  lightBox.appendChild(lbCounter);

  // --- Previous button ---
  let lbPrev    = document.createElement("div");
  lbPrev.id     = "lbPrev";
  lbPrev.innerHTML = "&#9664;";       // ◄
  lbPrev.onclick   = showPrev;
  lightBox.appendChild(lbPrev);

  // --- Next button ---
  let lbNext    = document.createElement("div");
  lbNext.id     = "lbNext";
  lbNext.innerHTML = "&#9654;";       // ►
  lbNext.onclick   = showNext;
  lightBox.appendChild(lbNext);

  // --- Image strip ---
  let lbImages  = document.createElement("div");
  lbImages.id   = "lbImages";
  lightBox.appendChild(lbImages);

  // --- Add each image to the strip ---
  for (let i = 0; i < imgCount; i++) {
    let image = document.createElement("img");
    image.src = imgFiles[i];
    image.alt = imgCaptions[i];

    // Click → open zoomed overlay
    image.onclick = function() {
      openOverlay(this.src, this.alt);
    };

    lbImages.appendChild(image);
  }

  // --- Play / Pause button (already in HTML as <button id="lbPlay">) ---
  document.getElementById("lbPlay").onclick = function() {
    if (timeID) {
      // Slideshow running → stop
      window.clearInterval(timeID);
      timeID = undefined;
    } else {
      // Slideshow stopped → start
      showNext();
      timeID = window.setInterval(showNext, 1500);
    }
  };
}

/* ══════════════════════════════════════════════════════════════
   4. SHOW NEXT  (Chapter 5 – appendChild moves the first child to end)
══════════════════════════════════════════════════════════════ */
function showNext() {
  let lbImages = document.getElementById("lbImages");

  // Move the first image to the end of the strip
  lbImages.appendChild(lbImages.firstElementChild);

  // Update counter
  (currentImg < imgCount) ? currentImg++ : currentImg = 1;
  document.getElementById("lbCounter").textContent = currentImg + " / " + imgCount;
}

/* ══════════════════════════════════════════════════════════════
   5. SHOW PREV  (Chapter 5 – insertBefore moves the last child to front)
══════════════════════════════════════════════════════════════ */
function showPrev() {
  let lbImages = document.getElementById("lbImages");

  // Move the last image to the front of the strip
  lbImages.insertBefore(lbImages.lastElementChild, lbImages.firstElementChild);

  // Update counter
  (currentImg > 1) ? currentImg-- : currentImg = imgCount;
  document.getElementById("lbCounter").textContent = currentImg + " / " + imgCount;
}

/* ══════════════════════════════════════════════════════════════
   6. OVERLAY – open / close
══════════════════════════════════════════════════════════════ */
function openOverlay(src, alt) {
  currentSrc = src;
  currentAlt = alt;

  document.getElementById("overlayImg").src             = src;
  document.getElementById("overlayImg").alt             = alt;
  document.getElementById("overlayCaption").textContent = alt;

  document.getElementById("overlay").classList.add("open");
}

function closeOverlay() {
  document.getElementById("overlay").classList.remove("open");
  currentSrc = "";
  currentAlt = "";
}

// × button
document.getElementById("closeOverlay").onclick = function() {
  closeOverlay();
};

// Click on dark backdrop
document.getElementById("overlay").onclick = function(e) {
  if (e.target === document.getElementById("overlay")) {
    closeOverlay();
  }
};

// ESC key
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") { closeOverlay(); }
});

/* ══════════════════════════════════════════════════════════════
   7. ADD TO FAVOURITES
══════════════════════════════════════════════════════════════ */
document.getElementById("addFavBtn").onclick = function() {

  // --- MAX 5 check → alert as required by assignment ---
  if (favouriteCount >= MAX_FAVOURITES) {
    alert("You have reached the maximum of 5 favourites!\nPlease remove at least one favourite before adding a new one.");
    return;
  }

  // --- Duplicate check ---
  let existingImgs = document.getElementById("favoritesGrid").querySelectorAll("img");
  for (let i = 0; i < existingImgs.length; i++) {
    if (existingImgs[i].getAttribute("data-src") === currentSrc) {
      alert("This image is already in your favourites!");
      return;
    }
  }

  // --- Build favourite card: div > img + removeBtn ---
  let card      = document.createElement("div");
  card.className = "fav-card";

  let favImg    = document.createElement("img");
  favImg.src    = currentSrc;
  favImg.alt    = currentAlt;
  favImg.setAttribute("data-src", currentSrc);   // for duplicate check

  let removeBtn         = document.createElement("button");
  removeBtn.className   = "remove-btn";
  removeBtn.textContent = "✕ Remove";

  // Click favourite image → toggle its Remove button
  favImg.onclick = function() {
    // Hide all other remove buttons
    let allBtns = document.getElementById("favoritesGrid").querySelectorAll(".remove-btn");
    for (let i = 0; i < allBtns.length; i++) {
      if (allBtns[i] !== removeBtn) {
        allBtns[i].classList.remove("visible");
      }
    }
    // Toggle this one
    removeBtn.classList.toggle("visible");
  };

  // Remove button → delete card from DOM
  removeBtn.onclick = function() {
    document.getElementById("favoritesGrid").removeChild(card);
    favouriteCount--;
  };

  // Assemble and append
  card.appendChild(favImg);
  card.appendChild(removeBtn);
  document.getElementById("favoritesGrid").appendChild(card);
  favouriteCount++;

  // Close overlay after adding
  closeOverlay();
};

/* ══════════════════════════════════════════════════════════════
   8. INIT – run createLightbox once the page has fully loaded
══════════════════════════════════════════════════════════════ */
window.addEventListener("load", createLightbox);
