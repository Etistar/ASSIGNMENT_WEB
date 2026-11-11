// ---------------------------------------------------------
// BugSmasher - COMP125 Assignment 6
// ---------------------------------------------------------

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// ----- Game state -----
var score = 0;

// Position et taille actuelles de la bibitte
var bug = {
    x: 0,
    y: 0,
    width: 32,
    height: 32
};

// Intervalle (en ms) entre chaque saut. C'est ce qui accelere quand le joueur marque des points.
var STARTING_INTERVAL = 1500; // vitesse de depart
var MIN_INTERVAL = 200;       // ne jamais aller plus vite que ca (garde le jeu jouable)
var SPEED_STEP = 75;          // de combien la bibitte accelere a chaque capture

var currentInterval = STARTING_INTERVAL;
var hopTimerId = null;

// ----- Fonctions utilitaires -----

// Choisit une nouvelle position aleatoire pour la bibitte, entierement a l'interieur du canvas
function moveBugToRandomPosition() {
    bug.x = Math.random() * (canvas.width - bug.width);
    bug.y = Math.random() * (canvas.height - bug.height);
}

// Dessine le fond, la bibitte, et tout le reste a l'ecran
function render() {
    // fond (look "feuille" simple dessine en canvas, pas besoin d'image externe)
    ctx.fillStyle = "#4c7a2c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#3b611f";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // dessine la bibitte comme une coccinelle simple (corps + tete + points)
    var cx = bug.x + bug.width / 2;
    var cy = bug.y + bug.height / 2;

    ctx.fillStyle = "#cc1b1b";
    ctx.beginPath();
    ctx.ellipse(cx, cy, bug.width / 2, bug.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - bug.height / 2);
    ctx.lineTo(cx, cy + bug.height / 2);
    ctx.stroke();

    ctx.fillStyle = "#000";
    [[-6, -6], [6, -6], [-6, 6], [6, 6]].forEach(function (offset) {
        ctx.beginPath();
        ctx.arc(cx + offset[0], cy + offset[1], 2.5, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.beginPath();
    ctx.arc(cx, cy - bug.height / 2 - 3, 4, 0, Math.PI * 2);
    ctx.fill();
}

// Met a jour le score affiche a l'ecran
function updateScoreDisplay() {
    document.getElementById("score").textContent = "Score: " + score;
}

// Fait "sauter" la bibitte : la deplace, puis redessine
function hop() {
    moveBugToRandomPosition();
    render();
}

// Demarre (ou redemarre) le minuteur qui fait sauter la bibitte a currentInterval
function startHopTimer() {
    if (hopTimerId !== null) {
        clearInterval(hopTimerId);
    }
    hopTimerId = setInterval(hop, currentInterval);
}

// ----- Gestionnaires d'evenements -----

// Gere les clics sur le canvas : verifie si le clic est tombe sur la bibitte
canvas.addEventListener("click", function (event) {
    var rect = canvas.getBoundingClientRect();
    var clickX = event.clientX - rect.left;
    var clickY = event.clientY - rect.top;

    var hit =
        clickX >= bug.x &&
        clickX <= bug.x + bug.width &&
        clickY >= bug.y &&
        clickY <= bug.y + bug.height;

    if (hit) {
        score++;
        updateScoreDisplay();

        // accelere la bibitte (intervalle plus petit = sauts plus rapides), sans depasser MIN_INTERVAL
        currentInterval = Math.max(MIN_INTERVAL, currentInterval - SPEED_STEP);
        startHopTimer();

        // saut immediat pour que ca semble plus reactif
        hop();
    }
});

// Le bouton "Reset Score" remet le score a zero, la vitesse n'est pas touchee
document.getElementById("resetScoreBtn").addEventListener("click", function () {
    score = 0;
    updateScoreDisplay();
});

// Le bouton "Reset Speed" remet l'intervalle de saut a sa valeur de depart
document.getElementById("resetSpeedBtn").addEventListener("click", function () {
    currentInterval = STARTING_INTERVAL;
    startHopTimer();
});

// ----- Initialisation -----
moveBugToRandomPosition();
render();
updateScoreDisplay();
startHopTimer();
