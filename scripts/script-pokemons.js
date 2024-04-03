// Finner alle pokemons fra apiet og leggerer de i en liste
let pokemons = []; // Her lagrer vi de ferdige pokemons, som skal være vårt 'api'
let pokeContainer = []; // Mellomlager
let display = document.querySelector(".display");
const types = [
    "bug",
    "dark",
    "dragon",
    "electric",
    "fairy",
    "fighting",
    "fire",
    "flying",
    "ghost",
    "grass",
    "ground",
    "ice",
    "normal",
    "poison",
    "psychic",
    "rock",
    "steel",
    "water",
];

catchEmAll();
async function catchEmAll() {
    let collection = [];
    try {
        let y = 3; // Antall pokemons vi henter fra hver type
        for (let i = 0; types.length > i; i++) {
            const response = await fetch(
                `https://pokeapi.co/api/v2/type/${types[i]}`
            );
            const data = await response.json();
            collection = data.pokemon;

            // Laster ned bare to pokemons fra disse typene.
            // Da kommer vi til 50 totalt.
            if (i === 4 || i === 8 || i === 12 || i === 16) {
                y = 2;
            } else {
                y = 3;
            }
            // Henter et tilfeldig tall mellom 0 og lengden på collection
            // Får derfor tilfeldige pokemons i hver type
            for (let j = 0; y > j; j++) {
                let random = Math.floor(Math.random() * collection.length - 1);
                pokeContainer.push({
                    pokeType: `${types[i]}`,
                    pokieUrl: collection[random],
                });
            }
        }
        buildPokemons();
    } catch (error) {
        console.error("Sliter med å laste ned pokemons..! " + error);
    }
}
// Funksjon som setter sammen kortene våre
function buildPokemons() {
    pokeContainer.forEach(async (pokemon) => {
        try {
            const response = await fetch(pokemon.pokieUrl.pokemon.url);
            const data = await response.json();
            // Henter ut typen, navnet og bildet på pokemonen
            let picture;
            if (!data.sprites.front_shiny) {
                picture = "../images/default.png";
            } else {
                picture = data.sprites.front_shiny;
            }
            pokemons.push({
                type: pokemon.pokeType,
                image: picture,
                name: data.name,
            });
        } catch (error) {
            console.error("Sliter med å sette sammen pokemons..! " + error);
        }
    });
    setTimeout(assembleCards, 700);
}
function shufflePokemons(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function assembleCards() {
    // Bruker Fisher-Yates-metoden til å blande hunderasene i tilfeldig rekkefølge
    shufflePokemons(pokemons);
    pokemons.forEach((pokemon) => {
        const pokemonCard = document.createElement("div");
        pokemonCard.style.display = "flex";
        pokemonCard.style.flexDirection = "column";
        pokemonCard.style.width = "150px";
        pokemonCard.classList.add("pokemon-card");
        const imgDiv = document.createElement("div");
        imgDiv.innerHTML = `<img src="${pokemon.image}" alt="${pokemons[0].name}" style="width: 150px">`;
        imgDiv.style.width = "100%";
        const imgText = document.createElement("div");
        imgText.innerHTML = `<p>Navn: ${pokemon.name}</p>`;
        imgText.innerHTML += `<p>Type: ${pokemon.type}</p>`;
        const likeBtn = document.createElement("button");
        likeBtn.innerHTML = "Liker";
        const editBtn = document.createElement("button");
        editBtn.innerHTML = "Rediger";
        const delBtn = document.createElement("button");
        delBtn.innerHTML = "Slett";

        pokemonCard.append(imgDiv, imgText, likeBtn, editBtn, delBtn);
        display.appendChild(pokemonCard);
    });
}
