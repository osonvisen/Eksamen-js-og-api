// Lager arrayet med spillerne våre. Jeg har forhåndsvalgt
// 4 pokemoner, som jeg henter ut statsene for fra apiet.
// Bildene er hentet fra https://www.stickpng.com/search?q=pokemon
let pokemons = [
    {
        name: "Pikachu",
        width: 64,
        height: 70,
        image: "../../images/pikachu-right.png",
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
        image: "../../images/squirtle-right.png",
    },
    {
        name: "Bulbasaur",
        width: 80,
        height: 80,
        image: "../../images/bulbasaur-right.png",
    },
];
// Setter variabler vi trenger
let player1choise;
let player2choise;
let chosingPlayer = 1; // Setter at spiller 1 er første til å velge
let player1wins = 0;
let player2wins = 0;
// Så sjekker vi om det finnes noe i localStorage
// og laster inn det som finnes der. Hvis ikke, starter fetchen.
readLocalStorage();
function readLocalStorage() {
    if (localStorage.getItem("players")) {
        pokemons = JSON.parse(localStorage.getItem("players"));
        setTimeout(chosePlayer, 250);
    } else {
        fetchPokemonPlayers();
    }
    if (localStorage.getItem("wins")) {
        let wins = JSON.parse(localStorage.getItem("wins"));
        player1wins = wins.player1;
        player2wins = wins.player2;
    }
}
// Lagrer til localStorage når det trengs
function storePokemons() {
    localStorage.setItem("players", JSON.stringify(pokemons));
    chosePlayer();
}
// Fetcher stats fra api og legger inn i pokemons
// som er de vi kan velge mellom i spillet.
function fetchPokemonPlayers() {
    pokemons.forEach(async (pokemon) => {
        const urlApi = `https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`;
        try {
            const response = await fetch(urlApi);
            const data = await response.json();
            pokemon.health = Math.round(data.stats[0].base_stat);
            pokemon.attack = Math.round(data.stats[1].base_stat / 5);
            pokemon.speed = Math.round(data.stats[5].base_stat / 10);
            setTimeout(storePokemons, 200);
        } catch (error) {
            console.error("Kunne ikke laste pokemoner!" + error);
        }
    });
}
// Definerer områder som vi skal kunne kontrollere
const playArea = document.querySelector(".play-area");
const scores = document.querySelector(".scores");
const attribution = document.querySelector(".attribution");

// Skjuler noen elementer foreløpig
scores.style.visibility = "hidden";
attribution.style.visibility = "hidden";

