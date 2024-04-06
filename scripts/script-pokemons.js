// Finner alle pokemons fra apiet og leggerer de i en liste
let pokemons = []; // Her lagrer vi de ferdige pokemons, som skal være vårt 'api'
let pokeContainer = []; // Mellomlager
let favorites = []; // Her lagrer vi de favorittene brukeren har valgt
let types = []; // Her lagrer vi typene vi henter ut
let display = document.querySelector(".display");
let sortMenu = document.querySelector("#sort-type");
let selectedFavourites = document.querySelector(".selected-favourites");
const newPokemonBtn = document.querySelector(".create-new-pokemon");
// Lager et array med alle typene pokemons
newPokemonBtn.addEventListener("click", () => {
    console.log("Vi skal lage ny pokemon senere!");
});
// Sjekker om det ligger noe i localStorage
readLocalStorage();
function readLocalStorage() {
    if (localStorage.getItem("storedFavorites")) {
        favorites = JSON.parse(localStorage.getItem("storedFavorites"));
        console.log("Hentet fra favoritter localStorage: ");
        renderFavourites();
    } else {
        console.log("Ingen favoritter funnet i localStorage");
    }
    if (localStorage.getItem("storedPokemons")) {
        pokemons = JSON.parse(localStorage.getItem("storedPokemons"));
        console.log("Hentet pokemons fra localStorage: ");
        findTypes();
        showAllPokemons(pokemons, display);
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
            "https://pokeapi.co/api/v2/pokemon?limit=60"
        );
        const data = await response.json();
        pokeContainer = data.results;
        setTimeout(buildPokemons(), 300);
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
    setTimeout(storePokemons, 200);
    setTimeout(findTypes, 300);
    setTimeout(showAllPokemons, 500);
}

function storePokemons(key, array) {
    if (key === undefined || key == "") {
        key = "storedPokemons";
        array = pokemons;
    }
    localStorage.setItem(key, JSON.stringify(array));
    console.log("Lagret i localStorage: ");
}

function styleImageText() {}

function showAllPokemons() {
    renderPokemons(pokemons, display);
}
function findTypes() {
    // Lager et array med alle typene pokemons
    pokemons.forEach((pokemon) => {
        if (!types.includes(pokemon.type)) {
            types.push(pokemon.type);
        }
    });
    dropDownMenu();
}
function sortPokemons(sortOnType) {
    // Sorterer pokemons etter type
    let typePokemons = [];
    types.forEach((type) => {
        typePokemons = pokemons.filter(
            (pokemon) => pokemon.type === sortOnType
        );
    });
    console.log(types);
}
function dropDownMenu() {
    types.forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        sortMenu.append(option);
    });
}

sortMenu.addEventListener("change", () => {
    console.log("Vi sorterer på " + sortMenu.value);
    if (sortMenu.value == "") {
        showAllPokemons();
    } else {
        let pokemonsSorted = pokemons.filter(
            (pokemon) => pokemon.type === sortMenu.value
        );
        renderPokemons(pokemonsSorted, display);
    }
    // sortPokemons(sortMenu.value);
    // display.innerHTML = "";
    // showAllPokemons();
});

function renderPokemons(sortedArray, destination, edit) {
    if (edit === undefined) {
        edit = true;
    }
    destination.innerHTML = "";
    sortedArray.forEach((pokemon, index) => {
        const pokemonCard = document.createElement("div");
        pokemonCard.style.display = "flex";
        pokemonCard.style.flexDirection = "column";
        pokemonCard.style.width = "150px";
        pokemonCard.style.backgroundColor = "rgb(173, 216, 173, .4)";
        pokemonCard.style.padding = "7px";
        pokemonCard.style.borderRadius = "10px";
        const imgDiv = document.createElement("div");
        imgDiv.innerHTML = `<img src="${pokemon.image}" alt="${pokemon.name}" style="width: 150px">`;
        imgDiv.style.width = "100%";

        const imgText = document.createElement("div");
        imgText.style.display = "flex";
        imgText.style.flexDirection = "column";

        const nameDiv = document.createElement("div");
        nameDiv.style.display = "flex";
        nameDiv.style.width = "100%";
        nameDiv.style.justifyContent = "center";
        const nameKey = document.createElement("div");
        nameKey.innerHTML = "Navn: ";
        const nameValue = document.createElement("div");
        nameValue.innerHTML = pokemon.name;
        nameDiv.append(nameKey, nameValue);

        const typeDiv = document.createElement("div");
        typeDiv.style.display = "flex";
        typeDiv.style.width = "100%";
        typeDiv.style.justifyContent = "center";
        typeDiv.style.marginBottom = "10px";
        const typeKey = document.createElement("div");
        typeKey.innerHTML = "Type: ";
        const typeValue = document.createElement("div");
        typeValue.innerHTML = pokemon.type;
        typeValue.style.alignContent = "center";
        typeDiv.append(typeKey, typeValue);

        imgText.append(nameDiv, typeDiv);
        const delBtn = document.createElement("button");
        delBtn.innerHTML = "Slett";
        delBtn.style.backgroundColor = "red";
        delBtn.addEventListener("click", () => {
            sortedArray.splice(index, 1);
            storePokemons();
            display.innerHTML = "";
            showAllPokemons();
            renderFavourites();
        });

        if (edit) {
            const storeBtn = document.createElement("button");
            storeBtn.innerHTML = "Liker";
            storeBtn.addEventListener("click", () => {
                // Sjekker om pokemonen allerede finnes i favourites
                if (favorites.some((fav) => fav.name === pokemon.name)) {
                    alert("Pokemonen er allerede i favorittene");
                } else {
                    favorites.push(pokemon);
                    storePokemons("storedFavorites", favorites);
                    renderFavourites();
                }
            });
            const editBtn = document.createElement("button");
            editBtn.innerHTML = "Rediger";
            editBtn.addEventListener("click", () => {
                console.log("Rediger");
                const editName = document.createElement("input");
                editName.value = pokemon.name;
                nameValue.innerHTML = "";
                nameDiv.style.flexWrap = "wrap";
                const storeEditBtn = document.createElement("button");
                storeEditBtn.innerHTML = "Lagre endringene";
                storeEditBtn.style.marginTop = "5px";
                storeEditBtn.addEventListener("click", () => {
                    pokemon.name = editName.value;
                    pokemon.type = editType.value;
                    nameValue.innerHTML = editName.value;
                    typeValue.innerHTML = editType.value;
                    storePokemons();
                    display.innerHTML = "";
                    showAllPokemons();
                });
                typeDiv.appendChild(storeEditBtn);

                const editType = document.createElement("input");
                editType.value = pokemon.type;
                typeValue.innerHTML = "";
                nameValue.append(editName);
                typeValue.append(editType);
                typeDiv.style.flexWrap = "wrap";
                typeDiv.style.marginBottom = "10px";
            });

            pokemonCard.append(imgDiv, imgText, storeBtn, editBtn, delBtn);
        } else {
            pokemonCard.append(imgDiv, imgText, delBtn);
        }

        destination.appendChild(pokemonCard);
    });
}

function renderFavourites() {
    let edit = false;
    renderPokemons(favorites, selectedFavourites, edit);
}
