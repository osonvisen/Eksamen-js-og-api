let canvas = document.querySelector("canvas");
// Canvas har størrelse x = 1000px og y = 938px
let surface = canvas.getContext("2d");
let pokeObject1 = {
    x: 0,
    y: 0,
    width: 80,
    height: 80,
};
let pokeObject2 = {
    x: 0,
    y: 0,
    width: 64,
    height: 70,
};
// Lager nytt objekt av bien
// Definerer startposisjonen, og henter bildet
// Erklærer at den skal stå i ro ved start
let player1 = Object.create(pokeObject1);
player1.x = 100;
player1.y = 100;
let image1 = new Image();
image1.addEventListener("load", loadHandler, false); // Venter til bildet er lastet ferdig
image1.src = "../../images/charmander-right.png";
let Xspeed1 = 0;
let Yspeed1 = 0;
let moveLeft1 = false;
let moveRight1 = false;
let moveUp1 = false;
let moveDown1 = false;

let player2 = Object.create(pokeObject2);
player2.x = 836;
player2.y = 758;
let image2 = new Image();
image2.addEventListener("load", loadHandler, false); // Venter til bildet er lastet ferdig
image2.src = "../../images/pikachu-left.png";
let Xspeed2 = 0;
let Yspeed2 = 0;
let moveLeft2 = false;
let moveRight2 = false;
let moveUp2 = false;
let moveDown2 = false;

// Lytter etter tastetrykk, og når tasteslipp
window.addEventListener(
    "keydown",
    function (e) {
        switch (e.key) {
            case "ArrowUp":
                moveUp2 = true;
                break;
            case "ArrowDown":
                moveDown2 = true;
                break;
            case "ArrowLeft":
                moveLeft2 = true;
                break;
            case "ArrowRight":
                moveRight2 = true;
                break;
            case "w":
                moveUp1 = true;
                break;
            case "s":
                moveDown1 = true;
                break;
            case "a":
                moveLeft1 = true;
                break;
            case "d":
                moveRight1 = true;
                break;
        }
    },
    false
);
window.addEventListener(
    "keyup",
    function (e) {
        switch (e.key) {
            case "ArrowUp":
                moveUp2 = false;
                break;
            case "ArrowDown":
                moveDown2 = false;
                break;
            case "ArrowLeft":
                moveLeft2 = false;
                break;
            case "ArrowRight":
                moveRight2 = false;
                break;
            case "w":
                moveUp1 = false;
                break;
            case "s":
                moveDown1 = false;
                break;
            case "a":
                moveLeft1 = false;
                break;
            case "d":
                moveRight1 = false;
                break;
        }
    },
    false
);
// Hva som skal skje når bildet er lastet ferdig
// Da sendes dette til update-funksjonen
function loadHandler() {
    update();
}
// Følger med på knappene som trykkes og sender pokemonene i riktig retning
function update() {
    // creating the animation loop
    window.requestAnimationFrame(update, canvas);
    player1.x += Xspeed1;
    player1.y += Yspeed1;
    player2.x += Xspeed2;
    player2.y += Yspeed2;

    if (moveUp1 && !moveDown1) {
        Yspeed1 = -5;
    }
    if (moveDown1 && !moveUp1) {
        Yspeed1 = 5;
    }
    if (moveLeft1 && !moveRight1) {
        Xspeed1 = -5;
    }
    if (moveRight1 && !moveLeft1) {
        Xspeed1 = 5;
    }
    if (!moveUp1 && !moveDown1) {
        Yspeed1 = 0;
    }
    if (!moveLeft1 && !moveRight1) {
        Xspeed1 = 0;
    }
    if (player1.x < 0) {
        player1.x = 0;
    }
    if (player1.y < 0) {
        player1.y = 0;
    }
    if (moveUp2 && !moveDown2) {
        Yspeed2 = -5;
    }
    if (moveDown2 && !moveUp2) {
        Yspeed2 = 5;
    }
    if (moveLeft2 && !moveRight2) {
        Xspeed2 = -5;
    }
    if (moveRight2 && !moveLeft2) {
        Xspeed2 = 5;
    }
    if (!moveUp2 && !moveDown2) {
        Yspeed2 = 0;
    }
    if (!moveLeft2 && !moveRight2) {
        Xspeed2 = 0;
    }
    if (player2.x < 0) {
        player2.x = 0;
    }
    if (player2.y < 0) {
        player2.y = 0;
    }
    if (player1.x + player1.width > canvas.width) {
        player1.x = canvas.width - player1.width;
    }
    if (player1.y + player1.height > canvas.height) {
        player1.y = canvas.height - player1.height;
    }
    if (player2.x + player2.width > canvas.width) {
        player2.x = canvas.width - player2.width;
    }
    if (player2.y + player2.height > canvas.height) {
        player2.y = canvas.height - player2.height;
    }
    render();
}
// Skriver endringene ut på skjermen
function render() {
    // Sletter bien fra lerretet (canvas)
    surface.clearRect(0, 0, canvas.width, canvas.height);
    // Tegner bien på overflaten til canvas
    surface.drawImage(
        image1, // Tegner spiller 1s bevegelser
        Math.floor(player1.x), // Tegner x-posisjonen (Så viktig at x står på denne posisjonen)
        Math.floor(player1.y), // Tegner y-posisjonen
        player1.width, // Tegner bredden, så viktig at bredden står på denne posisjonen
        player1.height // Samme for høyden, objektet kan få feil proporsjoner hvis disse står på feil posisjon
    );
    surface.drawImage(
        image2, // Tegner spiller 2s bevegelser
        Math.floor(player2.x), // Tegner x-posisjonen (Så viktig at x står på denne posisjonen)
        Math.floor(player2.y), // Tegner y-posisjonen
        player2.width, // Tegner bredden, så viktig at bredden står på denne posisjonen
        player2.height // Samme for høyden, objektet kan få feil proporsjoner hvis disse står på feil posisjon
    );
}