function chosePlayer() {
    playArea.innerHTML = "";
    const viewPokemons = document.createElement("div"); // Inneholder alle pokemonene vi kan velge mellom
    const choseDiv = document.createElement("div");
    choseDiv.innerHTML = `<h2>Velg en pokemon for spiller ${chosingPlayer}</h2>`;

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "space-between";

    viewPokemons.classList.add("view-pokemons");
    viewPokemons.style.display = "flex";
    viewPokemons.style.flexDirection = "column";

    pokemons.forEach((pokemon, index) => {
        const pokemonDiv = document.createElement("div");
        if (chosingPlayer === 2 && index == player1choise) {
            return;
        }
        pokemonDiv.style.display = "flex";
        pokemonDiv.style.flexDirection = "column";
        const imageDiv = document.createElement("div");
        const image = document.createElement("img");
        image.src = pokemon.image;
        image.style.height = "160px";
        const textDiv = document.createElement("div");
        textDiv.innerHTML = `${pokemon.name}<br>Health: ${pokemon.health}<br>Attack: ${pokemon.attack}<br>Speed: ${pokemon.speed}`;
        imageDiv.append(image);
        pokemonDiv.append(imageDiv, textDiv);
        container.append(pokemonDiv);
        viewPokemons.append(choseDiv, container);

        image.addEventListener("click", (event) => {
            image.removeEventListener("click", (event) => {});
            if (chosingPlayer === 1) {
                player1choise = index;

                nextPlayer();
            } else if (chosingPlayer === 2) {
                player2choise = index;
                theGame();
            }
        });
    });

    playArea.append(viewPokemons);
}
function nextPlayer() {
    playArea.innerHTML = "";
    chosingPlayer++;
    setTimeout(chosePlayer, 250);
}
// setTimeout(theGame, 500);
function theGame() {
    // Setter alle startvariabler
    // chosingPlayer--; // Setter denne tilbake før neste spill
    playArea.innerHTML = "";
    scores.style.visibility = "visible";
    attribution.style.visibility = "visible";
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
    let playerObject1 = {
        x: 0,
        y: 0,
        width: pokemons[player1choise].width,
        height: pokemons[player1choise].height,
        speed: pokemons[player1choise].speed,
        attack: pokemons[player1choise].attack,
        health: pokemons[player1choise].health,
        name: pokemons[player1choise].name,
        image: pokemons[player1choise].image,
        healthBar: document.querySelector(".life-player-1"),
    };
    let playerObject2 = {
        x: 0,
        y: 0,
        width: pokemons[player2choise].width,
        height: pokemons[player2choise].height,
        speed: pokemons[player2choise].speed,
        attack: pokemons[player2choise].attack,
        health: pokemons[player2choise].health,
        name: pokemons[player2choise].name,
        image: pokemons[player2choise].image,
        healthBar: document.querySelector(".life-player-2"),
    };
    let player1 = Object.create(playerObject1);
    player1.x = 100; // Startposisjon
    player1.y = 100;
    let image1 = new Image(); // Oppretter bildeobjekt
    image1.addEventListener("load", update, false); // Venter til bildet er lastet ferdig
    image1.src = `../../images/${pokemons[
        player1choise
    ].name.toLowerCase()}-right.png`;

    // Oppretter objekt av pokemon til spiller 2
    let player2 = Object.create(playerObject2);
    player2.x = 836; //Startposisjon
    player2.y = 758;
    let image2 = new Image();
    image2.addEventListener("load", update, false);
    image2.src = `../../images/${pokemons[
        player2choise
    ].name.toLowerCase()}-left.png`;

    // Skriver ut informasjon
    const totalLife1 = document.querySelector(".total-life-1");
    const totalLife2 = document.querySelector(".total-life-2");
    const player1Name = document.querySelector(".player1-name");
    const player2Name = document.querySelector(".player2-name");
    const wins1 = document.querySelector(".wins-1");
    const wins2 = document.querySelector(".wins-2");
    totalLife1.innerHTML = player1.health;
    totalLife2.innerHTML = player2.health;
    player1.healthBar.innerHTML = player1.health;
    player2.healthBar.innerHTML = player2.health;
    player1Name.innerHTML = player1.name;
    player2Name.innerHTML = player2.name;
    wins1.innerHTML = `- Wins: ${player1wins}`;
    wins2.innerHTML = `- Wins: ${player2wins}`;
    // Lytter etter tastetrykk
    window.addEventListener("keydown", playerKeyDown);
    function playerKeyDown(e) {
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
                // attacks(1, 2);
                attacks(player1, player2);
                break;
            case "-":
                // attacks(2, 1);
                attacks(player2, player1);
                break;
        }
    }
    // Lytter etter tasteslipp, altså når man slipper knappen
    window.addEventListener("keyup", playerKeyUp);
    function playerKeyUp(e) {
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
    }
    // Følger med på knappene som trykkes og sender pokemonene i riktig retning
    function update() {
        // lager animasjonsloopen
        window.requestAnimationFrame(update, canvas);
        player1.x += Xspeed1;
        player1.y += Yspeed1;
        player2.x += Xspeed2;
        player2.y += Yspeed2;

        if (moveUp1 && !moveDown1) {
            Yspeed1 = -playerObject1.speed;
        }
        if (moveDown1 && !moveUp1) {
            Yspeed1 = playerObject1.speed;
        }
        if (moveLeft1 && !moveRight1) {
            Xspeed1 = -playerObject1.speed;
        }
        if (moveRight1 && !moveLeft1) {
            Xspeed1 = playerObject1.speed;
        }

        if (!moveUp1 && !moveDown1) {
            Yspeed1 = 0;
        }
        if (!moveLeft1 && !moveRight1) {
            Xspeed1 = 0;
        }

        if (moveUp2 && !moveDown2) {
            Yspeed2 = -playerObject2.speed;
        }
        if (moveDown2 && !moveUp2) {
            Yspeed2 = playerObject2.speed;
        }
        if (moveLeft2 && !moveRight2) {
            Xspeed2 = -playerObject2.speed;
        }
        if (moveRight2 && !moveLeft2) {
            Xspeed2 = playerObject2.speed;
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
        // Sjekker om pokemonene er i kontakt med hverandre
        if (detectContact(playerObject1, playerObject2)) {
            console.log("Angrep");
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
    function detectContact(playerObject1, playerObject2) {
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
    function attacks(attacker, defender) {
        // Når en av spillerne angriper:
        if (attackPossible) {
            updateHealth(attacker, defender);
        }
    }
    function updateHealth(attacker, defender) {
        defender.healthBar.innerHTML = defender.health -= attacker.attack;
        checkIfAlive(attacker, defender);
    }
    function checkIfAlive(attacker, defender) {
        if (defender.health <= 0) {
            gameOver(attacker, defender);
        }
    }
    function gameOver(attacker, defender) {
        if (attacker.name == playerObject1.name) {
            player1wins++;
            wins1.innerHTML = player1wins;
        } else if (attacker.name == playerObject2.name) {
            player2wins++;
            wins2.innerHTML = player2wins;
        }
        saveWins();
        console.log(defender.name + " døde av angrepet fra " + attacker.name);
        defender.healthBar.innerHTML = "0";
        window.removeEventListener("keydown", playerKeyDown);
        window.removeEventListener("keyup", playerKeyUp);
        attackPossible = false;
        player1 = "";
        player2 = "";
        playArea.innerHTML = "";
        attribution.style.visibility = "hidden";
        const winnerDiv = document.createElement("div");
        const winner = document.createElement("img");
        winner.src = attacker.image;
        const winnerText = document.createElement("div");
        winnerText.innerHTML = `Spiller ${attacker.name} har vunnet!`;

        const playAgainBtn = document.createElement("button");
        playAgainBtn.textContent = "Spill en runde til!";
        playAgainBtn.addEventListener("click", startAgain);
        winnerDiv.append(winner, winnerText, playAgainBtn);
        playArea.appendChild(winnerDiv);
    }
}
function startAgain() {
    window.location.reload();
}
function saveWins() {
    let wins = {
        player1: player1wins,
        player2: player2wins,
    };
    localStorage.setItem("wins", JSON.stringify(wins));
}
