// Finner alle pokemons fra apiet og leggerer de i en liste
let pokemons = []; // Her lagrer vi de ferdige pokemons, som skal være vårt 'api'
let pokeContainer = []; // Mellomlager
let favorites = []; // Her lagrer vi de favorittene brukeren har valgt
let types = []; // Her lagrer vi typene vi henter ut
let display = document.querySelector(".display");
// Lager et array med alle typene pokemons

// Sjekker om det ligger noe i localStorage
readLocalStorage();
function readLocalStorage() {
    if (localStorage.getItem("storedFavorites")) {
        favorites = JSON.parse(localStorage.getItem("storedFavorites"));
        console.log("Hentet fra favoritter localStorage: ");
    } else {
        console.log("Ingen favoritter funnet i localStorage");
    }
    if (localStorage.getItem("storedPokemons")) {
        pokemons = JSON.parse(localStorage.getItem("storedPokemons"));
        console.log("Hentet pokemons fra localStorage: ");
        assembleCards();
    } else {
        catchEmAll();
    }
}

// Fanger 50 tilfeldige pokemons
async function catchEmAll() {
    let collection = []; // Her legger vi rådataene fra apiet
    try {
        // Henter pokemons fra api
        const response = await fetch(
            "https://pokeapi.co/api/v2/pokemon?limit=50"
        );
        const data = await response.json();
        pokeContainer = data.results;
        setTimeout(buildPokemons(), 500);
    } catch (error) {
        console.error("Sliter med å laste ned pokemons..! " + error);
    }
}
// Fetcher og sorterer detaljene vi trenger om pokemonene
// og legger dem i pokemons, som vi skal bruke videre.
function buildPokemons() {
    console.log("Bygger pokemonene");
    pokeContainer.forEach(async (pokemon) => {
        try {
            const response = await fetch(pokemon.url);
            const data = await response.json();
            // Henter ut typen, navnet og bildet på pokemonen
            let picture;
            if (!data.sprites.front_shiny) {
                picture = "../images/default.png";
            } else {
                picture = data.sprites.front_shiny;
            }
            pokemons.push({
                type: data.types[0].type.name,
                image: picture,
                name: data.name,
            });
        } catch (error) {
            console.error("Sliter med å sette sammen pokemons..! " + error);
        }
    });
    // setTimeout((pokemons = shufflePokemons()), 300);
    console.log("Lagrer..");
    setTimeout(storePokemons, 300);
    setTimeout(assembleCards, 700);
}

function storePokemons(key, array) {
    if (key === undefined || key == "") {
        key = "storedPokemons";
        array = pokemons;
    }
    localStorage.setItem(key, JSON.stringify(array));
    console.log("Lagret i localStorage: ");
}

function assembleCards() {
    pokemons.forEach((pokemon, index) => {
        const pokemonCard = document.createElement("div");
        pokemonCard.style.display = "flex";
        pokemonCard.style.flexDirection = "column";
        pokemonCard.style.width = "150px";
        pokemonCard.style.backgroundColor = "rgb(173, 216, 173, .4)";
        pokemonCard.style.padding = "7px";
        pokemonCard.style.borderRadius = "10px";
        const imgDiv = document.createElement("div");
        imgDiv.innerHTML = `<img src="${pokemon.image}" alt="${pokemons[0].name}" style="width: 150px">`;
        imgDiv.style.width = "100%";
        const imgText = document.createElement("div");
        imgText.innerHTML = `<p>Navn: ${pokemon.name}</p>`;
        imgText.innerHTML += `<p>Type: ${pokemon.type}</p>`;
        const storeBtn = document.createElement("button");
        storeBtn.innerHTML = "Lagre";
        storeBtn.addEventListener("click", () => {
            favorites.push(pokemon);
            console.log(favorites);
            storePokemons("storedFavorites", favorites);
        });
        const editBtn = document.createElement("button");
        editBtn.innerHTML = "Rediger";
        const delBtn = document.createElement("button");
        delBtn.innerHTML = "Slett";
        delBtn.style.backgroundColor = "red";
        delBtn.addEventListener("click", () => {
            pokemons.splice(index, 1);

            storePokemons();
            display.innerHTML = "";
            assembleCards();
        });

        pokemonCard.append(imgDiv, imgText, storeBtn, editBtn, delBtn);
        display.appendChild(pokemonCard);
    });
}
