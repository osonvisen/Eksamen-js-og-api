let pokemons = [
    {
        name: "Pikachu",
        width: 64,
        height: 70,
    },
    {
        name: "Charmander",
        width: 80,
        height: 80,
        image: "../../images/charmander-right.png",
    },
    {
        name: "Squirtle",
        width: 107,
        height: 80,
    },
    {
        name: "Bulbasaur",
        width: 80,
        height: 80,
    },
];
// Fetcher stats fra api og legger inn i pokemons
// som er de vi kan velge mellom i spillet.
pokemons.forEach(async (pokemon) => {
    const urlApi = `https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`;
    try {
        const response = await fetch(urlApi);
        const data = await response.json();
        console.log(data.name);
        pokemon.health = Math.round(data.stats[0].base_stat);
        pokemon.attack = Math.round(data.stats[1].base_stat / 5);
        pokemon.speed = Math.round(data.stats[5].base_stat / 10);
    } catch (error) {
        console.error("Kunne ikke laste pokemoner!" + error);
    }
});
const playArea = document.querySelector(".play-area");

setTimeout(theGame, 500);
function theGame() {
    // Setter alle startvariabler
    let Xspeed1 = 0;
    let Yspeed1 = 0;
    let moveLeft1 = false; // Setter at den skal stå i ro ved start
    let moveRight1 = false;
    let moveUp1 = false;
    let moveDown1 = false;

    let Xspeed2 = 0;
    let Yspeed2 = 0;
    let moveLeft2 = false;
    let moveRight2 = false;
    let moveUp2 = false;
    let moveDown2 = false;

    let attackPossible = false; // Det er bare mulig å angripe når man berører hverandre

    // Setter opp brettet
    let canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 938;
    let surface = canvas.getContext("2d");
    playArea.append(canvas);
    // Lager spill-objektene
    let pokeObject1 = {
        x: 0,
        y: 0,
        width: pokemons[1].width,
        height: pokemons[1].height,
        speed: pokemons[1].speed,
        attack: pokemons[1].attack,
        health: pokemons[1].health,
    };
    let pokeObject2 = {
        x: 0,
        y: 0,
        width: pokemons[0].width,
        height: pokemons[0].height,
        speed: pokemons[0].speed,
        attack: pokemons[0].attack,
    };
    let player1 = Object.create(pokeObject1);
    player1.x = 100; // Startposisjon
    player1.y = 100;
    let image1 = new Image(); // Oppretter bildeobjekt
    image1.addEventListener("load", update, false); // Venter til bildet er lastet ferdig
    image1.src = `../../images/${pokemons[1].name.toLowerCase()}-right.png`;

    // Oppretter objekt av pokemon til spiller 2
    let player2 = Object.create(pokeObject2);
    player2.x = 836; //Startposisjon
    player2.y = 758;
    let image2 = new Image();
    image2.addEventListener("load", update, false);
    image2.src = `../../images/${pokemons[0].name.toLowerCase()}-left.png`;

    // Lytter etter tastetrykk
    window.addEventListener("keydown", function (e) {
        switch (e.key) {
            // Bevegelser
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
            // Så for angrep
            case "q":
                console.log("Player1 angrep");
                break;
            case "-":
                console.log("Player2 angrep");
                break;
        }
    });
    // Lytter etter tasteslipp, altså når man slipper knappen
    window.addEventListener("keyup", function (e) {
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
    });
    // Følger med på knappene som trykkes og sender pokemonene i riktig retning
    function update() {
        // lager animasjonsloopen
        window.requestAnimationFrame(update, canvas);
        player1.x += Xspeed1;
        player1.y += Yspeed1;
        player2.x += Xspeed2;
        player2.y += Yspeed2;

        if (moveUp1 && !moveDown1) {
            Yspeed1 = -pokeObject1.speed;
        }
        if (moveDown1 && !moveUp1) {
            Yspeed1 = pokeObject1.speed;
        }
        if (moveLeft1 && !moveRight1) {
            Xspeed1 = -pokeObject1.speed;
        }
        if (moveRight1 && !moveLeft1) {
            Xspeed1 = pokeObject1.speed;
        }

        if (!moveUp1 && !moveDown1) {
            Yspeed1 = 0;
        }
        if (!moveLeft1 && !moveRight1) {
            Xspeed1 = 0;
        }

        if (moveUp2 && !moveDown2) {
            Yspeed2 = -pokeObject2.speed;
        }
        if (moveDown2 && !moveUp2) {
            Yspeed2 = pokeObject2.speed;
        }
        if (moveLeft2 && !moveRight2) {
            Xspeed2 = -pokeObject2.speed;
        }
        if (moveRight2 && !moveLeft2) {
            Xspeed2 = pokeObject2.speed;
        }
        if (!moveUp2 && !moveDown2) {
            Yspeed2 = 0;
        }
        if (!moveLeft2 && !moveRight2) {
            Xspeed2 = 0;
        }
        // Ser til at vi holder oss innafor gjerdet
        if (player1.x < 0) {
            player1.x = 0;
        }
        if (player1.y < 0) {
            player1.y = 0;
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
        if (detectContact(pokeObject1, pokeObject2)) {
            console.log("impakt");
            attackPossible = true;
        }
        render();
    }
    // Skriver endringene ut på skjermen
    function render() {
        surface.clearRect(0, 0, canvas.width, canvas.height); // Sletter fra canvas
        // Tegner på overflaten til canvas
        surface.drawImage(
            image1, // Tegner spiller 1s bevegelser
            Math.floor(player1.x), // Tegner x-posisjonen (Så viktig at x står på denne posisjonen)
            Math.floor(player1.y), // Tegner y-posisjonen
            player1.width, // Tegner bredden, så viktig at bredden står på denne posisjonen, samme som i pokeObject
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

    function detectContact(pokeObject1, pokeObject2) {
        // Vi finner ut når spiller1 og spiller2 berører hverandre
        if (
            player2.x > player1.x &&
            player2.x < player1.x + player1.width &&
            player2.y > player1.y &&
            player2.y < player1.y + player1.height
        ) {
            return true;
        } else {
            return false;
        }
    }
}
